import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DocumentsIcon,
  People as ContractorsIcon,
  Build as MaintenanceIcon,
  Nature as EnvironmentIcon,
  Warning as NonConformitiesIcon,
  Dangerous as RisksIcon,
  Search as InspectionsIcon,
  ReportProblem as IncidentsIcon,
  School as TrainingsIcon,
  Assessment as ReportsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { title: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Risques', icon: <RisksIcon />, path: '/risks' },
  { title: 'Inspections', icon: <InspectionsIcon />, path: '/inspections' },
  { title: 'Incidents', icon: <IncidentsIcon />, path: '/incidents' },
  { title: 'Formations', icon: <TrainingsIcon />, path: '/trainings' },
  { title: 'Non-conformités', icon: <NonConformitiesIcon />, path: '/non-conformities' },
  { title: 'Environnement', icon: <EnvironmentIcon />, path: '/environment' },
  { title: 'Maintenance', icon: <MaintenanceIcon />, path: '/maintenance' },
  { title: 'Sous-traitants', icon: <ContractorsIcon />, path: '/contractors' },
  { title: 'Documents', icon: <DocumentsIcon />, path: '/documents' },
  { title: 'Reporting', icon: <ReportsIcon />, path: '/reports' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          p: 3,
          background: `
            linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #06b6d4 100%),
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%, 100% 100%, 100% 100%',
          animation: 'gradientShift 8s ease infinite',
          color: 'white',
          minHeight: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 -2px 10px rgba(0,0,0,0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite reverse',
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            position: 'relative',
            zIndex: 1,
            textShadow: '0 2px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.2)',
            fontSize: '1.5rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        >
          Jayana qhse
        </Typography>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              opacity: 0.95,
              fontWeight: 500,
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
              letterSpacing: '0.02em',
            }}
          >
            {user?.first_name} {user?.last_name}
          </Typography>
        </Box>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  background: isActive
                    ? 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)'
                    : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: 'primary.main',
                    transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                      : 'action.hover',
                    transform: 'translateX(4px)',
                    '&::before': {
                      transform: 'scaleY(1)',
                    },
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'error.main',
              color: 'white',
              transform: 'translateX(4px)',
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { md: 'none' },
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.title || 'Jayana qhse'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 8 },
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

