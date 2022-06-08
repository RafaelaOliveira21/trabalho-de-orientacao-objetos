// vai requisitar uma API
async function cadastrar() {
    // recuperar os dados do usuário
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const tipoElemental = document.getElementById("tipo").value;
    const poder = document.getElementById("poder").value;
    const nota = Number(document.getElementById("nota").value);
    const arma = document.getElementById("arma").value;
    let url = "https://trabalho-genshin.herokuapp.com/personagens";
    let dado;
    let metodo; // vai conter POST ou PUT

    if (id) { // vai atualizar
        metodo = 'PUT';
        url += `/${id}`;
        dado = {
            nome, tipoElemental, poder, arma, nota
        };
    }
    else { // cadastrar
        metodo = 'POST';
        dado = {
            nome, tipoElemental, poder, arma, nota
        };
    }
    // criar o dado para enviar

    // chamar ou consumir a API utilizando fetch
    await fetch(url, {
        method: metodo,
        body: JSON.stringify(dado),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
        .then(resposta => {
            alert('Cadastro foi realizado com sucesso')
        })
        .catch(error => {
            alert(error)
        });

    consultar();
}

async function consultar() {
    // consome a API e recupera os personagens
    let dados = await fetch('https://trabalho-genshin.herokuapp.com/personagens')
        .then(response => {
            return response.json() // atribui os dados em json para dados
        })
        .catch(error => {
            alert(error)
        });
    // percorrer a variável dados
    // vamos criar uma variável result para concatenar resposta
    let resposta = '';
    dados.map(dado => {
        resposta += `
        <tr>
            <td> ${dado.id} </td> 
            <td> ${dado.nome} </td> 
            <td> ${dado.tipoElemental} </td>
            <td> ${dado.poder} </td>
            <td> ${dado.arma} </td>
            <td> ${dado.nota} </td> 
            <td> <i onClick='remove(${dado.id})' class='bi bi-trash'></i> </td> 
            <td> <i onClick="atualiza(${dado.id}, '${dado.nome}', '${dado.tipo}', '${dado.poder}', '${dado.arma}', ${dado.nota})" class='bi bi-pencil'></i></td>
        </tr>`;
    });
    // colocar a resposta no body da tabela
    document.getElementById("conteudoTabela").innerHTML = resposta;
}

// remove um pokemon do banco de dados
// quem chamar a função remove pode fazer outra ação antes de
// receber resposta
async function remove(id) {
    let confirma = confirm(`Confirma exclusão do personagem? `);

    if (confirma) { // confirma é true
        // chama a api -> é síncrona (aguardamos o retorna do servidor)
        await fetch(`https://trabalho-genshin.herokuapp.com/personagens/${id}`, {
            method: 'DELETE'
        })
            .then(response => { // quando o servidor retornou
                alert(`Personagem foi removido com sucesso`)
                consultar()
            })
            .catch(error => {
                alert(`Problema na remoção`)
            });
    }

}

function atualiza(id, nome, tipoElemental, poder,arma, nota) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("tipo").value = tipoElemental;
    document.getElementById("poder").value = poder;
    document.getElementById("arma").value = arma;
    document.getElementById("nota").value = nota;
}