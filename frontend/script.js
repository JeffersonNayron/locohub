// Inicializa a lista de pessoas com os nomes predefinidos
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

const categories = ["x5", "x6", "vv", "ctr", "pial", "comp"]; // As categorias são fixas
let pendingCount = 0;
let refeicaoCount = 0;
let availableCount = 0;

const pessoaListElement = document.getElementById("pessoaList");
const categoriaElements = categories.map(id => document.getElementById(id));

// Função para carregar as pessoas do servidor (backend)
const carregarPessoas = async () => {
  // Removido para adicionar pessoas fixas diretamente
  // const response = await fetch('http://localhost:3000/api/pessoas');
  // const pessoas = await response.json();
  updatePessoaList(pessoas);  // Atualiza a interface com as pessoas carregadas
};

// Função para salvar as pessoas no servidor (backend)
const salvarPessoas = async (pessoas) => {
  await fetch('https://locohub.onrender.com/api/pessoas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pessoas),
  });
};

// Atualizar a análise de dados
const updateAnalysis = () => {
  refeicaoCount = pessoas.filter(pessoa => pessoa.refeicao).length;
  pendingCount = pessoas.length - refeicaoCount;
  availableCount = pessoas.length - refeicaoCount;

  document.getElementById("pendentes").textContent = `Pendentes: ${pendingCount}`;
  document.getElementById("emRef").textContent = `Fizeram a refeição: ${refeicaoCount}`;
};

// Exibir a lista de pessoas disponíveis para adicionar nas categorias
const updatePessoaList = () => {
  pessoaListElement.innerHTML = ''; // Limpar lista
  pessoas.forEach(pessoa => {
    const listItem = document.createElement("li");

    // Criar o símbolo de status (verde se em refeição, vermelho se não)
    const statusSymbol = document.createElement("span");
    statusSymbol.textContent = "●";
    statusSymbol.style.color = pessoa.refeicao ? "green" : "red"; // Verde se em refeição, vermelho se não
    statusSymbol.style.fontSize = '25px';

    // Nome da pessoa
    const nomeElement = document.createElement("span");
    nomeElement.textContent = pessoa.nome;
    nomeElement.classList.add('nomes');

    // Adiciona o símbolo antes do nome
    listItem.appendChild(statusSymbol);
    listItem.appendChild(nomeElement);

    // Criar o botão para remover pessoa da lista
    const removeButton = document.createElement("button");
    removeButton.classList.add('remove');
    removeButton.textContent = "Remover";
    removeButton.onclick = () => removerPessoaDaLista(pessoa, listItem);

    listItem.appendChild(removeButton);

    // Criar dropdown para selecionar local
    const dropdown = document.createElement("select");
    dropdown.classList.add('dropdown');
    dropdown.innerHTML = dropdown.innerHTML =dropdown.innerHTML = `
    <option value="">Local</option>
    ${categories.map(cat => {
      if (pessoa.categoria) {
        // Se a pessoa já tem uma categoria, desabilita todas as opções
        return `<option value="${cat}" disabled>${cat.toUpperCase()}</option>`;
      } else {
        // Se não, exibe as opções normalmente
        return `<option value="${cat}" ${pessoa.categoria === cat ? 'disabled' : ''}>${cat.toUpperCase()}</option>`;
      }
    }).join('')}
  `;
  
  
    dropdown.onchange = () => addPessoaToCategory(pessoa, dropdown.value, dropdown);
    listItem.appendChild(dropdown);

    pessoaListElement.appendChild(listItem);
  });
};

// Adicionar pessoa em uma categoria
const addPessoaToCategory = (pessoa, categoryId, dropdown) => {
  if (categories.includes(categoryId)) {
    const categoryElement = document.getElementById(categoryId);

    // Verifica se a pessoa já está no local
    if (!Array.from(categoryElement.children).some(child => child.textContent.includes(pessoa.nome))) {
      const listItem = document.createElement("div");
      listItem.classList.add("category-item");
      listItem.textContent = pessoa.nome;

      const removeButton = document.createElement("button");
      removeButton.classList.add('remove');
      removeButton.textContent = "Sair";
      removeButton.onclick = () => removePessoaFromCategory(pessoa, listItem, categoryId);

      const refeicaoButton = document.createElement("button");
      refeicaoButton.classList.add('refeicao');
      refeicaoButton.textContent = "Refeição";
      refeicaoButton.onclick = () => startRefeicao(pessoa, refeicaoButton, listItem);

      listItem.appendChild(removeButton);
      listItem.appendChild(refeicaoButton);
      categoryElement.appendChild(listItem);

      // Atualiza a categoria da pessoa e desativa o local no dropdown
      pessoa.categoria = categoryId;
      dropdown.disabled = true;

      // Salva no servidor após cada modificação
      salvarPessoas(pessoas);
    }
  }
};

