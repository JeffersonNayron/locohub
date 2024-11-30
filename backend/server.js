const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Lista de pessoas (predefinida)
let pessoas = [
  { nome: "Jéssica Ellen", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Nayron", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "André", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Adelan", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Antonio Carlos", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "A. Lopes", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Rufino", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "CID", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Filgueiras", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Geraldo", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Humberto", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Rabelo", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Joanderson", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Joel", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Laercio", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "M. Rogério", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Mário", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Evellin", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Naylan", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Otoniel", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "P. Castro", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "P. Junior", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Pereira Rafael", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Rosana", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Walterilson", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false },
  { nome: "Weberth", categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false }
];

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Rota de exemplo para enviar a lista de pessoas
app.get('/api/pessoas', (req, res) => {
  res.json(pessoas);
});

// Iniciar o WebSocket
wss.on("connection", ws => {
  console.log("Novo cliente conectado!");

  // Enviar a lista de pessoas para o cliente quando ele se conectar
  ws.send(JSON.stringify({ type: "pessoas", data: pessoas }));

  // Lidar com mensagens recebidas
  ws.on("message", message => {
    console.log("Mensagem recebida: ", message);

    try {
      const data = JSON.parse(message);

      if (data.type === "adicionarPessoa") {
        // Adiciona uma nova pessoa à lista
        const novaPessoa = { nome: data.nome, categoria: null, timerId: null, startTime: null, endTime: null, refeicao: false };
        pessoas.push(novaPessoa);
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "pessoas", data: pessoas }));
          }
        });
      }

      if (data.type === "removerPessoa") {
        // Remove uma pessoa da lista
        pessoas = pessoas.filter(pessoa => pessoa.nome !== data.nome);
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "pessoas", data: pessoas }));
          }
        });
      }
      
      if (data.type === "iniciarRefeicao") {
        // Marca pessoa como em refeição
        const pessoa = pessoas.find(p => p.nome === data.nome);
        if (pessoa) {
          pessoa.refeicao = true;
          pessoa.startTime = new Date();
          const endTime = new Date(pessoa.startTime.getTime() + 10000); // Tempo de refeição (10 segundos)
          pessoa.endTime = endTime;

          // Envia a atualização para todos os clientes
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "pessoas", data: pessoas }));
            }
          });

          // Marca como disponível após 10 segundos
          setTimeout(() => {
            pessoa.refeicao = false;
            pessoa.startTime = null;
            pessoa.endTime = null;
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "pessoas", data: pessoas }));
              }
            });
          }, 10000);
        }
      }
    } catch (e) {
      console.error("Erro ao processar a mensagem: ", e);
    }
  });

  // Lidar com a desconexão do cliente
  ws.on("close", () => {
    console.log("Cliente desconectado!");
  });
});

// Iniciar servidor HTTP
server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
