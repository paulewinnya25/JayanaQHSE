import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Vérifier si l'URL est valide (pas une URL d'exemple)
const isExampleURL = API_URL.includes('votre-backend-url') || API_URL.includes('example.com') || API_URL.includes('placeholder');

// Log pour le debug
console.log('🔗 API URL configured:', API_URL);
if (isExampleURL) {
  console.warn('⚠️ ATTENTION: URL d\'API invalide détectée!');
  console.warn('📝 L\'URL contient une valeur d\'exemple. Vous devez:');
  console.warn('   1. Déployer votre backend (voir DEPLOY_BACKEND.md)');
  console.warn('   2. Configurer REACT_APP_API_URL dans Netlify avec l\'URL réelle');
}

axios.defaults.baseURL = API_URL;

// Gestion globale des erreurs de connexion
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      console.error('❌ Erreur de connexion à l\'API:', API_URL);
      
      if (isExampleURL) {
        console.error('⚠️ PROBLÈME: L\'URL de l\'API contient une valeur d\'exemple!');
        console.error('📋 Étapes à suivre:');
        console.error('   1. Déployez votre backend sur Railway/Render/Heroku');
        console.error('   2. Récupérez l\'URL de votre backend (ex: https://xxx.railway.app)');
        console.error('   3. Dans Netlify → Environment variables');
        console.error('      Ajoutez: REACT_APP_API_URL = https://xxx.railway.app/api');
        console.error('   4. Redéployez sur Netlify');
        console.error('');
        console.error('📚 Guides disponibles:');
        console.error('   - DEPLOY_BACKEND.md (déployer le backend)');
        console.error('   - NETLIFY_SETUP.md (configurer Netlify)');
      } else {
        console.error('💡 Vérifiez que:');
        console.error('   - Le backend est bien déployé et accessible');
        console.error('   - REACT_APP_API_URL est correctement configurée dans Netlify');
        console.error('   - L\'URL est accessible depuis votre navigateur');
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};





