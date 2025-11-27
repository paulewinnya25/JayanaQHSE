const jwt = require('jsonwebtoken');
const { getDatabaseType, getPool, getSupabase } = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');
    
    const dbType = getDatabaseType();
    let result;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role, chantier_id')
        .eq('id', decoded.userId)
        .single();
      
      if (error || !data) {
        return res.status(401).json({ message: 'User not found' });
      }
      result = { rows: [data] };
    } else {
      const pool = getPool();
      result = await pool.query('SELECT id, email, first_name, last_name, role, chantier_id FROM users WHERE id = $1', [decoded.userId]);
    }
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    next();
  };
};

module.exports = { auth, authorize };

