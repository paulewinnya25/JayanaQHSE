const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// S'assurer que dotenv est chargé AVANT de charger database
require('dotenv').config();
const { getDatabaseType, getPool, getSupabase } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper function to query users
const queryUser = async (email) => {
  // S'assurer que dotenv est chargé (pour le développement local)
  // En production, les variables sont déjà dans process.env
  if (typeof require !== 'undefined') {
    try {
      require('dotenv').config();
    } catch (e) {
      // Ignore si dotenv n'est pas disponible
    }
  }
  
  // Use getDatabaseType() to determine which database to use
  const dbType = getDatabaseType();
  const supabase = getSupabase();
  
  console.log('🔍 Database check:', { 
    dbType,
    hasSupabaseClient: !!supabase,
    supabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseUrlValue: process.env.SUPABASE_URL,
    useSupabaseEnv: process.env.USE_SUPABASE,
    useSupabaseEnvType: typeof process.env.USE_SUPABASE,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('USE_SUPABASE'))
  });
  
  // Use Supabase if database type is supabase
  if (dbType === 'supabase' && supabase) {
    try {
      console.log('🔍 Querying user with Supabase:', email);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle to handle not found gracefully
      
      if (error) {
        console.error('❌ Supabase queryUser error:', error);
        // PGRST116 = table doesn't exist, which is OK if tables haven't been created yet
        if (error.code === 'PGRST116') {
          return { rows: [] };
        }
        throw error;
      }
      
      console.log('✅ User found with Supabase:', data ? 'yes' : 'no');
      return { rows: data ? [data] : [] };
    } catch (err) {
      console.error('❌ Error querying user with Supabase:', err);
      throw err;
    }
  }
  
  // If Supabase is configured but not available, throw error
  if (process.env.SUPABASE_URL || process.env.USE_SUPABASE === 'true' || process.env.USE_SUPABASE === '"true"') {
    console.error('❌ Supabase is configured but client is not available');
    throw new Error('Supabase is configured but client is not available. Please check SUPABASE_ANON_KEY in environment variables.');
  }
  
  // Fallback to PostgreSQL only if Supabase is not configured
  console.warn('⚠️ Using PostgreSQL fallback. Supabase should be configured.');
  const pool = getPool();
  if (!pool) {
    throw new Error('No database connection available. Please configure Supabase or PostgreSQL.');
  }
  return await pool.query('SELECT * FROM users WHERE email = $1', [email]);
};

const queryUserById = async (id) => {
  // Use getDatabaseType() to determine which database to use
  const dbType = getDatabaseType();
  const supabase = getSupabase();
  
  // Use Supabase if database type is supabase
  if (dbType === 'supabase' && supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role, chantier_id, phone')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('❌ Supabase queryUserById error:', error);
        throw error;
      }
      return { rows: data ? [data] : [] };
    } catch (err) {
      console.error('❌ Error querying user by ID with Supabase:', err);
      throw err;
    }
  }
  
  // If Supabase is configured but not available, throw error
  if (process.env.SUPABASE_URL || process.env.USE_SUPABASE === 'true' || process.env.USE_SUPABASE === '"true"') {
    throw new Error('Supabase is configured but client is not available. Please check SUPABASE_ANON_KEY in environment variables.');
  }
  
  // Fallback to PostgreSQL only if Supabase is not configured
  const pool = getPool();
  if (!pool) {
    throw new Error('No database connection available. Please configure Supabase or PostgreSQL.');
  }
  return await pool.query(
    'SELECT id, email, first_name, last_name, role, chantier_id, phone FROM users WHERE id = $1',
    [id]
  );
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, chantier_id, phone } = req.body;

    // Check if user exists
    const existingUser = await queryUser(email);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const dbType = getDatabaseType();
    let result;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          first_name,
          last_name,
          role,
          chantier_id,
          phone
        })
        .select('id, email, first_name, last_name, role, chantier_id')
        .single();
      
      if (error) {
        throw error;
      }
      result = { rows: [data] };
    } else {
      const pool = getPool();
      result = await pool.query(
        'INSERT INTO users (email, password, first_name, last_name, role, chantier_id, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name, role, chantier_id',
        [email, hashedPassword, first_name, last_name, role, chantier_id, phone]
      );
    }

    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      token,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt received:', { email: req.body.email, timestamp: new Date().toISOString() });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('🔍 Querying user for login:', email);
    console.log('🔍 Database type:', getDatabaseType());
    console.log('🔍 Supabase configured:', !!(process.env.SUPABASE_URL || process.env.USE_SUPABASE === 'true'));
    
    const result = await queryUser(email);
    
    console.log('🔍 Query result:', { 
      found: result.rows.length > 0,
      hasRows: !!result.rows,
      rowCount: result.rows?.length 
    });
    
    if (result.rows.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('✅ User found, checking password...');
    
    if (!user.password) {
      console.error('❌ User has no password field');
      return res.status(500).json({ message: 'User data is invalid' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password match, generating token...');
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    console.log('✅ Login successful for user:', email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        chantier_id: user.chantier_id
      }
    });
  } catch (error) {
    console.error('❌ Login error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const result = await queryUserById(req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

