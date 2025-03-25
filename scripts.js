/*
  --------------------------------------------------------------------------------------
  Função para obter os ativos existentes no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/ativos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => data.ativos.forEach(item => insertList(item.simbolo, item.nome, item.preco_medio, 
      item.quantidade, item.cotacao, item.data_cotacao)))
    .catch((error) => {
      console.error('Erro ao tentar recuperar as informações do servidor:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a cotação atualizada de ativos via requisição GET
  --------------------------------------------------------------------------------------
*/
const getQuote(simbolo) = async () => {
  let url = 'http://127.0.0.1:5000/atualizacotacao';
  fetch(url, {
    method: 'get',
    body: JSON.stringify({simbolo: simbolo})
  })
    .then((response) => response.json())
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
  Função para cadastrar um ativo no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const includeAsset = async (inputSymbol, inputName, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('simbolo', inputSymbol);
  formData.append('nome', inputName);
  formData.append('quantidade', inputQuantity);
  formData.append('preco_medio', inputPrice);

  let url = 'http://127.0.0.1:5000/ativo';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
        if(response.status == 200){
            insertList(inputSymbol, inputName, inputQuantity, inputPrice,'n/a','n/a') 
        }
    })
    .catch((error) => {
      console.error('Erro ao tentar inserir ativo:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar botão para cada item da lista
  --------------------------------------------------------------------------------------

const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}*/


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão delete
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let delete_asset = document.getElementsByClassName("delete");
  // let table = document.getElementById('myTable');
  let i;
  for (i = 0; i < delete_asset.length; i++) {
    delete_asset[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const simbolo = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteAsset(simbolo)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar a cotação de um ativo ao clicar no botão de update
  --------------------------------------------------------------------------------------
*/
const updateQuote = () => {
  let update_quote = document.getElementsByClassName("update_quote");
  let i;
  for (i = 0; i < update_quote.length; i++) {
    update_quote[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const simbolo = div.getElementsByTagName('td')[0].innerHTML
      getQuote(simbolo)
      //chamada funcao atualizar cotacao
      //atualizar data e cotacao na tabela

    }
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteAsset = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/ativo?simbolo=' + item;
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
  Função para adicionar um novo ativo
  --------------------------------------------------------------------------------------
*/
const newAsset = () => {
  let inputSymbol = document.getElementById("newCode").value;
  let inputName = document.getElementById("newName").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  //console.log("teste: ", inputCode, inputDescription, inputBranch, inputPhase)

  if((inputSymbol === '')||(inputName === '')||(inputQuantity === '')||(inputPrice === '')){
    alert('Preencher os valores requeridos!!')
  } else {
        //console.log("teste: ", inputCode, inputDescription, inputBranch, inputPhase)
        includeAsset(inputSymbol, inputName, inputQuantity, inputPrice)  
    }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (symbol,name,quantity,price,quote = 'n/d',quote_date = 'n/d') => {

  let item = [symbol,name,quantity,price,quote,quote_date]
  let table = document.getElementById('assetTable');
  let row = table.insertRow();

  for (let i = 0; i < item.length; i++) {
    let cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  //insertButton(row.insertCell(-1));

  row.insertCell(-1).innerHTML = '<span class ="update_quote"><i class="fi fi-bs-refresh"></i></span>  |  <span class="delete"><i class="fi fi-bs-trash-xmark"></i></span>';

  document.getElementById("newSymbol").value = "";
  document.getElementById("newName").value = "";

  removeElement()
}