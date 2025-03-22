/*
  --------------------------------------------------------------------------------------
  Função para obter as progressões existentes no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/progressoes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.progressoes.forEach(item => insertList(item.cod_mapa, item.texto, item.ramo, item.etapa))
    })
    .catch((error) => {
      console.error('Erro ao tentar recuperar as informações do servidor:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
window.onload = (event) => {
  getList();
};

/*
  --------------------------------------------------------------------------------------
  Função para cadastrar uma progressão no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const includeProg = async (inputCode, inputDescription, inputBranch, inputPhase) => {
  const formData = new FormData();
  formData.append('cod_mapa', inputCode);
  formData.append('texto', inputDescription);
  formData.append('ramo', inputBranch);
  formData.append('etapa', inputPhase);

  let url = 'http://127.0.0.1:5000/progressao';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
        if(response.status == 200){
            insertList(inputCode, inputDescription, inputBranch, inputPhase) 
        }
    })
    .catch((error) => {
      console.error('Erro ao tentar inserir progressão:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // let table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const cod_mapa = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(cod_mapa)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/progressao?cod_mapa=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova progressão
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputCode = document.getElementById("newCode").value;
  let inputDescription = document.getElementById("newDescription").value;
  let inputBranch = document.getElementById("newBranch").value;
  let inputPhase = document.getElementById("newPhase").value;

  //console.log("teste: ", inputCode, inputDescription, inputBranch, inputPhase)

  if((inputCode === '')||(inputDescription === '')||(inputBranch === '')||(inputPhase === '')){
    alert('Preencher os valores requeridos!!')
  } else {
        //console.log("teste: ", inputCode, inputDescription, inputBranch, inputPhase)
        includeProg(inputCode, inputDescription, inputBranch, inputPhase)  
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (code, description, branch, phase) => {

  let item = [code, description, branch, phase]
  let table = document.getElementById('progTable');
  let row = table.insertRow();

  for (let i = 0; i < item.length; i++) {
    let cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newCode").value = "";
  document.getElementById("newDescription").value = "";

  removeElement()
}