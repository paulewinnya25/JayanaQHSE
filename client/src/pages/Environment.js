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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function Environment() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'consumption',
    category: '',
    value: '',
    unit: '',
    date_recorded: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/environment');
      setData(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/environment/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/environment', formData);
      toast.success('Donnée enregistrée');
      fetchData();
      fetchStats();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      type: 'consumption',
      category: '',
      value: '',
      unit: '',
      date_recorded: new Date().toISOString().split('T')[0],
      notes: '',
    });
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
              Suivi Environnemental
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Gérez vos données environnementales
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
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
            Enregistrer une Donnée
          </Button>
        </Box>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consommations
                </Typography>
                {stats.consumption && stats.consumption.length > 0 ? (
                  stats.consumption.map((item, index) => (
                    <Typography key={index} variant="body2">
                      {item.type} - {item.category}: {item.total} {item.unit}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucune donnée
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Déchets
                </Typography>
                {stats.waste && stats.waste.length > 0 ? (
                  stats.waste.map((item, index) => (
                    <Typography key={index} variant="body2">
                      {item.category}: {item.total} {item.unit}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucune donnée
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

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
              <TableCell>Type</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Valeur</TableCell>
              <TableCell>Unité</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Enregistré par</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.category || '-'}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  {new Date(item.date_recorded).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>{item.recorded_by_name || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Enregistrer une donnée environnementale</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            margin="normal"
            select
            required
          >
            <MenuItem value="consumption">Consommation</MenuItem>
            <MenuItem value="waste">Déchet</MenuItem>
            <MenuItem value="emission">Émission</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Valeur"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Unité"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date_recorded}
            onChange={(e) => setFormData({ ...formData, date_recorded: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Layout>
  );
}





