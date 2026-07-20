import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { KeyRound, Mail, ListTodo, User } from 'lucide-react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Link, 
  InputAdornment, 
  CircularProgress 
} from '@mui/material';

export default function Login({ onAuthSuccess, navigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;
      if (data.session) {
        onAuthSuccess(data.session.user);
      }
    } catch (err) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ p: 1.5, bgcolor: 'primary.main', borderRadius: 2, color: 'primary.contrastText', mb: 2 }}>
            <ListTodo size={32} />
          </Box>
          <Typography component="h1" variant="h4" fontWeight="bold">
            OpenList
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Entre na sua conta para gerenciar suas tarefas
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login-email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyRound size={20} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
          
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link component="button" type="button" variant="body2" onClick={navigateToRegister} underline="hover" sx={{ fontWeight: 'bold' }}>
                Cadastre-se grátis
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
