import Personagem from "../model/Personagem.js";
export default class PersonagemController {
    _url;
    _urlArmas;
    _urlTiposElementais;
    _idInput;
    _nomeInput;
    _notaInput;
    _poderInput;
    _armasSelect;
    _tiposElementaisSelect;
    _corpoTabela;
    constructor() {
        this.preencherCampos();
        fetch(this._urlArmas)
            .then((response) => response.json())
            .then((armas) => {
            armas.forEach((arma) => {
                const option = new Option(this.removerAspas(this.formatarNomeArma(arma)), arma);
                this._armasSelect.options[this._armasSelect.options.length] = option;
            });
        })
            .catch((error) => alert(error));
        fetch(this._urlTiposElementais)
            .then((response) => response.json())
            .then((tiposElementais) => {
            tiposElementais.forEach((tipoElemental) => {
                const option = new Option(this.removerAspas(tipoElemental), tipoElemental);
                this._tiposElementaisSelect.options[this._tiposElementaisSelect.options.length] = option;
            });
        })
            .catch((error) => alert(error));
    }
    async findAll() {
        this.preencherCampos();
        const personagens = await fetch(`${this._url}?page=0&size=10&sort=id,asc`)
            .then((response) => response.json())
            .catch((error) => alert(error));
        let response = "";
        personagens.content.map((personagem) => (response += `
            <tr>
                <td class="text-center"> ${personagem.id} </td> 
                <td class="text-center"> ${personagem.nome} </td> 
                <td class="text-center"> ${personagem.tipoElemental} </td>
                <td class="text-center"> ${personagem.poder} </td>
                <td class="text-center"> ${this.formatarNomeArma(personagem.arma)} </td>
                <td class="text-center"> ${personagem.nota} </td> 
                <td class="text-center"> <i role="button" .botao-atualizar class='bi bi-pencil text-warning'></i></td>
                <td class="text-center"> <i role="button" class='bi bi-trash text-danger botao-excluir'></i> </td> 
            </tr>`));
        this._corpoTabela.innerHTML = response;
        this.adicionarEventos();
    }
    async save() {
        this.preencherCampos();
        const arma = this.removerAspas(this._armasSelect.options[this._armasSelect.selectedIndex].value);
        const tipoElemental = this.removerAspas(this._tiposElementaisSelect.options[this._tiposElementaisSelect.selectedIndex].value);
        let personagem, metodo;
        if (this._idInput.value) {
            metodo = "PUT";
            this._url += `/${this._idInput.value}`;
            personagem = new Personagem(Number(this._idInput.value), this._nomeInput.value, tipoElemental, arma, this._poderInput.value, Number(this._notaInput.value));
        }
        else {
            metodo = "POST";
            personagem = new Personagem(null, this._nomeInput.value, tipoElemental, arma, this._poderInput.value, Number(this._notaInput.value));
        }
        await fetch(this._url, {
            method: metodo,
            body: Personagem.fromJson(personagem),
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        })
            .then((response) => {
            if (response.status == 200) {
                alert("Atualização realizada com sucesso!");
            }
            else if (response.status == 201) {
                alert("Cadastro realizado com sucesso!");
            }
            else if (response.status == 400) {
                alert("Preencha todos os campos!");
            }
            else if (response.status == 500) {
                alert("Erro no servidor!");
            }
            this.findAll();
            this.limparCampos();
        })
            .catch((error) => {
            alert(error);
        });
    }
    update(id, nome, tipoElemental, poder, arma, nota) {
        this._idInput.value = id.toString();
        this._nomeInput.value = nome.toString();
        this._poderInput.value = poder.toString();
        this._notaInput.value = nota.toString();
        const armasList = document.querySelectorAll("#armas > option");
        armasList.forEach((armaAtual, index) => {
            if (armaAtual.innerText == arma) {
                this._armasSelect.selectedIndex = index;
            }
        });
        const tiposElementais = this._tiposElementaisSelect.querySelectorAll("option");
        tiposElementais.forEach((tipoElementalAtual, index) => {
            if (tipoElementalAtual.innerText === tipoElemental) {
                this._tiposElementaisSelect.selectedIndex = index;
            }
        });
    }
    async delete(id) {
        const confirmar = confirm(`Confirmar exclusão do personagem de id ${id}?`);
        if (confirmar) {
            await fetch(`${this._url}/${id}`, {
                method: "DELETE",
            })
                .then((resposta) => {
                alert(`Personagem foi removido com sucesso`);
                this.findAll();
            })
                .catch((error) => alert(`Problema na remoção: ${error}`));
        }
    }
    formatarNomeArma(arma) {
        return arma.replace("LANCA", "LANÇA").replace("_", " ");
    }
    removerAspas(texto) {
        return texto.replace(/['"]+/g, "");
    }
    preencherCampos() {
        this._url = "https://trabalho-genshin.herokuapp.com/personagens";
        this._urlArmas = "https://trabalho-genshin.herokuapp.com/tipo-armas";
        this._urlTiposElementais =
            "https://trabalho-genshin.herokuapp.com/tipo-elemental";
        this._idInput = document.getElementById("id");
        this._nomeInput = document.getElementById("nome");
        this._notaInput = document.getElementById("nota");
        this._poderInput = document.getElementById("poder");
        this._armasSelect = document.getElementById("armas");
        this._tiposElementaisSelect = (document.getElementById("tipoElemental"));
        this._corpoTabela = (document.getElementById("conteudoTabela"));
    }
    limparCampos() {
        this._idInput.value = "";
        this._nomeInput.value = "";
        this._notaInput.value = "";
        this._poderInput.value = "";
        this._armasSelect.selectedIndex = 0;
        this._tiposElementaisSelect.selectedIndex = 0;
    }
    adicionarEventos() {
        const table = document.querySelectorAll("#conteudoTabela > tr");
        table.forEach((tr, index) => {
            const tdId = (tr.querySelector("td:nth-child(1)"));
            const tdNome = (tr.querySelector("td:nth-child(2)"));
            const tdTipoElemental = tr.querySelector("td:nth-child(3)");
            const tdPoder = (tr.querySelector("td:nth-child(4)"));
            const tdArma = (tr.querySelector("td:nth-child(5)"));
            const tdNota = (tr.querySelector("td:nth-child(6)"));
            const buttonUpdate = (tr.querySelector("td:nth-child(7)"));
            const buttonDelete = (tr.querySelector("td:nth-child(8)"));
            buttonDelete.addEventListener("click", (event) => {
                event.preventDefault();
                this.delete(Number(tdId.innerText));
            });
            buttonUpdate.addEventListener("click", (event) => {
                event.preventDefault();
                this.update(tdId.innerText, tdNome.innerText, tdTipoElemental.innerText, tdPoder.innerText, tdArma.innerText, tdNota.innerText);
            });
        });
    }
}
//# sourceMappingURL=PersonagemController.js.map