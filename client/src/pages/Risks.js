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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const RISK_COLORS = {
  faible: { bg: '#e8f5e9', text: '#2e7d32' },
  moyen: { bg: '#fff3e0', text: '#f57c00' },
  élevé: { bg: '#ffebee', text: '#c62828' },
  critique: { bg: '#f3e5f5', text: '#7b1fa2' },
};

const getRiskLevel = (criticality) => {
  if (criticality <= 3) return { label: 'Faible', color: RISK_COLORS.faible };
  if (criticality <= 6) return { label: 'Moyen', color: RISK_COLORS.moyen };
  if (criticality <= 9) return { label: 'Élevé', color: RISK_COLORS.élevé };
  return { label: 'Critique', color: RISK_COLORS.critique };
};

export default function Risks() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    probability: 1,
    severity: 1,
    responsible_user_id: '',
  });

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/risks');
      setRisks(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des risques');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (risk = null) => {
    if (risk) {
      setEditing(risk);
      setFormData({
        title: risk.title || '',
        description: risk.description || '',
        category: risk.category || '',
        probability: risk.probability || 1,
        severity: risk.severity || 1,
        responsible_user_id: risk.responsible_user_id || '',
      });
    } else {
      setEditing(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        probability: 1,
        severity: 1,
        responsible_user_id: '',
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
      category: '',
      probability: 1,
      severity: 1,
      responsible_user_id: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`/risks/${editing.id}`, formData);
        toast.success('Risque mis à jour');
      } else {
        await axios.post('/risks', formData);
        toast.success('Risque créé');
      }
      fetchRisks();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce risque ?')) {
      try {
        await axios.delete(`/risks/${id}`);
        toast.success('Risque supprimé');
        fetchRisks();
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
    total: risks.length,
    open: risks.filter((r) => r.status === 'open').length,
    closed: risks.filter((r) => r.status === 'closed').length,
    critical: risks.filter((r) => r.criticality >= 9).length,
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Gestion des Risques
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
            Nouveau Risque
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total des Risques
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
                  Ouverts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {stats.open}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Fermés
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {stats.closed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Critiques
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {stats.critical}
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
                <TableCell sx={{ fontWeight: 700 }}>Catégorie</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Probabilité</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gravité</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Criticité</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chantier</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {risks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Aucun risque enregistré</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                risks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.criticality);
                  return (
                    <TableRow key={risk.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {risk.title}
                          </Typography>
                          {risk.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {risk.description.substring(0, 50)}...
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{risk.category || '-'}</TableCell>
                      <TableCell>
                        <Chip label={risk.probability} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip label={risk.severity} size="small" color="secondary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${risk.criticality} - ${riskLevel.label}`}
                          size="small"
                          sx={{
                            bgcolor: riskLevel.color.bg,
                            color: riskLevel.color.text,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={risk.status === 'open' ? 'Ouvert' : 'Fermé'}
                          size="small"
                          color={risk.status === 'open' ? 'warning' : 'success'}
                          icon={risk.status === 'open' ? <WarningIcon /> : <CheckCircleIcon />}
                        />
                      </TableCell>
                      <TableCell>{risk.chantier_name || '-'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleOpen(risk)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton size="small" onClick={() => handleDelete(risk.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            {editing ? 'Modifier le Risque' : 'Nouveau Risque'}
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
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={formData.category}
                  label="Catégorie"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="sécurité">Sécurité</MenuItem>
                  <MenuItem value="qualité">Qualité</MenuItem>
                  <MenuItem value="environnement">Environnement</MenuItem>
                  <MenuItem value="santé">Santé</MenuItem>
                </Select>
              </FormControl>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Probabilité (1-5)</InputLabel>
                    <Select
                      value={formData.probability}
                      label="Probabilité (1-5)"
                      onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gravité (1-5)</InputLabel>
                    <Select
                      value={formData.severity}
                      label="Gravité (1-5)"
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5].map((val) => (
                        <MenuItem key={val} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {formData.probability && formData.severity && (
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Criticité calculée: {formData.probability * formData.severity}
                  </Typography>
                </Box>
              )}
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

