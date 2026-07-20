import React from 'react';
import { ArrowLeft, BookOpen, Terminal, Code, Settings, Link, CheckCircle, Globe } from 'lucide-react';
import { API_URL } from '../api/client';

export default function ApiDocs({ navigateToDashboard }) {
  return (
    <div className="min-h-screen text-slate-300 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="text-primary-400" size={24} />
          <h1 className="text-xl font-bold text-white tracking-tight">OpenList API Integration</h1>
        </div>
        <button
          onClick={navigateToDashboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Voltar ao Dashboard
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 space-y-12">
        
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Documentação de Integração</h2>
          <p className="text-slate-400">
            A API do OpenList é aberta e permite que sistemas externos gerenciem tarefas e categorias. 
            Todas as requisições devem ser autenticadas via cabeçalho HTTP utilizando o padrão JWT.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a 
              href={`${API_URL}/api/docs/`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-600/10"
            >
              <Globe size={16} />
              Ver Swagger UI Interativo
            </a>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono">
              <span className="text-slate-500">BASE_URL:</span>
              <span className="text-emerald-400">{API_URL}/api</span>
            </div>
          </div>
        </section>

        {/* Auth details */}
        <section className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="text-primary-400" size={18} />
            Autenticação
          </h3>
          <p className="text-sm text-slate-400">
            A API utiliza autenticação baseada em tokens JWT gerados pelo Supabase. Adicione o seguinte cabeçalho em todas as requisições que requerem autenticação:
          </p>
          <pre className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
            Authorization: Bearer &lt;seu_supabase_jwt_token&gt;
          </pre>
        </section>

        {/* Endpoints Table */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="text-primary-400" size={18} />
            Endpoints Principais
          </h3>
          
          <div className="overflow-x-auto border border-slate-800 rounded-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="p-4">Método</th>
                  <th className="p-4">Rota</th>
                  <th className="p-4">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/10">
                <tr>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-blue-950/50 text-blue-400 border border-blue-800/30 text-xs font-bold font-mono">GET</span></td>
                  <td className="p-4 font-mono text-white text-xs">/categories/</td>
                  <td className="p-4 text-slate-400">Lista categorias criadas pelo usuário logado</td>
                </tr>
                <tr>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/30 text-xs font-bold font-mono">POST</span></td>
                  <td className="p-4 font-mono text-white text-xs">/categories/</td>
                  <td className="p-4 text-slate-400">Cria uma nova categoria (parâmetro: <code className="text-xs text-primary-300">name</code>)</td>
                </tr>
                <tr>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-blue-950/50 text-blue-400 border border-blue-800/30 text-xs font-bold font-mono">GET</span></td>
                  <td className="p-4 font-mono text-white text-xs">/tasks/</td>
                  <td className="p-4 text-slate-400">Lista tarefas do usuário (suporta paginação, <code className="text-xs text-primary-300">completed</code>, <code className="text-xs text-primary-300">category</code>, <code className="text-xs text-primary-300">search</code>)</td>
                </tr>
                <tr>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/30 text-xs font-bold font-mono">POST</span></td>
                  <td className="p-4 font-mono text-white text-xs">/tasks/</td>
                  <td className="p-4 text-slate-400">Cria uma nova tarefa</td>
                </tr>
                <tr>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/30 text-xs font-bold font-mono">POST</span></td>
                  <td className="p-4 font-mono text-white text-xs">/tasks/&#123;id&#125;/toggle/</td>
                  <td className="p-4 text-slate-400">Alterna status de conclusão (concluído/pendente)</td>
                </tr>
                <tr>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/30 text-xs font-bold font-mono">POST</span></td>
                  <td className="p-4 font-mono text-white text-xs">/tasks/&#123;id&#125;/share/</td>
                  <td className="p-4 text-slate-400">Compartilha a tarefa com outro usuário (parâmetro: <code className="text-xs text-primary-300">email</code>)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Code Snippets */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="text-primary-400" size={18} />
            Exemplos de Integração (Snippets)
          </h3>

          <div className="space-y-6">
            
            {/* cURL */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">cURL (Listar Tarefas)</span>
              <pre className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
{`curl -X GET "${API_URL}/api/tasks/" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>

            {/* Python */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Python (Criar Tarefa)</span>
              <pre className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
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
              </pre>
            </div>

            {/* JS / Fetch */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">JavaScript / Fetch (Alternar Status)</span>
              <pre className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
{`fetch("${API_URL}/api/tasks/TAREFA_UUID/toggle/", {
  method: "POST",
  headers: {
    "Authorization": "Bearer SEU_TOKEN_AQUI",
    "Content-Type": "application/json"
  }
})
.then(res => res.json())
.then(data => console.log(data));`}
              </pre>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
