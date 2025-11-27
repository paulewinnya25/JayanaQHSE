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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    file_url: '',
    version: '1.0',
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (doc = null) => {
    if (doc) {
      setEditing(doc);
      setFormData({
        title: doc.title || '',
        type: doc.type || '',
        category: doc.category || '',
        file_url: doc.file_url || '',
        version: doc.version || '1.0',
      });
    } else {
      setEditing(null);
      setFormData({
        title: '',
        type: '',
        category: '',
        file_url: '',
        version: '1.0',
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
        await axios.put(`/documents/${editing.id}`, formData);
        toast.success('Document mis à jour');
      } else {
        await axios.post('/documents', formData);
        toast.success('Document créé');
      }
      fetchDocuments();
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleValidate = async (id) => {
    try {
      await axios.post(`/documents/${id}/validate`);
      toast.success('Document validé');
      fetchDocuments();
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await axios.delete(`/documents/${id}`);
        toast.success('Document supprimé');
        fetchDocuments();
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
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #06b6d4 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 5s ease infinite',
                mb: 0.5,
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                letterSpacing: '-0.02em',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: '60%',
                  height: 3,
                  background: 'linear-gradient(90deg, #0ea5e9, #3b82f6, transparent)',
                  borderRadius: 2,
                  opacity: 0.6,
                },
              }}
            >
              Gestion Documentaire
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
            >
              Gérez vos documents QHSE
            </Typography>
          </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.75,
            textTransform: 'none',
            fontWeight: 700,
            background: `
              linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #06b6d4 100%),
              linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)
            `,
            backgroundSize: '200% 200%, 100% 100%',
            animation: 'gradientShift 5s ease infinite',
            boxShadow: `
              0 8px 24px 0 rgba(14, 165, 233, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transition: 'left 0.5s ease',
            },
            '&:hover': {
              background: `
                linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #0891b2 100%),
                linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)
              `,
              boxShadow: `
                0 12px 32px 0 rgba(14, 165, 233, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.4),
                0 0 40px rgba(14, 165, 233, 0.3)
              `,
              transform: 'translateY(-3px) scale(1.02)',
              '&::before': {
                left: '100%',
              },
            },
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Nouveau Document
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: `
            0 8px 32px 0 rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(14, 165, 233, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9)
          `,
          overflow: 'hidden',
          background: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%),
            radial-gradient(circle at 0% 0%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)
          `,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(14, 165, 233, 0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #0ea5e9, #3b82f6, #06b6d4)',
            opacity: 0.6,
          },
        }}
      >
        <Table>
          <TableHead>
              <TableRow
                sx={{
                  background: `
                    linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #06b6d4 100%),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 50%)
                  `,
                  backgroundSize: '200% 100%, 100% 100%',
                  animation: 'gradientShift 5s ease infinite',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  },
                  '& .MuiTableCell-head': {
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    position: 'relative',
                    zIndex: 1,
                  },
                }}
              >
              <TableCell>Titre</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Validé par</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow
                key={doc.id}
                sx={{
                  animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: 'linear-gradient(180deg, #0ea5e9, #3b82f6)',
                    transform: 'scaleY(0)',
                    transformOrigin: 'top',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(14, 165, 233, 0.08)',
                    transform: 'translateX(4px)',
                    boxShadow: `
                      0 4px 12px rgba(0,0,0,0.08),
                      inset 4px 0 0 #0ea5e9
                    `,
                    '&::before': {
                      transform: 'scaleY(1)',
                    },
                    '& .MuiTableCell-root': {
                      color: 'primary.main',
                      fontWeight: 500,
                    },
                  },
                }}
              >
                <TableCell>{doc.title}</TableCell>
                <TableCell>{doc.type || '-'}</TableCell>
                <TableCell>{doc.category || '-'}</TableCell>
                <TableCell>{doc.version}</TableCell>
                <TableCell>
                  <Chip
                    label={doc.status}
                    color={doc.status === 'validated' ? 'success' : 'default'}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      boxShadow: doc.status === 'validated' ? '0 2px 8px rgba(46, 125, 50, 0.3)' : 'none',
                    }}
                  />
                </TableCell>
                <TableCell>{doc.validated_by_name || '-'}</TableCell>
                <TableCell>
                  {doc.status !== 'validated' && (
                    <IconButton
                      size="small"
                      onClick={() => handleValidate(doc.id)}
                      sx={{
                        color: 'success.main',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'success.light',
                          color: 'white',
                          transform: 'scale(1.2)',
                        },
                      }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(doc)}
                    sx={{
                      color: 'primary.main',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white',
                        transform: 'rotate(15deg) scale(1.1)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(doc.id)}
                    sx={{
                      color: 'error.main',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'white',
                        transform: 'rotate(-15deg) scale(1.1)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
            color: 'white',
            fontWeight: 600,
            py: 3,
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
          {editing ? 'Modifier le document' : 'Nouveau document'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
            <TextField
              fullWidth
              label="Titre"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: 2,
                  },
                },
              }}
            />
          <TextField
            fullWidth
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            margin="normal"
            select
          >
            <MenuItem value="procédure">Procédure</MenuItem>
            <MenuItem value="fiche">Fiche</MenuItem>
            <MenuItem value="rapport">Rapport</MenuItem>
            <MenuItem value="manuel">Manuel</MenuItem>
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
            label="URL du fichier"
            value={formData.file_url}
            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
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
            {editing ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}





