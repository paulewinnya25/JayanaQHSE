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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const SEVERITY_COLORS = {
  léger: { bg: '#e8f5e9', text: '#2e7d32' },
  moyen: { bg: '#fff3e0', text: '#f57c00' },
  grave: { bg: '#ffebee', text: '#c62828' },
};

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    date_incident: new Date().toISOString().split('T')[0],
    location: '',
    severity: 'léger',
    investigation: '',
    root_cause: '',
    corrective_actions: '',
  });

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/incidents');
      setIncidents(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (incident = null) => {
    if (incident) {
      setEditing(incident);
      setFormData({
        type: incident.type || '',
        title: incident.title || '',
        description: incident.description || '',
        date_incident: incident.date_incident
          ? new Date(incident.date_incident).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        location: incident.location || '',
        severity: incident.severity || 'léger',
        investigation: incident.investigation || '',
        root_cause: incident.root_cause || '',
        corrective_actions: incident.corrective_actions || '',
      });
    } else {
      setEditing(null);
      setFormData({
        type: '',
        title: '',
        description: '',
        date_incident: new Date().toISOString().split('T')[0],
        location: '',
        severity: 'léger',
        investigation: '',
        root_cause: '',
        corrective_actions: '',
      });
    }
    setOpen(true);
  };

  const handleView = (incident) => {
    setSelectedIncident(incident);
    setViewDialog(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setViewDialog(false);
    setSelectedIncident(null);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`/incidents/${editing.id}`, formData);
        toast.success('Incident mis à jour');
      } else {
        await axios.post('/incidents', formData);
        toast.success('Incident déclaré');
      }
      fetchIncidents();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
      try {
        await axios.delete(`/incidents/${id}`);
        toast.success('Incident supprimé');
        fetchIncidents();
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
    total: incidents.length,
    léger: incidents.filter((i) => i.severity === 'léger').length,
    moyen: incidents.filter((i) => i.severity === 'moyen').length,
    grave: incidents.filter((i) => i.severity === 'grave').length,
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Incidents et Accidents
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            color="error"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 3,
            }}
          >
            Déclarer un Incident
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Incidents
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
                  Légers
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {stats.léger}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Moyens
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {stats.moyen}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Graves
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {stats.grave}
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
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Localisation</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gravité</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Déclaré par</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Aucun incident enregistré</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                incidents.map((incident) => (
                  <TableRow key={incident.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {incident.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={incident.type || '-'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {incident.date_incident
                        ? new Date(incident.date_incident).toLocaleDateString('fr-FR')
                        : '-'}
                    </TableCell>
                    <TableCell>{incident.location || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={incident.severity || 'léger'}
                        size="small"
                        sx={{
                          bgcolor: SEVERITY_COLORS[incident.severity]?.bg || SEVERITY_COLORS.léger.bg,
                          color: SEVERITY_COLORS[incident.severity]?.text || SEVERITY_COLORS.léger.text,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={incident.status === 'reported' ? 'Déclaré' : incident.status === 'investigating' ? 'Enquête' : 'Clôturé'}
                        size="small"
                        color={incident.status === 'closed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>{incident.reported_by_name || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir détails">
                        <IconButton size="small" onClick={() => handleView(incident)} color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton size="small" onClick={() => handleOpen(incident)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" onClick={() => handleDelete(incident.id)} color="error">
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

        {/* Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            {editing ? 'Modifier l\'Incident' : 'Déclarer un Incident'}
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
                <MenuItem value="accident">Accident</MenuItem>
                <MenuItem value="presqu_accident">Presqu'accident</MenuItem>
                <MenuItem value="incident">Incident</MenuItem>
                <MenuItem value="blessure">Blessure</MenuItem>
              </TextField>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Date de l'incident"
                    type="date"
                    fullWidth
                    value={formData.date_incident}
                    onChange={(e) => setFormData({ ...formData, date_incident: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Gravité"
                    fullWidth
                    select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    required
                  >
                    <MenuItem value="léger">Léger</MenuItem>
                    <MenuItem value="moyen">Moyen</MenuItem>
                    <MenuItem value="grave">Grave</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <TextField
                label="Localisation"
                fullWidth
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              {editing && (
                <>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Enquête et Actions Correctives
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Enquête"
                          fullWidth
                          multiline
                          rows={3}
                          value={formData.investigation}
                          onChange={(e) => setFormData({ ...formData, investigation: e.target.value })}
                          placeholder="Résultats de l'enquête (5 pourquoi, arbre des causes)..."
                        />
                        <TextField
                          label="Cause racine"
                          fullWidth
                          multiline
                          rows={2}
                          value={formData.root_cause}
                          onChange={(e) => setFormData({ ...formData, root_cause: e.target.value })}
                          placeholder="Cause racine identifiée..."
                        />
                        <TextField
                          label="Actions correctives"
                          fullWidth
                          multiline
                          rows={3}
                          value={formData.corrective_actions}
                          onChange={(e) => setFormData({ ...formData, corrective_actions: e.target.value })}
                          placeholder="Actions correctives mises en place..."
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="error" sx={{ textTransform: 'none' }}>
              {editing ? 'Mettre à jour' : 'Déclarer'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialog} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            Détails de l'Incident
          </DialogTitle>
          <DialogContent>
            {selectedIncident && (
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">{selectedIncident.title}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Type
                    </Typography>
                    <Typography>{selectedIncident.type}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Gravité
                    </Typography>
                    <Typography>{selectedIncident.severity}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Date
                    </Typography>
                    <Typography>
                      {selectedIncident.date_incident
                        ? new Date(selectedIncident.date_incident).toLocaleDateString('fr-FR')
                        : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Localisation
                    </Typography>
                    <Typography>{selectedIncident.location || '-'}</Typography>
                  </Grid>
                </Grid>
                {selectedIncident.description && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Description
                    </Typography>
                    <Typography>{selectedIncident.description}</Typography>
                  </>
                )}
                {selectedIncident.investigation && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Enquête
                    </Typography>
                    <Typography>{selectedIncident.investigation}</Typography>
                  </>
                )}
                {selectedIncident.root_cause && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Cause racine
                    </Typography>
                    <Typography>{selectedIncident.root_cause}</Typography>
                  </>
                )}
                {selectedIncident.corrective_actions && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Actions correctives
                    </Typography>
                    <Typography>{selectedIncident.corrective_actions}</Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

