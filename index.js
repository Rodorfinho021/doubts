import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import fs from 'fs';

// Banco de dados e serviços
import conexao from './config/db.js';
import { cadastrarUsuario, listarUsuarios, modificarUsuario, deletarUsuario, salvarCaminhoImagemNoBanco, buscarFotoUsuarioPorId } from './db/usuarios.js';
import { buscarTodosCanais, buscarCanaisPorUsuario, criarCanal, adicionarUsuarioCanal, enviarMensagem, verificarDonoCanal, atualizarCanal, excluirCanal } from './db/canais.js';

const app = express();
const JWT_SECRET = 'seu-segredo-jwt'; // Substitua por variável de ambiente em produção

// ✅ CORS configurado corretamente antes de qualquer rota
const allowedOrigins = [
  'https://doubts.dev.vilhena.ifro.edu.br',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors()); // Preflight requests

// ✅ Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Servir pastas públicas
app.use('/uploads', express.static('uploads'));
app.use('/uploads_canais', express.static('uploads_canais'));

// ✅ Multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync('uploads/', { recursive: true });
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});


// Rotas para upload de imagens de canais
app.post('/uploads-canais', uploadCanais.single('imagem'), (req, res) => {
  const imagem = req.file;

  if (!imagem) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  const fotoUrl = `https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/${imagem.filename}`;
  res.status(200).json({ url: fotoUrl });
});

const upload = multer({ storage });
const uploadCanais = multer({ storage: storageCanais });

// Rota para criação de canais
app.post('/_cadastrar_canal', autenticarUsuario, uploadCanais.single('imagem'), async (req, res) => {
  try {
    console.log('Requisição recebida');
    
    const { nome, descricao } = req.body;
    const imagem = req.file;

    if (!nome || !descricao || !imagem) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    console.log('Nome:', nome);
    console.log('Descrição:', descricao);
    console.log('Imagem:', imagem);

    const fotoUrl = ` https://apidoubts.dev.vilhena.ifro.edu.br/uploads_canais/${imagem.filename}`;
    const idUsuario = req.user.id; // Assumindo que o ID do usuário está no token

    // Log do que vai ser passado para a função
    console.log('Passando dados para criarCanal:', nome, descricao, fotoUrl, idUsuario);

    await criarCanal(nome, descricao, fotoUrl, idUsuario); // ajuste conforme sua função real

    res.status(200).json({ mensagem: 'Canal criado com sucesso' });
  } catch (err) {
    console.error('Erro ao criar canal:', err); // Isso vai mostrar o erro no backend
    res.status(500).json({ error: 'Erro ao criar canal' });
  }
});




app.get('/perfil/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarFotoUsuarioPorId(id);

    if (!resultado || !resultado.foto_url) {
      return res.status(404).json({ mensagem: 'Foto não encontrada' });
    }

    res.json({ url: `https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${resultado.foto_url}` });
  } catch (error) {
    console.error('Erro ao buscar a foto do usuário:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar a foto' });
  }
});





// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).send('Email e senha são obrigatórios!');

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  conexao.query(sql, [email], (err, results) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (results.length === 0) return res.status(401).send('Usuário não encontrado');

    const usuario = results[0];
    if (usuario.senha !== senha) return res.status(401).send('Senha incorreta');

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        foto: usuario.foto_url || '' // se tiver
      }
    });
  });
});


// Cadastro
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos!' });
  }

  cadastrarUsuario(nome, email, senha, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensagem: 'Email já cadastrado!' });
      }
      return res.status(500).json({ mensagem: 'Erro no servidor' });
    }

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

// Listar usuários
app.get('/usuarios', (req, res) => {
  listarUsuarios((err, users) => {
    if (err) return res.status(500).send('Erro no servidor');
    res.status(200).json(users);
  });
});

// Atualizar usuário
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).send('Preencha todos os campos!');

  modificarUsuario(id, nome, email, senha, (err, result) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (result.affectedRows === 0) return res.status(404).send('Usuário não encontrado');
    res.status(200).send('Usuário modificado com sucesso!');
  });
});

// Deletar usuário
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  deletarUsuario(id, (err, result) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (result.affectedRows === 0) return res.status(404).send('Usuário não encontrado');
    res.status(200).send('Usuário deletado com sucesso!');
  });
});


// Adicionar usuário a canal
app.post('/canais/:canal_id/usuarios/:usuario_id', (req, res) => {
  const { canal_id, usuario_id } = req.params;

  adicionarUsuarioCanal(usuario_id, canal_id, (err) => {
    if (err) return res.status(500).send('Erro no servidor');
    res.status(200).send('Usuário adicionado ao canal com sucesso!');
  });
});

// Atualizar canal
app.put('/canais/:id', autenticarUsuario, (req, res) => {
  const { id } = req.params;
  const { nome, descricao, foto_url } = req.body;
  const usuario_id = req.user.id;

  verificarDonoCanal(id, (err, donoId) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (!donoId) return res.status(404).send('Canal não encontrado');
    if (donoId !== usuario_id) return res.status(403).send('Sem permissão');

    atualizarCanal(id, nome, descricao, foto_url, (err) => {
      if (err) return res.status(500).send('Erro ao atualizar canal');
      res.status(200).send('Canal atualizado com sucesso!');
    });
  });
});

// Excluir canal
app.delete('/canais/:id', autenticarUsuario, (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;

  verificarDonoCanal(id, (err, donoId) => {
    if (err) return res.status(500).send('Erro no servidor');
    if (!donoId) return res.status(404).send('Canal não encontrado');
    if (donoId !== usuario_id) return res.status(403).send('Sem permissão');

    excluirCanal(id, (err) => {
      if (err) return res.status(500).send('Erro ao excluir canal');
      res.status(200).send('Canal excluído com sucesso!');
    });
  });
});

// Enviar mensagem
app.post('/canais/:canal_id/mensagem', autenticarUsuario, (req, res) => {
  const { mensagem } = req.body;
  const { canal_id } = req.params;
  const usuario_id = req.user.id;

  if (!mensagem) return res.status(400).send('Mensagem é obrigatória!');

  enviarMensagem(usuario_id, canal_id, mensagem, (err) => {
    if (err) return res.status(500).send('Erro ao enviar mensagem');
    res.status(200).send('Mensagem enviada com sucesso!');
  });
});

// Listar mensagens de um canal
app.get('/canais/:canal_id/mensagens', autenticarUsuario, (req, res) => {
  const { canal_id } = req.params;

  const sql = `
    SELECT mensagens.id, mensagens.mensagem, mensagens.data_envio, usuarios.nome AS autor
    FROM mensagens
    JOIN usuarios ON mensagens.usuario_id = usuarios.id
    WHERE mensagens.canal_id = ?
    ORDER BY mensagens.data_envio ASC
  `;

  conexao.query(sql, [canal_id], (err, results) => {
    if (err) return res.status(500).send('Erro ao buscar mensagens');
    res.status(200).json(results);
  });
});

// Buscar canais do usuário
app.get('/meus_canais', autenticarUsuario, (req, res) => {
  const usuario_id = req.user.id;

  buscarCanaisPorUsuario(usuario_id, (err, canais) => {
    if (err) return res.status(500).send('Erro no servidor');
    res.status(200).json(canais);
  });
});

// Buscar todos canais
app.get('/canais',  (req, res) => {
  buscarTodosCanais((err, canais) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar canais' });
    res.json(canais);
  });
});

// Inicia o servidor
app.listen(3001, () => {
  console.log('🚀 Servidor rodando em https://apidoubts.dev.vilhena.ifro.edu.br');
});