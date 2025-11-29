const express = require('express');
const { getDatabaseType, getSupabase, getPool } = require('../config/database');
const { auth } = require('../middleware/auth');
const { formatFullName } = require('../config/supabaseHelpers');

const router = express.Router();

// Get all equipment
router.get('/equipment', auth, async (req, res) => {
  try {
    const { chantier_id, type, status } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('equipment').select('*');
      
      const filterChantierId = chantier_id || req.user.chantier_id;
      if (filterChantierId) {
        query = query.eq('chantier_id', filterChantierId);
      }
      
      if (type) query = query.eq('type', type);
      if (status) query = query.eq('status', status);
      
      query = query.order('next_maintenance', { ascending: true });
      
      const { data: equipment, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les relations et compter les maintenances
      const equipmentIds = equipment.map(e => e.id);
      const userIds = [...new Set(equipment.map(e => e.responsible_user_id).filter(Boolean))];
      const chantierIds = [...new Set(equipment.map(e => e.chantier_id).filter(Boolean))];
      
      // Compter les maintenances par équipement
      const { data: maintenanceRecords } = await supabase
        .from('maintenance_records')
        .select('equipment_id')
        .in('equipment_id', equipmentIds);
      
      const maintenanceCounts = {};
      (maintenanceRecords || []).forEach(mr => {
        maintenanceCounts[mr.equipment_id] = (maintenanceCounts[mr.equipment_id] || 0) + 1;
      });
      
      // Récupérer users et chantiers
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: chantiers } = await supabase
        .from('chantiers')
        .select('id, name')
        .in('id', chantierIds);
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const chantiersMap = {};
      (chantiers || []).forEach(c => { chantiersMap[c.id] = c; });
      
      const result = (equipment || []).map(eq => ({
        ...eq,
        responsible_name: formatFullName(usersMap[eq.responsible_user_id]),
        chantier_name: chantiersMap[eq.chantier_id]?.name || null,
        maintenance_count: maintenanceCounts[eq.id] || 0
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
    let query = `
      SELECT e.*, 
             u.first_name || ' ' || u.last_name as responsible_name,
             c.name as chantier_name,
             (SELECT COUNT(*) FROM maintenance_records mr WHERE mr.equipment_id = e.id) as maintenance_count
      FROM equipment e
      LEFT JOIN users u ON e.responsible_user_id = u.id
      LEFT JOIN chantiers c ON e.chantier_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (chantier_id) {
      query += ` AND e.chantier_id = $${paramCount++}`;
      params.push(chantier_id);
    } else if (req.user.chantier_id) {
      query += ` AND e.chantier_id = $${paramCount++}`;
      params.push(req.user.chantier_id);
    }

    if (type) {
      query += ` AND e.type = $${paramCount++}`;
      params.push(type);
    }

    if (status) {
      query += ` AND e.status = $${paramCount++}`;
      params.push(status);
    }

    query += ' ORDER BY e.next_maintenance ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching equipment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get equipment due for maintenance
router.get('/equipment/due', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      // Calculer la date limite
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(days));
      
      let query = supabase
        .from('equipment')
        .select('*')
        .eq('status', 'active')
        .lte('next_maintenance', dueDate.toISOString().split('T')[0])
        .order('next_maintenance', { ascending: true });
      
      const { data: equipment, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les relations
      const userIds = [...new Set(equipment.map(e => e.responsible_user_id).filter(Boolean))];
      const chantierIds = [...new Set(equipment.map(e => e.chantier_id).filter(Boolean))];
      
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: chantiers } = await supabase
        .from('chantiers')
        .select('id, name')
        .in('id', chantierIds);
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const chantiersMap = {};
      (chantiers || []).forEach(c => { chantiersMap[c.id] = c; });
      
      const result = (equipment || []).map(eq => ({
        ...eq,
        responsible_name: formatFullName(usersMap[eq.responsible_user_id]),
        chantier_name: chantiersMap[eq.chantier_id]?.name || null
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
    const result = await pool.query(`
      SELECT e.*, 
             u.first_name || ' ' || u.last_name as responsible_name,
             c.name as chantier_name
      FROM equipment e
      LEFT JOIN users u ON e.responsible_user_id = u.id
      LEFT JOIN chantiers c ON e.chantier_id = c.id
      WHERE e.next_maintenance <= CURRENT_DATE + INTERVAL '${days} days'
      AND e.status = 'active'
      ORDER BY e.next_maintenance ASC
    `);
    res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching due equipment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single equipment
router.get('/equipment/:id', auth, async (req, res) => {
  try {
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: equipment, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', req.params.id)
        .single();
      
      if (error || !equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      
      // Récupérer les relations
      const { data: user } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('id', equipment.responsible_user_id)
        .single();
      
      const { data: chantier } = await supabase
        .from('chantiers')
        .select('id, name')
        .eq('id', equipment.chantier_id)
        .single();
      
      // Récupérer l'historique de maintenance
      const { data: maintenanceRecords } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('equipment_id', req.params.id)
        .order('date_performed', { ascending: false });
      
      // Récupérer les infos des utilisateurs qui ont effectué les maintenances
      const performedByIds = [...new Set(maintenanceRecords?.map(mr => mr.performed_by).filter(Boolean) || [])];
      const { data: performers } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', performedByIds);
      
      const performersMap = {};
      (performers || []).forEach(p => { performersMap[p.id] = p; });
      
      const maintenanceHistory = (maintenanceRecords || []).map(mr => ({
        ...mr,
        performed_by_name: formatFullName(performersMap[mr.performed_by])
      }));
      
      res.json({
        ...equipment,
        responsible_name: formatFullName(user),
        chantier_name: chantier?.name || null,
        maintenance_history: maintenanceHistory
      });
    } else {
      // PostgreSQL fallback
      const pool = getPool();
    const equipmentResult = await pool.query(`
      SELECT e.*, 
             u.first_name || ' ' || u.last_name as responsible_name,
             c.name as chantier_name
      FROM equipment e
      LEFT JOIN users u ON e.responsible_user_id = u.id
      LEFT JOIN chantiers c ON e.chantier_id = c.id
      WHERE e.id = $1
    `, [req.params.id]);

    if (equipmentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const maintenanceResult = await pool.query(`
      SELECT mr.*, u.first_name || ' ' || u.last_name as performed_by_name
      FROM maintenance_records mr
      LEFT JOIN users u ON mr.performed_by = u.id
      WHERE mr.equipment_id = $1
      ORDER BY mr.date_performed DESC
    `, [req.params.id]);

    res.json({
      ...equipmentResult.rows[0],
      maintenance_history: maintenanceResult.rows
    });
    }
  } catch (error) {
    console.error('❌ Error fetching equipment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create equipment
router.post('/equipment', auth, async (req, res) => {
  try {
    const { chantier_id, name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, responsible_user_id } = req.body;
    const dbType = getDatabaseType();
    
    const equipmentData = {
      chantier_id: chantier_id || req.user.chantier_id,
      name,
      type,
      serial_number,
      manufacturer,
      purchase_date,
      last_maintenance,
      next_maintenance,
      responsible_user_id
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('equipment')
        .insert(equipmentData)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
    const result = await pool.query(
      `INSERT INTO equipment (chantier_id, name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, responsible_user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
        [equipmentData.chantier_id, equipmentData.name, equipmentData.type, equipmentData.serial_number, equipmentData.manufacturer, equipmentData.purchase_date, equipmentData.last_maintenance, equipmentData.next_maintenance, equipmentData.responsible_user_id]
    );

    res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating equipment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update equipment
router.put('/equipment/:id', auth, async (req, res) => {
  try {
    const { name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, status, responsible_user_id } = req.body;
    const dbType = getDatabaseType();
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (serial_number !== undefined) updateData.serial_number = serial_number;
    if (manufacturer !== undefined) updateData.manufacturer = manufacturer;
    if (purchase_date !== undefined) updateData.purchase_date = purchase_date;
    if (last_maintenance !== undefined) updateData.last_maintenance = last_maintenance;
    if (next_maintenance !== undefined) updateData.next_maintenance = next_maintenance;
    if (status !== undefined) updateData.status = status;
    if (responsible_user_id !== undefined) updateData.responsible_user_id = responsible_user_id;
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('equipment')
        .update(updateData)
        .eq('id', req.params.id)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ message: 'Equipment not found' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      
      res.json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
    const result = await pool.query(
      `UPDATE equipment 
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           serial_number = COALESCE($3, serial_number),
           manufacturer = COALESCE($4, manufacturer),
           purchase_date = COALESCE($5, purchase_date),
           last_maintenance = COALESCE($6, last_maintenance),
           next_maintenance = COALESCE($7, next_maintenance),
           status = COALESCE($8, status),
           responsible_user_id = COALESCE($9, responsible_user_id)
       WHERE id = $10
       RETURNING *`,
      [name, type, serial_number, manufacturer, purchase_date, last_maintenance, next_maintenance, status, responsible_user_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error updating equipment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create maintenance record
router.post('/records', auth, async (req, res) => {
  try {
    const { equipment_id, type, description, date_performed, next_due_date, cost } = req.body;
    const dbType = getDatabaseType();
    
    const recordData = {
      equipment_id,
      type,
      description,
      performed_by: req.user.id,
      date_performed: date_performed || new Date().toISOString(),
      next_due_date,
      cost
    };
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert(recordData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update equipment last_maintenance and next_maintenance
      if (next_due_date) {
        await supabase
          .from('equipment')
          .update({
            last_maintenance: recordData.date_performed,
            next_maintenance: next_due_date
          })
          .eq('id', equipment_id);
      }
      
      res.status(201).json(data);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
    const result = await pool.query(
      `INSERT INTO maintenance_records (equipment_id, type, description, performed_by, date_performed, next_due_date, cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
        [recordData.equipment_id, recordData.type, recordData.description, recordData.performed_by, recordData.date_performed, recordData.next_due_date, recordData.cost]
    );

    // Update equipment last_maintenance and next_maintenance
    if (next_due_date) {
      await pool.query(
        `UPDATE equipment 
         SET last_maintenance = $1, next_maintenance = $2
         WHERE id = $3`,
          [recordData.date_performed, next_due_date, equipment_id]
      );
    }

    res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating maintenance record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get maintenance records
router.get('/records', auth, async (req, res) => {
  try {
    const { equipment_id } = req.query;
    const dbType = getDatabaseType();
    
    if (dbType === 'supabase') {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      let query = supabase.from('maintenance_records').select('*');
      
      if (equipment_id) {
        query = query.eq('equipment_id', equipment_id);
      }
      
      query = query.order('date_performed', { ascending: false });
      
      const { data: records, error } = await query;
      
      if (error) throw error;
      
      // Récupérer les relations
      const equipmentIds = [...new Set(records.map(r => r.equipment_id).filter(Boolean))];
      const userIds = [...new Set(records.map(r => r.performed_by).filter(Boolean))];
      
      const { data: equipment } = await supabase
        .from('equipment')
        .select('id, name, type')
        .in('id', equipmentIds);
      
      const { data: users } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const equipmentMap = {};
      (equipment || []).forEach(e => { equipmentMap[e.id] = e; });
      
      const usersMap = {};
      (users || []).forEach(u => { usersMap[u.id] = u; });
      
      const result = (records || []).map(record => ({
        ...record,
        equipment_name: equipmentMap[record.equipment_id]?.name || null,
        equipment_type: equipmentMap[record.equipment_id]?.type || null,
        performed_by_name: formatFullName(usersMap[record.performed_by])
      }));
      
      res.json(result);
    } else {
      // PostgreSQL fallback
      const pool = getPool();
    let query = `
      SELECT mr.*, 
             e.name as equipment_name,
             e.type as equipment_type,
             u.first_name || ' ' || u.last_name as performed_by_name
      FROM maintenance_records mr
      LEFT JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN users u ON mr.performed_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    if (equipment_id) {
      query += ' AND mr.equipment_id = $1';
      params.push(equipment_id);
    }

    query += ' ORDER BY mr.date_performed DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
    }
  } catch (error) {
    console.error('❌ Error fetching maintenance records:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

