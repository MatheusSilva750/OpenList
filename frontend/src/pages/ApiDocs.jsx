import React from 'react';
import { ArrowLeft, BookOpen, Terminal, Code, Settings, Globe } from 'lucide-react';
import { API_URL } from '../api/client';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  AppBar,
  Toolbar
} from '@mui/material';

export default function ApiDocs({ navigateToDashboard }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary', backgroundImage: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BookOpen size={24} color="#6366f1" />
            <Typography variant="h6" fontWeight="bold">
              OpenList API Integration
            </Typography>
          </Box>
          <Button
            onClick={navigateToDashboard}
            startIcon={<ArrowLeft size={16} />}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Voltar ao Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 6 }}>
        
        {/* Intro */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Documentação de Integração
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A API do OpenList é aberta e permite que sistemas externos gerenciem tarefas e categorias. 
            Todas as requisições devem ser autenticadas via cabeçalho HTTP utilizando o padrão JWT.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Button
              href={`${API_URL}/api/docs/`}
              target="_blank"
              variant="contained"
              startIcon={<Globe size={16} />}
              sx={{ borderRadius: 2 }}
            >
              Ver Swagger UI Interativo
            </Button>
            <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 2, bgcolor: 'action.hover' }}>
              <Typography variant="caption" color="text.secondary" fontFamily="monospace">BASE_URL:</Typography>
              <Typography variant="caption" color="success.main" fontFamily="monospace">{API_URL}/api</Typography>
            </Paper>
          </Box>
        </Box>

        {/* Auth details */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Settings size={20} color="#6366f1" />
            <Typography variant="h6" fontWeight="bold">
              Autenticação
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            A API utiliza autenticação baseada em tokens JWT gerados pelo Supabase. Adicione o seguinte cabeçalho em todas as requisições que requerem autenticação:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#0f172a', borderColor: 'divider', overflowX: 'auto', borderRadius: 2 }}>
            <Typography variant="body2" fontFamily="monospace" color="#34d399">
              Authorization: Bearer &lt;seu_supabase_jwt_token&gt;
            </Typography>
          </Paper>
        </Paper>

        {/* Endpoints Table */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Terminal size={20} color="#6366f1" />
            <Typography variant="h6" fontWeight="bold">
              Endpoints Principais
            </Typography>
          </Box>
          
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Método</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rota</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { method: 'GET', color: 'info', route: '/categories/', desc: 'Lista categorias criadas pelo usuário logado' },
                  { method: 'POST', color: 'success', route: '/categories/', desc: 'Cria uma nova categoria (parâmetro: name)' },
                  { method: 'GET', color: 'info', route: '/tasks/', desc: 'Lista tarefas do usuário (suporta paginação, completed, category, search)' },
                  { method: 'POST', color: 'success', route: '/tasks/', desc: 'Cria uma nova tarefa' },
                  { method: 'POST', color: 'success', route: '/tasks/{id}/toggle/', desc: 'Alterna status de conclusão (concluído/pendente)' },
                  { method: 'POST', color: 'success', route: '/tasks/{id}/share/', desc: 'Compartilha a tarefa (parâmetro: email)' },
                ].map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Chip label={row.method} color={row.color} size="small" sx={{ borderRadius: 1, fontWeight: 'bold', fontFamily: 'monospace' }} />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.route}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{row.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Code Snippets */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Code size={20} color="#6366f1" />
            <Typography variant="h6" fontWeight="bold">
              Exemplos de Integração (Snippets)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              cURL (Listar Tarefas)
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#0f172a', borderColor: 'divider', overflowX: 'auto', borderRadius: 2 }}>
              <Typography variant="body2" fontFamily="monospace" color="#34d399" sx={{ whiteSpace: 'pre' }}>
{`curl -X GET "${API_URL}/api/tasks/" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -H "Content-Type: application/json"`}
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="overline" color="text.secondary" fontWeight="bold">
              Python (Criar Tarefa)
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#0f172a', borderColor: 'divider', overflowX: 'auto', borderRadius: 2 }}>
              <Typography variant="body2" fontFamily="monospace" color="#34d399" sx={{ whiteSpace: 'pre' }}>
{`import requests

url = "${API_URL}/api/tasks/"
headers = {
    "Authorization": "Bearer SEU_TOKEN_AQUI",
    "Content-Type": "application/json"
}
payload = {
    "title": "Integração Externa Concluída",
    "description": "Tarefa criada via script python externo.",
    "due_date": "2026-08-30"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
              </Typography>
            </Paper>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
