// db/upload_canais.js
import multer from 'multer';
import express from 'express';
import path from 'path';
import { atualizarFotoCanais } from './canais.js';  // Correto agora

const router = express.Router();

// Configuração do multer para canais
const storageCanais = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads_canais/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const uploadCanais = multer({ storage: storageCanais });

// Rota de upload para canais
router.post('/upload_canais', uploadCanais.single('imagem'), async (req, res) => {
  try {
    const { canalId } = req.body;  // Agora enviamos canalId
    const imagem = req.file?.filename;

    if (!imagem || !canalId) {
      return res.status(400).json({ mensagem: 'Imagem ou canalId não enviados' });
    }

    // Atualiza a foto do canal no banco
    await atualizarFotoCanais(canalId, imagem);

    // Retorna a URL para o front-end
    res.json({ url: `uploads_canais/${imagem}` });
  } catch (error) {
    console.error('Erro ao enviar imagem do canal:', error);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

export default router;
