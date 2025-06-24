import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const app = express();
const JWT_SECRET = 'seu-segredo-jwt';

// ✅ Lista de domínios permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'https://doubts.dev.vilhena.ifro.edu.br'
];

// ✅ CORS deve vir ANTES de qualquer rota ou middleware
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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handler global para OPTIONS (preflight)
app.options('*', cors());

// ✅ Middleware para logar requisições (opcional para debug)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// ✅ Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Expor diretórios de imagens públicas
app.use('/uploads', express.static('uploads'));
app.use('/uploads_canais', express.static('uploads_canais'));

// ✅ Configuração Multer para upload de imagens de usuário
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Upload de foto de usuário
app.post('/upload', upload.single('imagem'), async (req, res) => {
  const imagem = req.file;
  const userId = req.body.userId;

  if (!imagem || !userId) {
    return res.status(400).json({ erro: 'Imagem ou ID do usuário não fornecido.' });
  }

  // Aqui você salvaria no banco o caminho da imagem se quiser
  const fotoUrl = `https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${imagem.filename}`;

  // Suponha que você salve no banco aqui, mas vamos só retornar por enquanto:
  return res.status(200).json({ url: fotoUrl });
});

// ✅ Exemplo: rota de perfil
app.get('/perfil/:id', async (req, res) => {
  const { id } = req.params;

  // Simulação: busca no banco a foto do usuário com ID
  // Exemplo fixo:
  const filename = `${id}.png`;

  // Verifica se arquivo existe
  const filePath = path.join('uploads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ mensagem: 'Foto não encontrada' });
  }

  const fotoUrl = `https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${filename}`;
  return res.json({ url: fotoUrl });
});

// ✅ Inicia o servidor HTTPS (ou http se estiver local)
app.listen(3001, () => {
  console.log('🚀 Servidor rodando em https://apidoubts.dev.vilhena.ifro.edu.br');
});