// Remover pessoa de uma categoria
const removePessoaFromCategory = (pessoa, listItem, categoryId) => {
  const categoryElement = document.getElementById(categoryId);
  categoryElement.removeChild(listItem);

  // Liberar o dropdown de categoria para a pessoa novamente
  pessoa.categoria = null;
  salvarPessoas(pessoas); // Salva no servidor
  updatePessoaList();
};

// Remover pessoa da lista (não está mais na lista geral)
const removerPessoaDaLista = (pessoa, listItem) => {
  // Remove a pessoa do array
  pessoas = pessoas.filter(p => p !== pessoa);
  
  // Remove o item da lista na interface
  pessoaListElement.removeChild(listItem);

  // Salva as pessoas no servidor após a remoção
  salvarPessoas(pessoas);
  updatePessoaList(); // Atualiza a lista de pessoas
  updateAnalysis();   // Atualiza a análise de dados
};

// Iniciar refeição e marcar o tempo
const startRefeicao = (pessoa, button, listItem) => {
  const startTime = new Date();
  pessoa.startTime = startTime;

  // Exibir a hora inicial e final imediatamente
  const startTimeString = startTime.toLocaleTimeString();
  const endTime = new Date(startTime.getTime() + 10000); // Hora final será 10 segundos depois
  const endTimeString = endTime.toLocaleTimeString();

  // Remover o botão "Refeição" e exibir horários
  const timeDisplay = document.createElement("div");
  timeDisplay.textContent = `Início: ${startTimeString} | Final: ${endTimeString}`;
  button.remove(); // Remove o botão "Refeição"
  timeDisplay.style.color = 'blue';
  listItem.appendChild(timeDisplay); // Adiciona os horários ao item da lista

  // Timer de 10 segundos
  pessoa.timerId = setTimeout(() => {
    pessoa.endTime = endTime;

    // Atualizar a mensagem para "Disponível <hora final>"
    timeDisplay.style.color = 'green';
    timeDisplay.textContent = `Disponível às ${endTimeString}`;
    timeDisplay.classList.add('timeDisplay');

    // Atualizar os contadores
    refeicaoCount++;
    pendingCount--;

    // Atualiza a análise
    updateAnalysis();
  }, 10000); // 10 segundos para a refeição

  pessoa.refeicao = true; // Marcar como em refeição
  updatePessoaList(); // Atualizar a lista de pessoas

  // Aqui, já fazemos a contagem de refeição na análise, independentemente do tempo
  updateAnalysis();
};

// Função para resetar o status de todos para "não fez refeição" (ícones vermelhos)
const resetStatus = () => {
  // Solicita a senha ao usuário
  const senha = prompt("Digite a senha para resetar os status:");

  // Verifica se a senha é correta (você pode alterar "12345" para a senha que desejar)
  if (senha === "sTTaTT") {
    pessoas.forEach(pessoa => {
      pessoa.refeicao = false; // Resetar status para "não fez refeição"
      pessoa.timerId = null;   // Limpar timer
      pessoa.startTime = null; // Limpar hora de início
      pessoa.endTime = null;   // Limpar hora de fim
    });
    updatePessoaList(); // Atualiza a lista com os novos status
    updateAnalysis();   // Atualiza a análise de dados
    alert("Status resetados com sucesso!");
  } else {
    alert("Senha incorreta! Não foi possível resetar os status.");
  }
};

// Adicionar evento para o botão de resetar status
document.getElementById('resetarStatus').addEventListener('click', resetStatus);


// Função para adicionar uma pessoa na lista quando entrar no site
document.addEventListener("DOMContentLoaded", function() {
  carregarPessoas(); // Carrega as pessoas do servidor

  const nomeInput = document.getElementById('nomePessoa');
  const adicionarPessoaBtn = document.getElementById('adicionarPessoa');
  
  // Função para adicionar uma pessoa
  function adicionarPessoa(nome) {
    const novaPessoa = {
      nome: nome,
      categoria: null,
      timerId: null,
      startTime: null,
      endTime: null,
      refeicao: false,
    };
    pessoas.push(novaPessoa); // Adiciona a pessoa na lista
    salvarPessoas(pessoas); // Salva no servidor
    updatePessoaList(); // Atualiza a lista de pessoas
    updateAnalysis(); // Atualiza a análise de dados
  }

  // Ao clicar no botão, adiciona a pessoa
  adicionarPessoaBtn.addEventListener('click', function() {
    const nomePessoa = nomeInput.value.trim();
    if (nomePessoa) {
      adicionarPessoa(nomePessoa); // Adiciona a pessoa à lista
      nomeInput.value = '';  // Limpa o campo de entrada
    } else {
      alert('Por favor, digite um nome!');
    }
  });

  // Adicionar evento para o botão de resetar status
  document.getElementById('resetarStatus').addEventListener('click', resetStatus);
  

  // Iniciar a lista ao carregar a página
  updatePessoaList(); 
  updateAnalysis();
});

