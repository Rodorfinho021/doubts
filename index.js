    import express from 'express';
    import bodyParser from 'body-parser';
    import cors from 'cors';
    import multer from 'multer';
    import path from 'path';
    import jwt from 'jsonwebtoken';

    // Seus imports de banco de dados ou outros serviços
    import { cadastrarUsuario, listarUsuarios, modificarUsuario, deletarUsuario, salvarCaminhoImagemNoBanco, buscarFotoUsuarioPorId, buscarUsuariosFiltro } from './db/usuarios.js';
    import { buscarTodosCanais, buscarCanaisPorUsuario, criarCanal, adicionarUsuarioCanal, enviarMensagem, verificarDonoCanal, atualizarCanal, excluirCanal } from './db/canais.js';
    import conexao from './config/db.js';
    import uploadRoutes from './db/upload.js'; // Roteamento para uploads gerais
    import uploadCanaisRoutes from './db/upload_canais.js'; // Roteamento para upload de imagens de canais
    import fs from 'fs';
    import nodemailer from 'nodemailer';
    const codigosReset = {}


    const app = express();

    // Configuração do BodyPars
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const allowedOrigins = [
      'https://doubts.dev.vilhena.ifro.edu.br',
      'http://localhost:3000'
    ];

    app.use(cors({
      origin: function (origin, callback) {
        console.log('Origem da requisição:', origin); // <-- Para debug
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

    const JWT_SECRET = 'seu-segredo-jwt'; // Altere com o seu segredo para JWT

    app.options('*', cors()); // <--- adiciona suporte ao preflight


    app.use(uploadRoutes); // Certifique-se de que as rotas de upload de usuários estão sendo usadas
    app.use(uploadCanaisRoutes);



    // Expõe a pasta 'uploads' para acesso público
    app.use('/uploads', express.static('uploads'));
    app.use('/uploads_canais', express.static('uploads_canais'));
    app.use('/uploads_mensagens', express.static('uploads_mensagens'));




    // Definir o middleware de autenticação
    function autenticarUsuario(req, res, next) {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return res.status(403).send('Token de autenticação não fornecido');

      // Verifica se o token começa com "Bearer "
      const tokenParts = authHeader.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).send('Formato de token inválido');
      }

      const token = tokenParts[1]; // Agora pegamos apenas o JWT

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Token inválido');
        req.user = decoded;
        next();
      });
    }

    app.get('/verificar_token', autenticarUsuario, (req, res) => {
      const usuario_id = req.user.id;

      const sql = 'SELECT * FROM usuarios WHERE id = ?';
      conexao.query(sql, [usuario_id], (err, results) => {
        if (err) {
          console.error('Erro ao verificar usuário no banco:', err);
          return res.status(500).json({ logado: false, erro: 'Erro no servidor' });
        }

        if (results.length === 0) {
          return res.status(401).json({ logado: false, erro: 'Usuário não encontrado' });
        }

        res.status(200).json({ logado: true });
      });
    });




    // Configuração do Multer para upload de imagens dos usuários
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/'), // Padrão para upload de imagens de usuários
      filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
    });

    // Configuração do Multer para upload de imagens de canais
    const storageCanais = multer.diskStorage({
      destination: (req, file, cb) => {
        const dir = 'uploads_canais/';
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
    });


    const storageMensagens = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads_mensagens/'),
      filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
    });





    // Inicializa o Multer
    const upload = multer({ storage: storageMensagens });
    const upload_mensagens = multer({ storage });
    const uploadCanais = multer({ storage: storageCanais });

    // Rotas para upload de imagens de canais
    app.post('/uploads-canais', uploadCanais.single('imagem'), (req, res) => {
      const imagem = req.file;

      if (!imagem) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      }

      const fotoUrl = `${imagem.filename}`;
      res.status(200).json({ url: fotoUrl });
    });

    // Rota para criação de canais
    app.post('/_cadastrar_canal', uploadCanais.single('imagem'), autenticarUsuario, async (req, res) => {
      const { nome, descricao } = req.body;
      const foto_url = req.file ? req.file.filename : null;
      const usuarioId = req.user.id;

      try {
    const [result] = await conexao.promise().query(
      'INSERT INTO canais (nome, descricao, foto_url, usuario_criador_id) VALUES (?, ?, ?, ?)',
      [nome, descricao, foto_url, usuarioId]
    );


        const canalId = result.insertId;

        await conexao.promise().query(
          'INSERT INTO usuarios_canais (usuario_id, canal_id) VALUES (?, ?)',
          [usuarioId, canalId]
        );

        const [canal] = await conexao.promise().query(
          'SELECT * FROM canais WHERE id = ?',
          [canalId]
        );

        res.status(201).json(canal[0]);
      } catch (err) {
        console.error('Erro ao cadastrar canal:', err);
        res.status(500).json({ message: 'Erro ao cadastrar canal' });
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
      console.log('Requisição recebida no /login:', req.body); 
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios!' });
      }

      const sql = 'SELECT * FROM usuarios WHERE email = ?';
      conexao.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ mensagem: 'Erro no servidor' });
        if (results.length === 0) return res.status(401).json({ mensagem: 'Usuário não encontrado' });

        const usuario = results[0];
        if (usuario.senha !== senha) return res.status(401).json({ mensagem: 'Senha incorreta' });

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
            foto: usuario.foto_url || ''
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
            const msg = err.sqlMessage;

            if (msg.includes("for key 'nome'")) {
              return res.status(409).json({ mensagem: 'Nome já cadastrado!' });
            }

            if (msg.includes("for key 'email'")) {
              return res.status(409).json({ mensagem: 'Email já cadastrado!' });
            }

            return res.status(409).json({ mensagem: 'Usuário já cadastrado!' });
          }

          return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
        }

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
      });
    });



    // Listar usuários
    app.get('/usuarios', (req, res) => {
      const search = req.query.search;

      buscarUsuariosFiltro(search, (err, usuarios) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor' });
        res.status(200).json(usuarios);
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
    app.delete('/canais/:id', autenticarUsuario, async (req, res) => {
      const { id } = req.params;
      const usuario_id = req.user.id;

      try {
        // Verifica se o usuário é dono do canal
        const donoId = await new Promise((resolve, reject) => {
          verificarDonoCanal(id, (err, dono) => {
            if (err) reject(err);
            else resolve(dono);
          });
        });

        if (!donoId) return res.status(404).send('Canal não encontrado');
        if (donoId !== usuario_id) return res.status(403).send('Sem permissão');

        // Deleta as associações na tabela usuarios_canais
        await conexao.promise().query('DELETE FROM usuarios_canais WHERE canal_id = ?', [id]);

        // Deleta mensagens do canal (opcional, caso tenha mensagens)
        await conexao.promise().query('DELETE FROM mensagens WHERE canal_id = ?', [id]);

        // Deleta o canal
        await conexao.promise().query('DELETE FROM canais WHERE id = ?', [id]);

        res.status(200).send('Canal excluído com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir canal:', err);
        res.status(500).send('Erro ao excluir canal');
      }
    });



    // Exemplo em canais.js
    app.delete('/sair_canal/:canalId', autenticarUsuario, async (req, res) => {
      const userId = req.user.id;
      const canalId = req.params.canalId;

      try {
        const [result] = await conexao.promise().query(
          'DELETE FROM usuarios_canais WHERE usuario_id = ? AND canal_id = ?',
          [userId, canalId]
        );


        if (result.affectedRows === 0) {
          return res.status(404).json({ mensagem: 'Associação não encontrada' });
        }

        res.sendStatus(204);
      } catch (err) {
        console.error("Erro ao sair do canal:", err);
        res.sendStatus(500);
      }
    });


    // Enviar mensagem
    app.post('/canais/:canal_id/mensagem', autenticarUsuario, upload.single('imagem'), (req, res) => {

      const usuario_id = req.user.id;
      const { canal_id } = req.params;
      const { mensagem } = req.body;
      const imagem = req.file;

      const imagemUrl = imagem ? imagem.filename : null;

        console.log(imagem)

      const sql = 'INSERT INTO mensagens (canal_id, usuario_id, mensagem, imagem_url) VALUES (?, ?, ?, ?)';
      conexao.query(sql, [canal_id, usuario_id, mensagem || null, imagemUrl], (err, result) => {
        if (err) {
          console.error('Erro ao enviar mensagem:', err);
          return res.status(500).send('Erro no servidor');
        }

        res.status(200).json({ mensagem: 'Mensagem enviada com sucesso!' });
      });
    });


    // Listar mensagens de um canal
    app.get('/canais/:canal_id/mensagens', autenticarUsuario, (req, res) => {
      const { canal_id } = req.params;

      const sql = `
        SELECT 
          mensagens.id, 
          mensagens.mensagem, 
          mensagens.data_envio,
          mensagens.usuario_id, 
          mensagens.data_edicao,
          usuarios.nome AS autor, 
          usuarios.foto_url
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

    app.get('/usuarios', (req, res) => {
      const search = req.query.search || '';

      buscarUsuariosFiltro(search, (err, usuarios) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor' });
        res.status(200).json(usuarios);
      });
    });


    app.post('/amizade/solicitar', autenticarUsuario, async (req, res) => {
      const deId = req.user.id;
      const { paraId } = req.body;

      try {
        await conexao.promise().query(
          'INSERT INTO solicitacoes_amizade (de_usuario_id, para_usuario_id) VALUES (?, ?)',
          [deId, paraId]
        );
        res.status(200).json({ mensagem: 'Solicitação enviada!' });
      } catch (err) {
        console.error('Erro ao enviar solicitação de amizade:', err);
        res.status(500).json({ mensagem: 'Erro ao enviar solicitação' });
      }
    });

    app.get('/amizade/notificacoes', autenticarUsuario, async (req, res) => {
      const usuarioId = req.user.id;

      try {
        const [rows] = await conexao.promise().query(
          `SELECT s.id, u.nome AS remetente
          FROM solicitacoes_amizade s
          JOIN usuarios u ON s.de_usuario_id = u.id
          WHERE s.para_usuario_id = ? AND s.status = 'pendente'`,
          [usuarioId]
        );

        const notificacoes = rows.map(row => ({
          id: row.id,
          tipo: 'amizade',
          mensagem: `${row.remetente} enviou uma solicitação de amizade`
        }));

        res.json(notificacoes);
      } catch (err) {
        console.error('Erro ao buscar notificações:', err);
        res.status(500).json({ erro: 'Erro ao buscar notificações' });
      }
    });



    app.post('/amizade/responder', autenticarUsuario, async (req, res) => {
      const usuarioId = req.user.id;
      const { id, acao } = req.body;

      try {
        const novoStatus = acao === 'aceitar' ? 'aceita' : 'recusada';

        const [result] = await conexao.promise().query(
          'UPDATE solicitacoes_amizade SET status = ? WHERE id = ? AND para_usuario_id = ?',
          [novoStatus, id, usuarioId]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ mensagem: 'Solicitação não encontrada' });
        }

        if (acao === 'aceitar') {
          const [[row]] = await conexao.promise().query(
            'SELECT de_usuario_id FROM solicitacoes_amizade WHERE id = ?',
            [id]
          );

          const amigoId = row.de_usuario_id;

          const usuario1 = Math.min(usuarioId, amigoId);
          const usuario2 = Math.max(usuarioId, amigoId);

          await conexao.promise().query(
            'INSERT IGNORE INTO amigos (usuario1_id, usuario2_id) VALUES (?, ?)',
            [usuario1, usuario2]
          );
        }

        res.status(200).json({ mensagem: `Solicitação ${novoStatus}` });
      } catch (err) {
        console.error('Erro ao responder amizade:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
      }
    });


    // Inicia o servidor

    app.get('/amizade/amigos', autenticarUsuario, async (req, res) => {
      const usuarioId = req.user.id;

      try {
        const [rows] = await conexao.promise().query(
          `SELECT u.id, u.nome, u.foto_url
          FROM amigos a
          JOIN usuarios u ON 
            (u.id = a.usuario1_id AND a.usuario2_id = ?) OR 
            (u.id = a.usuario2_id AND a.usuario1_id = ?)
          WHERE u.id != ?`,
          [usuarioId, usuarioId, usuarioId]
        );

        res.status(200).json(rows);
      } catch (err) {
        console.error('Erro ao buscar amigos:', err);
        res.status(500).json({ erro: 'Erro ao buscar amigos' });
      }
    });


    app.post('/mensagens/amigos/:paraId', autenticarUsuario, upload.single('imagem'), async (req, res) => {
      const deId = req.user.id;
      const paraId = req.params.paraId;
      const { mensagem } = req.body;
      const imagem = req.file ? req.file.filename : null;

      try {
        await conexao.promise().query(
          'INSERT INTO mensagens_amigos (de_usuario_id, para_usuario_id, mensagem, imagem_url) VALUES (?, ?, ?, ?)',
          [deId, paraId, mensagem || null, imagem]
        );

        res.status(201).json({ mensagem: 'Mensagem enviada com sucesso!' });
      } catch (err) {
        console.error('Erro ao enviar mensagem para amigo:', err);
        res.status(500).json({ erro: 'Erro ao enviar mensagem' });
      }
    });

    app.get('/mensagens/amigos/:amigoId', autenticarUsuario, async (req, res) => {
      const usuarioId = req.user.id;
      const amigoId = req.params.amigoId;

      try {
        const [mensagens] = await conexao.promise().query(
          `SELECT m.*, u.nome AS autor, u.foto_url
          FROM mensagens_amigos m
          JOIN usuarios u ON m.de_usuario_id = u.id
          WHERE 
            (m.de_usuario_id = ? AND m.para_usuario_id = ?) OR 
            (m.de_usuario_id = ? AND m.para_usuario_id = ?)
          ORDER BY m.data_envio ASC`,
          [usuarioId, amigoId, amigoId, usuarioId]
        );

        res.json(mensagens);
      } catch (err) {
        console.error('Erro ao buscar mensagens com amigo:', err);
        res.status(500).json({ erro: 'Erro ao buscar mensagens' });
      }
    });

    app.post('/amizade/remover', autenticarUsuario, async (req, res) => {
      const usuarioId = req.user.id;
      const { amigoId } = req.body;

      try {
        await conexao.promise().query(
          `DELETE FROM amigos 
          WHERE (usuario1_id = ? AND usuario2_id = ?) 
              OR (usuario1_id = ? AND usuario2_id = ?)`,
          [usuarioId, amigoId, amigoId, usuarioId]
        );

        res.status(200).json({ mensagem: 'Amizade removida com sucesso' });
      } catch (error) {
        console.error('Erro ao remover amizade:', error);
        res.status(500).json({ mensagem: 'Erro no servidor' });
      }
    });

    // Verificar se nome ou email já estão sendo usados (exceto pelo próprio usuário)
    app.post('/usuarios/verificar', async (req, res) => {
      const { nome, email, userId } = req.body;

      if (!nome || !email || !userId) {
        return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
      }

      try {
        const [rows] = await conexao.promise().query(
          'SELECT * FROM usuarios WHERE (nome = ? OR email = ?) AND id != ? LIMIT 1',
          [nome, email, userId]
        );

        if (rows.length > 0) {
          return res.json({ disponivel: false });
        }

        res.json({ disponivel: true });
      } catch (err) {
        console.error('Erro ao verificar nome/email:', err);
        res.status(500).json({ erro: 'Erro interno do servidor' });
      }
    });

    app.put('/mensagens/:id', autenticarUsuario, async (req, res) => {
      const { id } = req.params;
      const { novaMensagem } = req.body;
      const usuarioId = req.user.id;

      try {
        const [mensagem] = await conexao.promise().query('SELECT * FROM mensagens WHERE id = ?', [id]);
        if (!mensagem.length) return res.status(404).json({ erro: "Mensagem não encontrada" });

        if (mensagem[0].usuario_id !== usuarioId) {
          return res.status(403).json({ erro: "Você não pode editar essa mensagem" });
        }

        await conexao.promise().query(
          'UPDATE mensagens SET mensagem = ?, data_edicao = NOW() WHERE id = ?',
          [novaMensagem, id]
        );

        res.sendStatus(204);
      } catch (err) {
        console.error("Erro ao editar mensagem:", err);
        res.status(500).json({ erro: "Erro interno" });
      }
    });


  app.delete('/mensagens/:id', autenticarUsuario, async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.user.id;

    try {
      const [mensagem] = await conexao.promise().query('SELECT * FROM mensagens WHERE id = ?', [id]);

      if (!mensagem.length) {
        return res.status(404).json({ erro: "Mensagem não encontrada" });
      }

      if (mensagem[0].usuario_id !== usuarioId) {
        return res.status(403).json({ erro: "Você não tem permissão para excluir esta mensagem" });
      }

      await conexao.promise().query('DELETE FROM mensagens WHERE id = ?', [id]);
      res.sendStatus(204);
    } catch (err) {
      console.error("Erro ao deletar mensagem:", err);
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

app.post('/compartilhar_canal', autenticarUsuario, async (req, res) => {
  const deId = req.user.id;
  const { paraId, canalId } = req.body;

  if (!paraId || !canalId) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios ausentes' });
  }

  try {
    await conexao.promise().query(
      'INSERT INTO solicitacoes_canais (canal_id, de_usuario_id, para_usuario_id) VALUES (?, ?, ?)',
      [canalId, deId, paraId]
    );
    res.status(200).json({ mensagem: 'Solicitação enviada!' });
  } catch (err) {
    console.error('Erro ao compartilhar canal:', err);
    res.status(500).json({ mensagem: 'Erro ao compartilhar canal' });
  }
});

app.get('/notificacoes/canais', autenticarUsuario, async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const [rows] = await conexao.promise().query(
      `SELECT s.id, c.nome AS canal_nome, u.nome AS remetente
       FROM solicitacoes_canais s
       JOIN canais c ON s.canal_id = c.id
       JOIN usuarios u ON s.de_usuario_id = u.id
       WHERE s.para_usuario_id = ? AND s.status = 'pendente'`,
      [usuarioId]
    );

    const notificacoes = rows.map(row => ({
      id: row.id,
      tipo: 'compartilhamento_canal',
      mensagem: `${row.remetente} convidou você para participar do canal "${row.canal_nome}"`
    }));

    res.json(notificacoes);
  } catch (err) {
    console.error('Erro ao buscar notificações de canais:', err);
    res.status(500).json({ erro: 'Erro ao buscar notificações' });
  }
});
app.post('/responder_compartilhamento', async (req, res) => {
  const { id, acao } = req.body;
  const usuario_id = req.usuario_id; // Supondo que você extraiu do token

  try {
    // Busca os dados do convite
    const [convites] = await conexao.promise().query(
      'SELECT canal_id FROM convites_canais WHERE id = ?',
      [id]
    );

    if (convites.length === 0) {
      return res.status(404).json({ mensagem: 'Convite não encontrado.' });
    }

    const canal_id = convites[0].canal_id;

    if (acao === 'aceitar') {
      // Verifica se já participa
      const [jaParticipa] = await conexao.promise().query(
        'SELECT * FROM usuarios_canais WHERE usuario_id = ? AND canal_id = ?',
        [usuario_id, canal_id]
      );

      if (jaParticipa.length > 0) {
        return res.json({
          mensagem: 'Você já participa deste canal.',
          ja_participa: true,
          canal_id
        });
      }

      // Insere o usuário no canal
      await conexao.promise().query(
        'INSERT INTO usuarios_canais (usuario_id, canal_id) VALUES (?, ?)',
        [usuario_id, canal_id]
      );

      // Remove o convite
      await conexao.promise().query(
        'DELETE FROM convites_canais WHERE id = ?',
        [id]
      );

      return res.json({ mensagem: 'Você entrou no canal com sucesso!', canal_id });
    } else if (acao === 'recusar') {
      // Apenas remove o convite
      await conexao.promise().query(
        'DELETE FROM convites_canais WHERE id = ?',
        [id]
      );

      return res.json({ mensagem: 'Convite ignorado com sucesso.' });
    }

    res.status(400).json({ mensagem: 'Ação inválida.' });
  } catch (error) {
    console.error('Erro ao responder convite de canal:', error);
    res.status(500).json({ mensagem: 'Erro interno ao processar o convite.' });
  }
});





    app.listen(3001, () => {
      console.log('🚀 Servidor rodando em https://apidoubts.dev.vilhena.ifro.edu.br');
    });
