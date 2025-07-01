const { Client } = require('pg');

const db = new Client({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'Login',
  password: '12345',
  port: 5432,
});

db.connect();

// Criar tabela login
async function criarTabela() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS login (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        email VARCHAR(100),
        senha VARCHAR(100)
      );
    `);
    console.log('Tabela criada com sucesso!');
  } catch (err) {
    console.error(err);
  }
}

// Inserir dados na tabela login
async function inserirDados() {
  try {
    await db.query(`
    INSERT INTO login (nome, email, senha)
    VALUES ('Adrielly', 'adriellyr740@gmail.com', '12345');
  `);
  console.log('Dados inseridos com sucesso!');
} catch (err) {
  console.error(err);
}
}

// Consultar dados na tabela login
async function consultarDados() {
try {
  const results = await db.query(`
    SELECT * FROM login
    WHERE email = 'adriellyr740@gmail.com';
  `);
  console.log(results.rows);
} catch (err) {
  console.error(err);
}
}

// Chamar as funções
async function main() {
await criarTabela();
await inserirDados();
await consultarDados();
db.end();
}
main();

// Função para consultar previsão do tempo
async function consultarPrevisao() {
  const cidade = prompt('Digite o nome da cidade: ');

  try {
    const geo = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: cidade,
        format: 'json',
        limit: 1,
      },
    });

    if (geo.data.length === 0) {
      console.log('Cidade não encontrada.\n');
      return;
    }

    const { lat, lon } = geo.data[0];

    const tempo = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
      },
    });

    const clima = tempo.data.current_weather;
    console.log(`\nPrevisão em ${cidade}:`);
    console.log(`Temperatura: ${clima.temperature}°C`);
    console.log(`Vento: ${clima.windspeed} km/h`);
    console.log(`Data/Hora: ${clima.time}\n`);
  } catch (err) {
    console.error('Erro ao consultar API:', err.message);
  }
}

// Início do sistema
(async () => {
  const logado = await login();
  if (logado) {
    await consultarPrevisao();
  }
  db.end();
})();
