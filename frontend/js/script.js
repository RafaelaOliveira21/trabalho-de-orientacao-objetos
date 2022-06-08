window.addEventListener('load', () => {
    let urlTipoElemental = "https://trabalho-genshin.herokuapp.com/tipo-elemental";
    let urlArmas = "https://trabalho-genshin.herokuapp.com/tipo-armas";
    const arma = document.getElementById("armas");
    const tipoElemental = document.getElementById("tipoElemental");
    const armasList = fetch(urlArmas)
        .then(response => {
            return response.json()
        })
        .catch(error => {
            alert(error)
        });

    const tipoElementalList = fetch(urlTipoElemental)
        .then(response => {
            return response.json()
        })
        .catch(error => {
            alert(error)
        });

    armasList
        .then(dados => {
            dados
                .forEach((armaAtual) => {
                    option = new Option(
                        JSON.stringify(armaAtual)
                            .replace(/['"]+/g, '')
                            .replace("LANCA", "LANÇA")
                            .replace("_", " "),
                        JSON.stringify(armaAtual)
                    );

                    arma.options[arma.options.length] = option;
                });
        });

    tipoElementalList
        .then(dados => {
            dados
                .forEach((tipoElementalAtual) => {
                    option = new Option(
                        JSON.stringify(tipoElementalAtual).replace(/['"]+/g, '').replace("_", " "),
                        JSON.stringify(tipoElementalAtual)
                    );

                    tipoElemental.options[tipoElemental.options.length] = option;
                });
        });


}, false);

async function cadastrar() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const tipoElemental = document.getElementById("tipo");
    const poder = document.getElementById("poder").value;
    const nota = Number(document.getElementById("nota").value);
    const arma = document.getElementById("armas");
    let urlBase = "https://trabalho-genshin.herokuapp.com/personagens";
    let dado;
    let metodo;

    if (id) {
        metodo = 'PUT';
        urlBase += `/${id}`;
        dado = {
            nome, tipoElemental, poder, arma, nota
        };
    }
    else {
        metodo = 'POST';
        dado = {
            nome, tipoElemental, poder, arma, nota
        };
    }

    await fetch(urlBase, {
        method: metodo,
        body: JSON.stringify(dado),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    })
        .then(resposta => {
            alert('Cadastro realizado com sucesso')
        })
        .catch(error => {
            alert(error)
        });

    consultar();
}

async function consultar() {
    let dados = await fetch('https://trabalho-genshin.herokuapp.com/personagens')
        .then(response => {
            return response.json()
        })
        .catch(error => {
            alert(error)
        });

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
            <td> <i onClick="atualiza(${dado.id}, '${dado.nome}', '${dado.tipoElemental}', '${dado.poder}', '${dado.arma}', ${dado.nota})" class='bi bi-pencil'></i></td>
        </tr>`;
    });

    document.getElementById("conteudoTabela").innerHTML = resposta;
}

async function remove(id) {
    let confirma = confirm(`Confirma exclusão do personagem? `);

    if (confirma) {
        await fetch(`https://trabalho-genshin.herokuapp.com/personagens/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                alert(`Personagem foi removido com sucesso`)
                consultar()
            })
            .catch(error => {
                alert(`Problema na remoção`)
            });
    }

}

function atualiza(id, nome, tipoElemental, poder, arma, nota) {
    document.getElementById("id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("tipo").value = tipoElemental;
    document.getElementById("poder").value = poder;
    document.getElementById("arma").value = arma;
    document.getElementById("nota").value = nota;
}