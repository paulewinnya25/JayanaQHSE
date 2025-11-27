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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function Inspections() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    inspector_id: '',
    date_planned: '',
    findings: '',
  });

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/inspections');
      setInspections(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des inspections');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (inspection = null) => {
    if (inspection) {
      setEditing(inspection);
      setFormData({
        type: inspection.type || '',
        title: inspection.title || '',
        inspector_id: inspection.inspector_id || '',
        date_planned: inspection.date_planned || '',
        findings: inspection.findings || '',
      });
    } else {
      setEditing(null);
      setFormData({
        type: '',
        title: '',
        inspector_id: '',
        date_planned: new Date().toISOString().split('T')[0],
        findings: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setFormData({
      type: '',
      title: '',
      inspector_id: '',
      date_planned: '',
      findings: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = { ...formData };
      if (editing) {
        await axios.put(`/inspections/${editing.id}`, submitData);
        toast.success('Inspection mise à jour');
      } else {
        await axios.post('/inspections', submitData);
        toast.success('Inspection créée');
      }
      fetchInspections();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/inspections/${id}`, {
        status: 'completed',
        date_realized: new Date().toISOString().split('T')[0],
      });
      toast.success('Inspection marquée comme complétée');
      fetchInspections();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette inspection ?')) {
      try {
        await axios.delete(`/inspections/${id}`);
        toast.success('Inspection supprimée');
        fetchInspections();
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

  const stats = {
    total: inspections.length,
    planned: inspections.filter((i) => i.status === 'planned').length,
    completed: inspections.filter((i) => i.status === 'completed').length,
    inProgress: inspections.filter((i) => i.status === 'in_progress').length,
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'success';
    if (status === 'in_progress') return 'warning';
    return 'info';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircleIcon />;
    if (status === 'in_progress') return <ScheduleIcon />;
    return <ScheduleIcon />;
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Contrôles et Inspections
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 3,
            }}
          >
            Nouvelle Inspection
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Inspections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Planifiées
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {stats.planned}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  En cours
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {stats.inProgress}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Complétées
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {stats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Titre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Inspecteur</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date prévue</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date réalisée</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chantier</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inspections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Aucune inspection enregistrée</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                inspections.map((inspection) => (
                  <TableRow key={inspection.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {inspection.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={inspection.type || '-'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{inspection.inspector_name || '-'}</TableCell>
                    <TableCell>
                      {inspection.date_planned
                        ? new Date(inspection.date_planned).toLocaleDateString('fr-FR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {inspection.date_realized
                        ? new Date(inspection.date_realized).toLocaleDateString('fr-FR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={inspection.status === 'completed' ? 'Complétée' : inspection.status === 'in_progress' ? 'En cours' : 'Planifiée'}
                        size="small"
                        color={getStatusColor(inspection.status)}
                        icon={getStatusIcon(inspection.status)}
                      />
                    </TableCell>
                    <TableCell>{inspection.chantier_name || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir détails">
                        <IconButton size="small" onClick={() => handleOpen(inspection)} color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {inspection.status !== 'completed' && (
                        <Tooltip title="Marquer comme complétée">
                          <IconButton
                            size="small"
                            onClick={() => handleComplete(inspection.id)}
                            color="success"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Modifier">
                        <IconButton size="small" onClick={() => handleOpen(inspection)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" onClick={() => handleDelete(inspection.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            {editing ? 'Modifier l\'Inspection' : 'Nouvelle Inspection'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Titre"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <TextField
                label="Type"
                fullWidth
                select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <MenuItem value="sécurité">Sécurité</MenuItem>
                <MenuItem value="environnement">Environnement</MenuItem>
                <MenuItem value="qualité">Qualité</MenuItem>
                <MenuItem value="hygiène">Hygiène</MenuItem>
              </TextField>
              <TextField
                label="Date prévue"
                type="date"
                fullWidth
                value={formData.date_planned}
                onChange={(e) => setFormData({ ...formData, date_planned: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Résultats / Constatations"
                fullWidth
                multiline
                rows={4}
                value={formData.findings}
                onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                placeholder="Décrivez les résultats de l'inspection..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none' }}>
              {editing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

