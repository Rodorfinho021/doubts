import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'ss04ggwskkwc0ksgcookg48w',
  user: 'doubts',
  password: '12345678',
  database: 'doubts_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Conectado ao banco de dados com pool!');
    connection.release(); // libera a conexão de volta pro pool
  }
});

export default pool;
