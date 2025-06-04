// db/usuarios.js
import conexao from '../config/db.js';


// Função para cadastrar um usuário
export function cadastrarUsuario(nome, email, senha, callback) {
  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  conexao.query(sql, [nome, email, senha], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

// Função para listar todos os usuários
export function listarUsuarios(callback) {
  const sql = 'SELECT * FROM usuarios';
  conexao.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
}

// Função para modificar os dados de um usuário
export function modificarUsuario(id, nome, email, senha, callback) {
  const sql = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?';
  conexao.query(sql, [nome, email, senha, id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

// Função para deletar um usuário
export function deletarUsuario(id, callback) {
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  conexao.query(sql, [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
}

// db/usuarios.js
export const salvarCaminhoImagemNoBanco = async (userId, caminho) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE usuarios SET foto_url = ? WHERE id = ?`;
    conexao.query(sql, [caminho, userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



export async function atualizarFotoUsuario(userId, imagem) {
  try {
    const sql = 'UPDATE usuarios SET foto_url = ? WHERE id = ?';

    const result = await new Promise((resolve, reject) => {
      conexao.query(sql, [imagem, userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (result.affectedRows === 0) {
      throw new Error('Usuário não encontrado.');
    }

    return result;
  } catch (error) {
    console.error('Erro ao atualizar a foto do usuário:', error);
    throw error;
  }
}



// Função para buscar a URL da foto do usuário
export async function buscarFotoUsuarioPorId(id) {
  const [rows] = await conexao.promise().query('SELECT foto_url FROM usuarios WHERE id = ?', [id]);
  return rows[0];
}


