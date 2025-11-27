const initDatabase = async (pool) => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        chantier_id INTEGER,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create chantiers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chantiers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create risks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS risks (
        id SERIAL PRIMARY KEY,
        chantier_id INTEGER REFERENCES chantiers(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        probability INTEGER DEFAULT 1,
        severity INTEGER DEFAULT 1,
        criticality INTEGER,
        status VARCHAR(50) DEFAULT 'open',
        responsible_user_id INTEGER REFERENCES users(id),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create inspections table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inspections (
        id SERIAL PRIMARY KEY,
        chantier_id INTEGER REFERENCES chantiers(id),
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        inspector_id INTEGER REFERENCES users(id),
        date_planned DATE,
        date_realized DATE,
        status VARCHAR(50) DEFAULT 'planned',
        findings TEXT,
        photos TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create incidents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id SERIAL PRIMARY KEY,
        chantier_id INTEGER REFERENCES chantiers(id),
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date_incident TIMESTAMP NOT NULL,
        location VARCHAR(255),
        severity VARCHAR(50),
        reported_by INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'reported',
        photos TEXT[],
        medical_report TEXT,
        investigation TEXT,
        root_cause TEXT,
        corrective_actions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create trainings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trainings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(100),
        duration INTEGER,
        provider VARCHAR(255),
        date_planned DATE,
        date_realized DATE,
        status VARCHAR(50) DEFAULT 'planned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create training_participants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS training_participants (
        id SERIAL PRIMARY KEY,
        training_id INTEGER REFERENCES trainings(id),
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'registered',
        certificate_url TEXT,
        completed_at TIMESTAMP,
        expires_at DATE
      )
    `);

    // Create non_conformities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS non_conformities (
        id SERIAL PRIMARY KEY,
        chantier_id INTEGER REFERENCES chantiers(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        severity VARCHAR(50),
        detected_by INTEGER REFERENCES users(id),
        responsible_user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'open',
        corrective_action TEXT,
        due_date DATE,
        closed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create environmental_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS environmental_data (
        id SERIAL PRIMARY KEY,
        chantier_id INTEGER REFERENCES chantiers(id),
        type VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        value DECIMAL(10,2),
        unit VARCHAR(50),
        date_recorded DATE NOT NULL,
        recorded_by INTEGER REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        chantier_id INTEGER REFERENCES chantiers(id),
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        category VARCHAR(100),
        file_url TEXT,
        version VARCHAR(50),
        status VARCHAR(50) DEFAULT 'draft',
        uploaded_by INTEGER REFERENCES users(id),
        validated_by INTEGER REFERENCES users(id),
        validated_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create equipment table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS equipment (
        id SERIAL PRIMARY KEY,
        chantier_id INTEGER REFERENCES chantiers(id),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        serial_number VARCHAR(100),
        manufacturer VARCHAR(255),
        purchase_date DATE,
        last_maintenance DATE,
        next_maintenance DATE,
        status VARCHAR(50) DEFAULT 'active',
        responsible_user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create maintenance_records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS maintenance_records (
        id SERIAL PRIMARY KEY,
        equipment_id INTEGER REFERENCES equipment(id),
        type VARCHAR(100),
        description TEXT,
        performed_by INTEGER REFERENCES users(id),
        date_performed DATE NOT NULL,
        next_due_date DATE,
        cost DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contractors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contractors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        chantier_id INTEGER REFERENCES chantiers(id),
        type VARCHAR(100),
        certifications TEXT[],
        access_level VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        message TEXT,
        link TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin user (password: admin123)
    const hashedPassword = require('bcryptjs').hashSync('admin123', 10);
    await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, role)
      VALUES ('admin@qhse.com', $1, 'Admin', 'QHSE', 'superviseur_qhse')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // Create default chantier
    await pool.query(`
      INSERT INTO chantiers (name, address, city, status)
      VALUES ('Chantier Principal', '123 Rue du Chantier', 'Paris', 'active')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

module.exports = initDatabase;





