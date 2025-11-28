import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  Paper,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  FindInPage as FindInPageIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const DetailModal = ({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon = InfoIcon,
  iconColor = 'primary',
  data = {},
  fields = [],
  sections = [],
  onEdit,
  editLabel = 'Modifier',
  closeLabel = 'Fermer',
  maxWidth = 'lg',
}) => {
  const getIconColor = (color) => {
    const colors = {
      primary: 'primary.main',
      error: 'error.main',
      success: 'success.main',
      warning: 'warning.main',
      info: 'info.main',
    };
    return colors[color] || colors.primary;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        },
      }}
    >
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
            <Icon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {/* Champs principaux */}
          {fields.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {fields.map((field, index) => (
                <Grid item xs={12} md={field.fullWidth ? 12 : 6} key={index}>
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
                      {field.icon && (
                        <field.icon sx={{ color: getIconColor(field.iconColor || 'primary'), fontSize: 20 }} />
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                      >
                        {field.label}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {field.value || field.defaultValue || 'Non spécifié'}
                    </Typography>
                    {field.chip && (
                      <Chip
                        label={field.chip}
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: field.chipColor || 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Sections de contenu */}
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                {section.icon && (
                  <section.icon
                    sx={{ color: getIconColor(section.iconColor || 'primary'), fontSize: 24 }}
                  />
                )}
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {section.title}
                </Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: section.bgColor || 'grey.50',
                  border: '1px solid',
                  borderColor: section.borderColor || 'grey.200',
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  {section.content}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          bgcolor: 'grey.50',
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Button
          onClick={onClose}
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
          {closeLabel}
        </Button>
        {onEdit && (
          <Button
            onClick={onEdit}
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
            {editLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailModal;

