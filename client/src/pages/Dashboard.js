import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  Description as DocumentsIcon,
  People as ContractorsIcon,
  Build as MaintenanceIcon,
  Nature as EnvironmentIcon,
  Warning as NonConformitiesIcon,
  Dashboard as DashboardIcon,
  Dangerous as RisksIcon,
  Search as InspectionsIcon,
  ReportProblem as IncidentsIcon,
  School as TrainingsIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';

export default function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard', color: '#1976d2' },
    { title: 'Risques', icon: <RisksIcon />, path: '/risks', color: '#f44336' },
    { title: 'Inspections', icon: <InspectionsIcon />, path: '/inspections', color: '#2196f3' },
    { title: 'Incidents', icon: <IncidentsIcon />, path: '/incidents', color: '#ff5722' },
    { title: 'Formations', icon: <TrainingsIcon />, path: '/trainings', color: '#9c27b0' },
    { title: 'Non-conformités', icon: <NonConformitiesIcon />, path: '/non-conformities', color: '#d32f2f' },
    { title: 'Environnement', icon: <EnvironmentIcon />, path: '/environment', color: '#0288d1' },
    { title: 'Maintenance', icon: <MaintenanceIcon />, path: '/maintenance', color: '#673ab7' },
    { title: 'Sous-traitants', icon: <ContractorsIcon />, path: '/contractors', color: '#ed6c02' },
    { title: 'Documents', icon: <DocumentsIcon />, path: '/documents', color: '#2e7d32' },
    { title: 'Reporting', icon: <ReportsIcon />, path: '/reports', color: '#00acc1' },
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 6,
            animation: 'fadeIn 0.6s ease-out',
            position: 'relative',
            pb: 4,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100px',
              height: 4,
              background: 'linear-gradient(90deg, #0ea5e9, #3b82f6, transparent)',
              borderRadius: 2,
            },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #06b6d4 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 5s ease infinite',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              letterSpacing: '-0.03em',
              textShadow: '0 4px 20px rgba(14, 165, 233, 0.2)',
              position: 'relative',
              display: 'inline-block',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -4,
                background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                borderRadius: 2,
                opacity: 0.1,
                filter: 'blur(20px)',
                zIndex: -1,
              },
            }}
          >
            Tableau de bord
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.25rem' },
              opacity: 0.8,
              letterSpacing: '0.01em',
            }}
          >
            Bienvenue dans l'application Jayana qhse
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={item.path}
              sx={{
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: 'rgba(14, 165, 233, 0.1)',
                  background: `
                    linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%),
                    linear-gradient(135deg, ${item.color}08 0%, transparent 50%)
                  `,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `
                    0 4px 20px rgba(0, 0, 0, 0.08),
                    0 0 0 1px rgba(14, 165, 233, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.9)
                  `,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 50%, ${item.color} 100%)`,
                    backgroundSize: '200% 100%',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.5s ease',
                    animation: 'shimmer 3s infinite',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 0,
                    height: 0,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${item.color}20 0%, ${item.color}05 50%, transparent 70%)`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'width 0.8s ease, height 0.8s ease',
                    filter: 'blur(20px)',
                  },
                  '&:hover': {
                    transform: 'translateY(-16px) scale(1.03) rotateX(2deg)',
                    boxShadow: `
                      0 32px 100px 0 ${item.color}40,
                      0 0 0 2px ${item.color}30,
                      inset 0 1px 0 rgba(255, 255, 255, 1),
                      0 0 60px ${item.color}20
                    `,
                    borderColor: item.color,
                    background: `
                      linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%),
                      linear-gradient(135deg, ${item.color}15 0%, transparent 60%)
                    `,
                    '&::before': {
                      transform: 'scaleX(1)',
                    },
                    '&::after': {
                      width: '400px',
                      height: '400px',
                    },
                    '& .icon-wrapper': {
                      transform: 'scale(1.2) rotate(12deg)',
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                      '&::before': {
                        opacity: 1,
                      },
                      '&::after': {
                        opacity: 1,
                      },
                    },
                    '& .card-title': {
                      color: item.color,
                      transform: 'translateY(-4px)',
                      '&::after': {
                        transform: 'translateX(-50%) scaleX(1)',
                      },
                    },
                    '& .card-pattern': {
                      opacity: 0.1,
                    },
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    textAlign: 'center',
                    py: 5,
                    px: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box
                    className="card-pattern"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.05,
                      backgroundImage: `radial-gradient(circle at 2px 2px, ${item.color} 1px, transparent 0)`,
                      backgroundSize: '40px 40px',
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }}
                  />
                  <Box
                    className="icon-wrapper"
                    sx={{
                      color: item.color,
                      mb: 3,
                      fontSize: 72,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      background: `
                        linear-gradient(135deg, ${item.color}25 0%, ${item.color}10 50%, ${item.color}05 100%),
                        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)
                      `,
                      position: 'relative',
                      boxShadow: `
                        inset 0 2px 4px rgba(255, 255, 255, 0.8),
                        inset 0 -2px 4px ${item.color}20,
                        0 8px 24px ${item.color}30
                      `,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -4,
                        borderRadius: '50%',
                        padding: 3,
                        background: `conic-gradient(from 0deg, ${item.color}, ${item.color}dd, ${item.color}, transparent)`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: 0,
                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                        animation: 'rotate 3s linear infinite',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 8,
                        borderRadius: '50%',
                        border: `2px solid ${item.color}30`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                        transform: 'scale(0.8)',
                      },
                      '& svg': {
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        position: 'relative',
                        zIndex: 1,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    className="card-title"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      transition: 'all 0.4s ease',
                      position: 'relative',
                      zIndex: 1,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      letterSpacing: '-0.02em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: '50%',
                        transform: 'translateX(-50%) scaleX(0)',
                        width: '60%',
                        height: 3,
                        background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                        borderRadius: 2,
                        transition: 'transform 0.4s ease',
                      },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      width: '40%',
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)`,
                      borderRadius: 1,
                      opacity: 0.5,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

