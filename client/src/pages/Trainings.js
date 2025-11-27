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
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    duration: '',
    provider: '',
    date_planned: '',
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/trainings');
      setTrainings(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (training = null) => {
    if (training) {
      setEditing(training);
      setFormData({
        title: training.title || '',
        description: training.description || '',
        type: training.type || '',
        duration: training.duration || '',
        provider: training.provider || '',
        date_planned: training.date_planned || '',
      });
    } else {
      setEditing(null);
      setFormData({
        title: '',
        description: '',
        type: '',
        duration: '',
        provider: '',
        date_planned: new Date().toISOString().split('T')[0],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setFormData({
      title: '',
      description: '',
      type: '',
      duration: '',
      provider: '',
      date_planned: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`/trainings/${editing.id}`, formData);
        toast.success('Formation mise à jour');
      } else {
        await axios.post('/trainings', formData);
        toast.success('Formation créée');
      }
      fetchTrainings();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/trainings/${id}`, {
        status: 'completed',
        date_realized: new Date().toISOString().split('T')[0],
      });
      toast.success('Formation marquée comme complétée');
      fetchTrainings();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await axios.delete(`/trainings/${id}`);
        toast.success('Formation supprimée');
        fetchTrainings();
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
    total: trainings.length,
    planned: trainings.filter((t) => t.status === 'planned').length,
    completed: trainings.filter((t) => t.status === 'completed').length,
    inProgress: trainings.filter((t) => t.status === 'in_progress').length,
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
            Sensibilisation et Formation
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
            Nouvelle Formation
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Formations
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
                <TableCell sx={{ fontWeight: 700 }}>Durée (h)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Organisme</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date prévue</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date réalisée</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Participants</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Aucune formation enregistrée</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                trainings.map((training) => (
                  <TableRow key={training.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {training.title}
                      </Typography>
                      {training.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {training.description.substring(0, 50)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={training.type || '-'} size="small" variant="outlined" icon={<SchoolIcon />} />
                    </TableCell>
                    <TableCell>{training.duration || '-'}</TableCell>
                    <TableCell>{training.provider || '-'}</TableCell>
                    <TableCell>
                      {training.date_planned
                        ? new Date(training.date_planned).toLocaleDateString('fr-FR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {training.date_realized
                        ? new Date(training.date_realized).toLocaleDateString('fr-FR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip label={training.participant_count || 0} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={training.status === 'completed' ? 'Complétée' : training.status === 'in_progress' ? 'En cours' : 'Planifiée'}
                        size="small"
                        color={getStatusColor(training.status)}
                        icon={getStatusIcon(training.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {training.status !== 'completed' && (
                        <Tooltip title="Marquer comme complétée">
                          <IconButton
                            size="small"
                            onClick={() => handleComplete(training.id)}
                            color="success"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Modifier">
                        <IconButton size="small" onClick={() => handleOpen(training)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" onClick={() => handleDelete(training.id)} color="error">
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
            {editing ? 'Modifier la Formation' : 'Nouvelle Formation'}
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
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                <MenuItem value="habilitation">Habilitation</MenuItem>
                <MenuItem value="certification">Certification</MenuItem>
              </TextField>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Durée (heures)"
                    type="number"
                    fullWidth
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Date prévue"
                    type="date"
                    fullWidth
                    value={formData.date_planned}
                    onChange={(e) => setFormData({ ...formData, date_planned: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>
              <TextField
                label="Organisme formateur"
                fullWidth
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
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

