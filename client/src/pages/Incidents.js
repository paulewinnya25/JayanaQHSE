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
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  FindInPage as FindInPageIcon,
  Build as BuildIcon,
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

        {/* View Dialog - Amélioré */}
        <Dialog 
          open={viewDialog} 
          onClose={() => setViewDialog(false)} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            },
          }}
        >
          {selectedIncident && (
            <>
              <DialogTitle
                sx={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  py: 3,
                  px: 4,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 28, color: 'white' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {selectedIncident.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={selectedIncident.type || 'Non spécifié'}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={selectedIncident.severity || 'Non spécifié'}
                        size="small"
                        sx={{
                          bgcolor: selectedIncident.severity === 'grave' 
                            ? 'rgba(239, 68, 68, 0.9)' 
                            : selectedIncident.severity === 'moyen'
                            ? 'rgba(245, 158, 11, 0.9)'
                            : 'rgba(34, 197, 94, 0.9)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 4 }}>
                  {/* Informations principales */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: 'grey.50',
                          border: '1px solid',
                          borderColor: 'grey.200',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateY(-2px)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <EventIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Date de l'incident
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {selectedIncident.date_incident
                            ? new Date(selectedIncident.date_incident).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : 'Non spécifiée'}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: 'grey.50',
                          border: '1px solid',
                          borderColor: 'grey.200',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateY(-2px)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Localisation
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {selectedIncident.location || 'Non spécifiée'}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Description */}
                  {selectedIncident.description && (
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <DescriptionIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Description
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: 'grey.50',
                          border: '1px solid',
                          borderColor: 'grey.200',
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                          {selectedIncident.description}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Enquête */}
                  {selectedIncident.investigation && (
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <SearchIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Enquête
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: 'grey.50',
                          border: '1px solid',
                          borderColor: 'grey.200',
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                          {selectedIncident.investigation}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Cause racine */}
                  {selectedIncident.root_cause && (
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <FindInPageIcon sx={{ color: 'error.main', fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Cause Racine
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: 'error.50',
                          border: '1px solid',
                          borderColor: 'error.200',
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                          {selectedIncident.root_cause}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Actions correctives */}
                  {selectedIncident.corrective_actions && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <BuildIcon sx={{ color: 'success.main', fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Actions Correctives
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: 'success.50',
                          border: '1px solid',
                          borderColor: 'success.200',
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                          {selectedIncident.corrective_actions}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'grey.200' }}>
                <Button
                  onClick={() => setViewDialog(false)}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'grey.300',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setViewDialog(false);
                    setEditing(selectedIncident);
                    setFormData({
                      title: selectedIncident.title || '',
                      type: selectedIncident.type || '',
                      severity: selectedIncident.severity || '',
                      date_incident: selectedIncident.date_incident
                        ? new Date(selectedIncident.date_incident).toISOString().split('T')[0]
                        : '',
                      location: selectedIncident.location || '',
                      description: selectedIncident.description || '',
                      investigation: selectedIncident.investigation || '',
                      root_cause: selectedIncident.root_cause || '',
                      corrective_actions: selectedIncident.corrective_actions || '',
                    });
                    setOpen(true);
                  }}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
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
                  Modifier
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Layout>
  );
}

