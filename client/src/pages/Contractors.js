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
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function Contractors() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    type: '',
    access_level: '',
  });

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await axios.get('/contractors');
      setContractors(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des sous-traitants');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (contractor = null) => {
    if (contractor) {
      setEditing(contractor);
      setFormData({
        name: contractor.name || '',
        company: contractor.company || '',
        email: contractor.email || '',
        phone: contractor.phone || '',
        type: contractor.type || '',
        access_level: contractor.access_level || '',
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        type: '',
        access_level: '',
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
        await axios.put(`/contractors/${editing.id}`, formData);
        toast.success('Sous-traitant mis à jour');
      } else {
        await axios.post('/contractors', formData);
        toast.success('Sous-traitant créé');
      }
      fetchContractors();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sous-traitant ?')) {
      try {
        await axios.delete(`/contractors/${id}`);
        toast.success('Sous-traitant supprimé');
        fetchContractors();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
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
              Gestion des Sous-traitants
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Gérez vos sous-traitants et visiteurs
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
            Nouveau Sous-traitant
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
              <TableCell>Nom</TableCell>
              <TableCell>Entreprise</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Niveau d'accès</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell>{contractor.name}</TableCell>
                <TableCell>{contractor.company || '-'}</TableCell>
                <TableCell>{contractor.email || '-'}</TableCell>
                <TableCell>{contractor.phone || '-'}</TableCell>
                <TableCell>{contractor.type || '-'}</TableCell>
                <TableCell>{contractor.access_level || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={contractor.status}
                    color={contractor.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(contractor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(contractor.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Modifier le sous-traitant' : 'Nouveau sous-traitant'}</DialogTitle>
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
            label="Entreprise"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Niveau d'accès"
            value={formData.access_level}
            onChange={(e) => setFormData({ ...formData, access_level: e.target.value })}
            margin="normal"
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





