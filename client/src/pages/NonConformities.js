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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function NonConformities() {
  const [ncs, setNcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'mineure',
    corrective_action: '',
    due_date: '',
  });

  useEffect(() => {
    fetchNCs();
  }, []);

  const fetchNCs = async () => {
    try {
      const response = await axios.get('/non-conformities');
      setNcs(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des non-conformités');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (nc = null) => {
    if (nc) {
      setEditing(nc);
      setFormData({
        title: nc.title || '',
        description: nc.description || '',
        category: nc.category || '',
        severity: nc.severity || 'mineure',
        corrective_action: nc.corrective_action || '',
        due_date: nc.due_date || '',
      });
    } else {
      setEditing(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        severity: 'mineure',
        corrective_action: '',
        due_date: '',
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
        await axios.put(`/non-conformities/${editing.id}`, formData);
        toast.success('Non-conformité mise à jour');
      } else {
        await axios.post('/non-conformities', formData);
        toast.success('Non-conformité créée');
      }
      fetchNCs();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette non-conformité ?')) {
      try {
        await axios.delete(`/non-conformities/${id}`);
        toast.success('Non-conformité supprimée');
        fetchNCs();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'closed') return 'success';
    if (status === 'open') return 'error';
    return 'warning';
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
              Non-conformités
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Gérez les non-conformités et actions correctives
            </Typography>
          </Box>
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
            Nouvelle Non-conformité
          </Button>
        </Box>

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
              <TableCell>Titre</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Gravité</TableCell>
              <TableCell>Date limite</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ncs.map((nc) => (
              <TableRow key={nc.id}>
                <TableCell>{nc.title}</TableCell>
                <TableCell>{nc.category || '-'}</TableCell>
                <TableCell>
                  <Chip label={nc.severity} size="small" />
                </TableCell>
                <TableCell>
                  {nc.due_date
                    ? new Date(nc.due_date).toLocaleDateString('fr-FR')
                    : '-'}
                </TableCell>
                <TableCell>{nc.responsible_name || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={nc.status}
                    color={getStatusColor(nc.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(nc)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(nc.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Modifier la non-conformité' : 'Nouvelle non-conformité'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            select
          >
            <MenuItem value="sécurité">Sécurité</MenuItem>
            <MenuItem value="environnement">Environnement</MenuItem>
            <MenuItem value="qualité">Qualité</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Gravité"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            margin="normal"
            select
          >
            <MenuItem value="mineure">Mineure</MenuItem>
            <MenuItem value="majeure">Majeure</MenuItem>
            <MenuItem value="critique">Critique</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Action corrective"
            value={formData.corrective_action}
            onChange={(e) => setFormData({ ...formData, corrective_action: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Date limite"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
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
      </Box>
    </Layout>
  );
}





