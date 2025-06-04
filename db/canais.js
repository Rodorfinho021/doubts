// db/canais.js
import conexao from '../config/db.js';

// Função para criar um canal
export function criarCanal(nome, descricao, foto_url, usuario_criador_id) {
  return new Promise((resolve, reject) => {
    descricao = descricao || '';
    foto_url = foto_url || '';

    const sql = 'INSERT INTO canais (nome, descricao, foto_url, usuario_criador_id) VALUES (?, ?, ?, ?)';
    conexao.query(sql, [nome, descricao, foto_url, usuario_criador_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}


  
// Função para adicionar um usuário a um canal
export function adicionarUsuarioCanal(usuario_id, canal_id, callback) {
  const sql = 'INSERT INTO usuarios_canais (usuario_id, canal_id) VALUES (?, ?)';
  conexao.query(sql, [usuario_id, canal_id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

// Função para enviar uma mensagem no canal
export function enviarMensagem(usuario_id, canal_id, mensagem, callback) {
  const sql = 'INSERT INTO mensagens (usuario_id, canal_id, mensagem) VALUES (?, ?, ?)';
  conexao.query(sql, [usuario_id, canal_id, mensagem], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

// Função para verificar o dono de um canal
export function verificarDonoCanal(canal_id, callback) {
  const sql = 'SELECT usuario_criador_id FROM canais WHERE id = ?';
  conexao.query(sql, [canal_id], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null); // Canal não encontrado
    callback(null, results[0].usuario_criador_id);
  });
}

// Função para atualizar um canal
export function atualizarCanal(id, nome, descricao, foto_url, callback) {
  const sql = 'UPDATE canais SET nome = ?, descricao = ?, foto_url = ? WHERE id = ?';
  conexao.query(sql, [nome, descricao, foto_url, id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

// Função para excluir um canal
export function excluirCanal(id, callback) {
  const sql = 'DELETE FROM canais WHERE id = ?';
  conexao.query(sql, [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

export function buscarCanaisPorUsuario(usuario_id, callback) {
    const sql = `
      SELECT c.id, c.nome, c.descricao, c.foto_url, c.data_criacao
      FROM usuarios_canais uc
      JOIN canais c ON uc.canal_id = c.id
      WHERE uc.usuario_id = ?
    `;
    conexao.query(sql, [usuario_id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  }

  export function buscarTodosCanais(callback) {
    const sql = `SELECT id, nome, foto_url, usuario_criador_id FROM canais`;
    conexao.query(sql, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  }

  
  
// db/canais.js

export function atualizarFotoCanais(canalId, fotoUrl) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE canais SET foto_url = ? WHERE id = ?';
    conexao.query(sql, [fotoUrl, canalId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

  
  
  // Função para buscar a URL da foto do usuário
  export async function buscarFotoCanalPorId(id) {
    const [rows] = await conexao.promise().query('SELECT foto_url FROM canais WHERE id = ?', [id]);
    return rows[0];
  }