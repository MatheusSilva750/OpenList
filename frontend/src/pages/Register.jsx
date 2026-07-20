import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { KeyRound, Mail, ListTodo } from 'lucide-react';
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

export default function Register({ onAuthSuccess, navigateToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) throw authError;

      // Because GOTRUE_MAILER_AUTOCONFIRM: "true" is set, the account is active immediately
      setSuccessMsg('Conta criada com sucesso! Redirecionando...');
      setTimeout(async () => {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (!signInError && signInData.session) {
          onAuthSuccess(signInData.session.user);
        } else {
          navigateToLogin();
        }
      }, 1500);

    } catch (err) {
      setError(err.message || 'Erro ao criar conta.');
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
            Criar Conta
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Cadastre-se na plataforma para gerenciar tarefas
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="register-email"
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
            id="register-password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Senha"
            type="password"
            id="register-confirm-password"
            placeholder="Repita sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
          </Button>
          
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link component="button" type="button" variant="body2" onClick={navigateToLogin} underline="hover" sx={{ fontWeight: 'bold' }}>
                Faça login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
