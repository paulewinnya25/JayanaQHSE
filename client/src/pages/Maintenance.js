import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function Maintenance() {
  const [equipment, setEquipment] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serial_number: '',
    manufacturer: '',
    next_maintenance: '',
  });
  const [recordData, setRecordData] = useState({
    equipment_id: '',
    type: '',
    description: '',
    date_performed: new Date().toISOString().split('T')[0],
    next_due_date: '',
    cost: '',
  });

  useEffect(() => {
    fetchEquipment();
    fetchRecords();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('/maintenance/equipment');
      setEquipment(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des équipements');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get('/maintenance/records');
      setMaintenanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleOpen = (eq = null) => {
    if (eq) {
      setEditing(eq);
      setFormData({
        name: eq.name || '',
        type: eq.type || '',
        serial_number: eq.serial_number || '',
        manufacturer: eq.manufacturer || '',
        next_maintenance: eq.next_maintenance || '',
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        type: '',
        serial_number: '',
        manufacturer: '',
        next_maintenance: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`/maintenance/equipment/${editing.id}`, formData);
        toast.success('Équipement mis à jour');
      } else {
        await axios.post('/maintenance/equipment', formData);
        toast.success('Équipement créé');
      }
      fetchEquipment();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleRecordSubmit = async () => {
    try {
      await axios.post('/maintenance/records', recordData);
      toast.success('Intervention enregistrée');
      fetchRecords();
      fetchEquipment();
      setOpenRecord(false);
      setRecordData({
        equipment_id: '',
        type: '',
        description: '',
        date_performed: new Date().toISOString().split('T')[0],
        next_due_date: '',
        cost: '',
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box
            sx={{
              animation: 'fadeIn 0.6s ease-out',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
              }}
            >
              Maintenance et Vérification
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Gérez vos équipements et maintenances
            </Typography>
          </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => setOpenRecord(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.light',
                color: 'white',
              },
            }}
          >
            Enregistrer Intervention
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
              boxShadow: '0 4px 15px 0 rgba(14, 165, 233, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                boxShadow: '0 6px 20px 0 rgba(14, 165, 233, 0.5)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Nouvel Équipement
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Équipements" />
        <Tab label="Historique des interventions" />
      </Tabs>

      {tab === 0 && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                  '& .MuiTableCell-head': {
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  },
                }}
              >
                <TableCell>Nom</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>N° Série</TableCell>
                <TableCell>Prochaine maintenance</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.type || '-'}</TableCell>
                  <TableCell>{eq.serial_number || '-'}</TableCell>
                  <TableCell>
                    {eq.next_maintenance
                      ? new Date(eq.next_maintenance).toLocaleDateString('fr-FR')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={eq.status}
                      color={eq.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpen(eq)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                  '& .MuiTableCell-head': {
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  },
                }}
              >
                <TableCell>Équipement</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Coût</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.equipment_name || '-'}</TableCell>
                  <TableCell>{record.type || '-'}</TableCell>
                  <TableCell>
                    {new Date(record.date_performed).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{record.description || '-'}</TableCell>
                  <TableCell>{record.cost ? `${record.cost} €` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Modifier l\'équipement' : 'Nouvel équipement'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            margin="normal"
            select
          >
            <MenuItem value="EPI">EPI</MenuItem>
            <MenuItem value="extincteur">Extincteur</MenuItem>
            <MenuItem value="engin">Engin</MenuItem>
            <MenuItem value="outil">Outil</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="N° Série"
            value={formData.serial_number}
            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fabricant"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Prochaine maintenance"
            type="date"
            value={formData.next_maintenance}
            onChange={(e) => setFormData({ ...formData, next_maintenance: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editing ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRecord} onClose={() => setOpenRecord(false)} maxWidth="md" fullWidth>
        <DialogTitle>Enregistrer une intervention</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Équipement"
            value={recordData.equipment_id}
            onChange={(e) => setRecordData({ ...recordData, equipment_id: e.target.value })}
            margin="normal"
            select
            required
          >
            {equipment.map((eq) => (
              <MenuItem key={eq.id} value={eq.id}>
                {eq.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Type"
            value={recordData.type}
            onChange={(e) => setRecordData({ ...recordData, type: e.target.value })}
            margin="normal"
            select
          >
            <MenuItem value="maintenance">Maintenance</MenuItem>
            <MenuItem value="vérification">Vérification</MenuItem>
            <MenuItem value="réparation">Réparation</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Description"
            value={recordData.description}
            onChange={(e) => setRecordData({ ...recordData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={recordData.date_performed}
            onChange={(e) => setRecordData({ ...recordData, date_performed: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Prochaine échéance"
            type="date"
            value={recordData.next_due_date}
            onChange={(e) => setRecordData({ ...recordData, next_due_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Coût (€)"
            type="number"
            value={recordData.cost}
            onChange={(e) => setRecordData({ ...recordData, cost: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRecord(false)}>Annuler</Button>
          <Button onClick={handleRecordSubmit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Layout>
  );
}





