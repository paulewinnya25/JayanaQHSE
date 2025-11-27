/**
 * Script pour créer l'utilisateur admin
 * 
 * Utilisation:
 *   node scripts/create-admin.js
 * 
 * Ou depuis la racine:
 *   cd server && node scripts/create-admin.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');

async function createAdmin() {
  try {
    console.log('🔄 Création de l\'utilisateur admin...');
    
    const email = 'admin@qhse.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Utiliser Supabase pour insérer
    if (process.env.USE_SUPABASE === 'true') {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          email: email,
          password: hashedPassword,
          first_name: 'Admin',
          last_name: 'QHSE',
          role: 'superviseur_qhse'
        }, {
          onConflict: 'email'
        })
        .select();
      
      if (error) {
        console.error('❌ Erreur lors de la création:', error);
        throw error;
      }
      
      console.log('✅ Admin créé avec succès via Supabase!');
      console.log('📧 Email:', email);
      console.log('🔑 Mot de passe:', password);
    } else {
      // Utiliser PostgreSQL directement
      const pool = require('../config/database').getPool();
      
      const result = await pool.query(`
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE
        SET password = EXCLUDED.password,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            role = EXCLUDED.role
        RETURNING id, email, first_name, last_name, role
      `, [email, hashedPassword, 'Admin', 'QHSE', 'superviseur_qhse']);
      
      console.log('✅ Admin créé avec succès via PostgreSQL!');
      console.log('📧 Email:', email);
      console.log('🔑 Mot de passe:', password);
      console.log('👤 Utilisateur:', result.rows[0]);
    }
    
    console.log('\n🎉 Utilisateur admin créé!');
    console.log('\n📋 Identifiants:');
    console.log('   Email: admin@qhse.com');
    console.log('   Mot de passe: admin123');
    console.log('\n⚠️  Changez le mot de passe après la première connexion!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createAdmin();

