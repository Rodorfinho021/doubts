import multer from 'multer';
import express from 'express';
import path from 'path';
import { atualizarFotoUsuario, buscarFotoUsuarioPorId } from './usuarios.js';  // Funções de manipulação no banco de dados
import cors from 'cors';




const router = express.Router();

// Configuração do armazenamento para o multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),  // Define onde as imagens serão armazenadas
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Obtém a extensão do arquivo
    cb(null, `imagem-${Date.now()}${ext}`);  // Define um nome único para o arquivo
  }
});

const upload = multer({ storage });

// Rota para upload de imagem (POST)
router.post('/upload', upload.single('imagem'), async (req, res) => {
  try {
    const { userId } = req.body;  // Obtém o userId da requisição
    const imagem = req.file?.filename;  // Nome do arquivo de imagem salvo

    if (!imagem || !userId) {
      return res.status(400).json({ mensagem: 'Imagem ou userId não enviados corretamente' });
    }

    // Atualiza a foto do usuário no banco de dados
    await atualizarFotoUsuario(userId, imagem);

    // Retorna a URL da imagem para o front-end
    res.json({ url: `https://apidoubts.dev.vilhena.ifro.edu.br/uploads/${imagem}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao salvar a imagem' });
  }
});







export default router;
