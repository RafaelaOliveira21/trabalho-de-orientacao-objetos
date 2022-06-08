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
    const poder = document.getElementById("poder").value;
    const nota = Number(document.getElementById("nota").value);
    const armaOption = document.getElementById("armas");
    const tipoElementalOption = document.getElementById("tipoElemental");
    const arma = armaOption.options[armaOption.selectedIndex].value.replace(/['"]+/g, '');
    const tipoElemental = tipoElementalOption.options[tipoElementalOption.selectedIndex].value.replace(/['"]+/g, '');
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
            if (resposta.status == 200) {
                alert('Atualização realizado com sucesso!');
            }
            if (resposta.status == 201) {
                alert('Cadastro realizado com sucesso!');
            } else if (resposta.status == 400) {
                alert('Preencha todos os campos!');
            } else if (resposta.status == 500) {
                alert('Erro no servidor!');
            }
        })
        .catch(error => {
            alert(error);
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
    dados
        .map(dado => {
            resposta += `
                <tr>
                    <td> ${dado.id} </td> 
                    <td> ${dado.nome} </td> 
                    <td> ${dado.tipoElemental} </td>
                    <td> ${dado.poder} </td>
                    <td> ${dado.arma.replace("LANCA", "LANÇA").replace("_", " ")} </td>
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
    document.getElementById("poder").value = poder;
    document.getElementById("nota").value = nota;

    const armas = document.getElementById("armas");
    const armasList = armas.querySelectorAll("option");
    armasList
        .forEach((armaAtual, index) => {
            if (armaAtual.innerText.replace(" ", "_").replace("LANÇA", "LANCA") == arma) {
                armas.selectedIndex = index;
            }
        });

    const tipoElementalOption = document.getElementById("tipoElemental");
    const tipoElementalList = tipoElementalOption.querySelectorAll('option');
    tipoElementalList
        .forEach((tipoElementalAtual, index) => {
            if (tipoElementalAtual.innerText === tipoElemental) {
                tipoElementalOption.selectedIndex = index;
            }
        });


}