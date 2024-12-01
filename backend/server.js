const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para permitir CORS
app.use(cors({
  origin: '*', // Permite requisições de qualquer origem. Você pode substituir '*' por 'http://127.0.0.1:5501' para permitir apenas essa origem específica.
}));

app.use(bodyParser.json());

// Conectar ao MongoDB Atlas
const URI = "mongodb+srv://nayron:Fiema2025@pessoasdb.1ge2p.mongodb.net/?retryWrites=true&w=majority&appName=PessoasDB";
mongoose.connect(URI)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o esquema de Pessoa
const pessoaSchema = new mongoose.Schema({
  nome: String,
  categoria: String,
  timerId: String,
  startTime: Date,
  endTime: Date,
  refeicao: Boolean,
});

const Pessoa = mongoose.model('Pessoa', pessoaSchema);

// Rota para pegar todas as pessoas
app.get('/api/pessoas', async (req, res) => {
  try {
    const pessoas = await Pessoa.find();
    res.json(pessoas);
  } catch (error) {
    res.status(500).send('Erro ao buscar pessoas');
  }
});

// Rota para salvar as pessoas
app.post('/api/pessoas', async (req, res) => {
  try {
    const pessoasData = req.body;
    await Pessoa.deleteMany({});
    await Pessoa.insertMany(pessoasData);
    res.status(200).send('Pessoas atualizadas com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao salvar pessoas');
  }
});

// Rota para resetar o status das pessoas
app.post('/api/reset', async (req, res) => {
  try {
    await Pessoa.updateMany({}, { $set: { refeicao: false, startTime: null, endTime: null, timerId: null } });
    res.status(200).send('Status resetados com sucesso');
  } catch (error) {
    res.status(500).send('Erro ao resetar status');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
