# 🚀 Deploy do Sistema de Análise de Cargas

## 📋 Pré-requisitos
- Conta no GitHub (para todas as opções)
- Arquivos do projeto organizados

## 🏆 Opção 1: Railway (RECOMENDADO)

### Passos:
1. **Criar conta**: Acesse [railway.app](https://railway.app)
2. **Conectar GitHub**: Autorize acesso ao GitHub
3. **Novo projeto**: "New Project" → "Deploy from GitHub repo"
4. **Selecionar repositório**: Escolha o repo com os arquivos
5. **Deploy automático**: Railway detecta Flask automaticamente
6. **URL gerada**: Receba link público HTTPS

### Configurações automáticas:
- ✅ Detecta `requirements.txt`
- ✅ Usa `Procfile` para comando de start
- ✅ Configura porta automaticamente
- ✅ SSL/HTTPS habilitado

## 🔧 Opção 2: Render

### Passos:
1. **Criar conta**: Acesse [render.com](https://render.com)
2. **Novo Web Service**: "New" → "Web Service"
3. **Conectar repositório**: GitHub/GitLab
4. **Configurar**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python src/main.py`
   - Environment: `Python 3`
5. **Deploy**: Automático após configuração

### Limitações:
- ⚠️ Aplicação "dorme" após 15min sem uso
- ⚠️ Primeiro acesso após "sono" é mais lento

## 🐍 Opção 3: PythonAnywhere

### Passos:
1. **Criar conta**: Acesse [pythonanywhere.com](https://pythonanywhere.com)
2. **Upload arquivos**: Via interface web ou Git
3. **Configurar Web App**:
   - Python version: 3.11
   - Framework: Flask
   - Source code: `/home/yourusername/analise_cargas_web/src`
   - WSGI file: Use o `wsgi.py` fornecido
4. **Instalar dependências**: No console Bash
   ```bash
   pip3.11 install --user -r requirements.txt
   ```
5. **Reload**: Web app

## ⚡ Opção 4: Vercel (Limitado)

### Passos:
1. **Criar conta**: Acesse [vercel.com](https://vercel.com)
2. **Import projeto**: Do GitHub
3. **Deploy automático**: Vercel detecta Python
4. **Configuração**: Usa `vercel.json`

### Limitações:
- ⚠️ Melhor para sites estáticos
- ⚠️ Limitações de tempo de execução
- ⚠️ Pode ter problemas com uploads grandes

## 📁 Estrutura de Arquivos Necessária

```
analise_cargas_web/
├── src/
│   ├── main.py              # Aplicação principal
│   ├── routes/
│   │   └── analise.py       # Rotas de análise
│   ├── models/
│   │   └── user.py          # Modelos de dados
│   └── static/
│       ├── index.html       # Interface web
│       └── script.js        # JavaScript
├── requirements.txt         # Dependências Python
├── Procfile                 # Comando de execução
├── runtime.txt              # Versão Python
├── railway.json             # Config Railway
├── render.yaml              # Config Render
├── vercel.json              # Config Vercel
├── wsgi.py                  # Config PythonAnywhere
└── README.md                # Documentação
```

## 🔑 Variáveis de Ambiente

Para todas as plataformas, configure:
- `FLASK_ENV=production`
- `PORT` (automático na maioria)
- `PYTHONPATH=/app/src` (se necessário)

## 🚨 Troubleshooting

### Erro comum: "Module not found"
**Solução**: Verificar `PYTHONPATH` e estrutura de diretórios

### Erro: "Port already in use"
**Solução**: Usar `PORT` do ambiente: `port = int(os.environ.get('PORT', 5000))`

### Erro: "Requirements not found"
**Solução**: Verificar se `requirements.txt` está na raiz do projeto

## 📞 Próximos Passos

1. **Escolha a plataforma** (Railway recomendado)
2. **Crie repositório no GitHub** com os arquivos
3. **Siga os passos** da plataforma escolhida
4. **Teste o deploy** com arquivo de exemplo
5. **Configure domínio personalizado** (opcional)

## 💡 Dicas de Otimização

- **Railway**: Melhor para aplicações que ficam sempre ativas
- **Render**: Boa para aplicações com uso esporádico
- **PythonAnywhere**: Ideal se você já conhece Python
- **Vercel**: Use apenas se for principalmente frontend

## 🆘 Suporte

Se encontrar problemas:
1. Verifique logs da plataforma
2. Confirme estrutura de arquivos
3. Teste localmente primeiro
4. Consulte documentação da plataforma
