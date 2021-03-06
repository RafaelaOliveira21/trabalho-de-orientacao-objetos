import { Method } from "../enums/Method.js";
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
    _paginacao;
    _pageSize;
    _filterInput;
    constructor() {
        this.preencherCampos();
        this.criarOptions();
    }
    async findPersonagens(page, pageSize, filtro) {
        const size = Number(this._pageSize.options[this._pageSize.selectedIndex].value);
        let url = '';
        url = filtro
            ? `${PersonagemController.getUrl()}?page=${page ? page : 0}&size=${pageSize ? pageSize : size}&sort=id,asc&filtro=${filtro}`
            : `${PersonagemController.getUrl()}?page=${page ? page : 0}&size=${pageSize ? pageSize : size}&sort=id,asc`;
        return await fetch(url)
            .then((response) => response.json())
            .catch((error) => alert("Erro: " + error));
    }
    async findAll(page, pageSize) {
        const personagens = await this.findPersonagens(page, pageSize);
        this.criarPaginacao(personagens);
        this.paginacaoController(personagens);
    }
    async save() {
        this.preencherCampos();
        const arma = PersonagemController.removerAspas(this._armasSelect.options[this._armasSelect.selectedIndex].value);
        const tipoElemental = PersonagemController.removerAspas(this._tiposElementaisSelect.options[this._tiposElementaisSelect.selectedIndex].value);
        let personagem;
        const id = Number(this._idInput.value);
        const metodo = id ? Method.PUT : Method.POST;
        this._url = id ? `${PersonagemController.getUrl()}/${id}` : PersonagemController.getUrl();
        personagem = new Personagem(id, this._nomeInput.value, tipoElemental, arma, this._poderInput.value, Number(this._notaInput.value));
        await fetch(this._url, {
            method: metodo,
            body: Personagem.fromJson(personagem),
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        })
            .then((response) => {
            switch (response.status) {
                case 200:
                    alert("Atualiza????o realizada com sucesso!");
                    break;
                case 201:
                    alert("Personagem cadastrado com sucesso!");
                    break;
                case 400:
                    alert("Preencha todos os campos!");
                    break;
                case 500:
                    alert("Erro no servidor!");
                    break;
            }
            this.findAll(0, 10);
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
        armasList
            .forEach((armaAtual, index) => {
            if (armaAtual.innerText == arma) {
                this._armasSelect.selectedIndex = index;
            }
        });
        const tiposElementais = this._tiposElementaisSelect.querySelectorAll("option");
        tiposElementais
            .forEach((tipoElementalAtual, index) => {
            if (tipoElementalAtual.innerText === tipoElemental) {
                this._tiposElementaisSelect.selectedIndex = index;
            }
        });
    }
    async delete(id) {
        const confirmar = confirm(`Confirmar exclus??o do personagem de id ${id}?`);
        if (confirmar) {
            await fetch(`${PersonagemController.getUrl()}/${id}`, {
                method: Method.DELETE,
            })
                .then((response) => {
                alert(`Personagem foi removido com sucesso`);
                this.findAll();
            })
                .catch((error) => alert(`Problema na remo????o: ${error}`));
        }
    }
    static formatarNomeArma(arma) {
        return arma.replace("LANCA", "LAN??A").replace("_", " ");
    }
    static removerAspas(texto) {
        return texto.replace(/['"]+/g, "");
    }
    static getUrl() {
        return "https://trabalho-genshin.herokuapp.com/personagens";
    }
    static criarLinhasTabela(personagem) {
        return `
                <tr>
                    <td class="text-center"> ${personagem.id} </td> 
                    <td class="text-center"> ${personagem.nome} </td> 
                    <td class="text-center"> ${personagem.tipoElemental} </td>
                    <td class="text-center"> ${personagem.poder} </td>
                    <td class="text-center"> ${PersonagemController.formatarNomeArma(personagem.arma)} </td>
                    <td class="text-center"> ${personagem.nota} </td> 
                    <td class="text-center"> 
                        <i role="button" .botao-atualizar class='bi bi-pencil text-warning me-3'></i>
                        <i role="button" class='bi bi-trash text-danger botao-excluir'></i> 
                    </td> 
                </tr>
            `;
    }
    preencherCampos() {
        this._urlArmas = "https://trabalho-genshin.herokuapp.com/tipo-armas";
        this._urlTiposElementais = "https://trabalho-genshin.herokuapp.com/tipo-elemental";
        this._idInput = document.getElementById("id");
        this._nomeInput = document.getElementById("nome");
        this._notaInput = document.getElementById("nota");
        this._poderInput = document.getElementById("poder");
        this._armasSelect = document.getElementById("armas");
        this._tiposElementaisSelect = document.getElementById("tipoElemental");
        this._corpoTabela = document.getElementById("conteudoTabela");
        this._pageSize = document.getElementById("pageSize");
        this._filterInput = document.getElementById("filter");
        this._paginacao = document.getElementById("pagination");
    }
    criarOptions() {
        fetch(this._urlArmas)
            .then((response) => response.json())
            .then((armas) => {
            armas
                .forEach((arma) => {
                this._armasSelect.options[this._armasSelect.options.length] = new Option(PersonagemController.removerAspas(PersonagemController.formatarNomeArma(arma)), arma);
            });
        })
            .catch((error) => alert(error));
        fetch(this._urlTiposElementais)
            .then((response) => response.json())
            .then((tiposElementais) => {
            tiposElementais
                .forEach((tipoElemental) => {
                this._tiposElementaisSelect.options[this._tiposElementaisSelect.options.length] = new Option(PersonagemController.removerAspas(tipoElemental), tipoElemental);
            });
        })
            .catch((error) => alert(error));
    }
    limparCampos() {
        this._idInput.value = "";
        this._nomeInput.value = "";
        this._notaInput.value = "";
        this._poderInput.value = "";
        this._armasSelect.selectedIndex = 0;
        this._tiposElementaisSelect.selectedIndex = 0;
    }
    filtrarTabela() {
        this._filterInput.addEventListener("keyup", async (event) => {
            event.preventDefault();
            if (!this._filterInput.value) {
                this.findAll();
            }
            else {
                const personagens = await this.findPersonagens(0, Number(this._pageSize.value), this._filterInput.value);
                this.criarPaginacao(personagens);
                this.paginacaoController(personagens);
            }
        });
    }
    adicionarEventos() {
        this._pageSize.addEventListener("change", (event) => {
            event.preventDefault();
            this.findAll(0, Number(this._pageSize.value));
        });
        const table = document.querySelectorAll("#conteudoTabela > tr");
        table
            .forEach((tr) => {
            const tdId = tr.querySelector("td:nth-child(1)");
            const tdNome = tr.querySelector("td:nth-child(2)");
            const tdTipoElemental = tr.querySelector("td:nth-child(3)");
            const tdPoder = tr.querySelector("td:nth-child(4)");
            const tdArma = tr.querySelector("td:nth-child(5)");
            const tdNota = tr.querySelector("td:nth-child(6)");
            const buttonUpdate = tr.querySelector("td:nth-child(7) > i:nth-child(1)");
            const buttonDelete = tr.querySelector("td:nth-child(7) > i:nth-child(2)");
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
    criarPaginacao(personagens) {
        const botaoAnterior = `<li class="page-item"><button class="page-link controlador">Anterior</button></li>`;
        const botaoProximo = `<li class="page-item"><button class="page-link controlador">Pr??ximo</button></li>`;
        let botaoPageNumber = '';
        for (let i = 0; i < personagens.totalPages; i++) {
            botaoPageNumber += `<li class="page-item"><button class="page-link number">${i + 1}</button></li>`;
        }
        this._paginacao.innerHTML = botaoAnterior + botaoPageNumber + botaoProximo;
    }
    paginacaoController(personagens) {
        const botoesNumber = document.querySelectorAll("#pagination > li > button.number");
        const botoesPaginacao = document.querySelectorAll("#pagination > li > button.controlador");
        botoesNumber[0].classList.toggle("active");
        botoesPaginacao[0].classList.toggle("disabled");
        if (botoesNumber.length < 2) {
            botoesPaginacao[1].classList.add("disabled");
        }
        botoesPaginacao.forEach((botaoPaginacao) => {
            botaoPaginacao.addEventListener("click", async (event) => {
                event.preventDefault();
                let pageNumber;
                switch (botaoPaginacao.innerText) {
                    case "Anterior":
                        pageNumber = --personagens.number;
                        personagens = await this.findPersonagens(pageNumber, Number(this._pageSize.value));
                        botoesNumber[pageNumber].classList.add("active");
                        botoesNumber[++pageNumber].classList.remove("active");
                        break;
                    case "Pr??ximo":
                        pageNumber = ++personagens.number;
                        personagens = await this.findPersonagens(pageNumber, Number(this._pageSize.value));
                        botoesNumber[pageNumber].classList.add("active");
                        botoesNumber[--pageNumber].classList.remove("active");
                        break;
                }
                if (botoesNumber[0].classList.contains("active")) {
                    this.desativarBotaoAnterior(botoesPaginacao);
                    this.ativarBotaoProximo(botoesPaginacao);
                }
                else if (Number(botoesNumber[personagens.number].innerText) === personagens.totalPages) {
                    this.desativarBotaoProximo(botoesPaginacao);
                    this.ativarBotaoAnterior(botoesPaginacao);
                }
                else {
                    this.ativarBotaoAnterior(botoesPaginacao);
                    this.ativarBotaoProximo(botoesPaginacao);
                }
                this.preencherTabela(personagens);
            });
        });
        botoesNumber.forEach((botaoNumber) => {
            botaoNumber.addEventListener("click", async (event) => {
                event.preventDefault();
                botoesNumber.forEach((botao) => botao.classList.remove("active"));
                botaoNumber.classList.add("active");
                if (botaoNumber.innerText === "1") {
                    this.desativarBotaoAnterior(botoesPaginacao);
                    this.ativarBotaoProximo(botoesPaginacao);
                }
                else if (Number(botaoNumber.innerText) === (personagens.totalPages)) {
                    this.desativarBotaoProximo(botoesPaginacao);
                    this.ativarBotaoAnterior(botoesPaginacao);
                }
                else {
                    this.ativarBotaoAnterior(botoesPaginacao);
                    this.ativarBotaoProximo(botoesPaginacao);
                }
                personagens = await this.findPersonagens(Number(botaoNumber.innerText) - 1);
                this.preencherTabela(personagens);
            });
        });
        this.preencherTabela(personagens);
    }
    preencherTabela(personagens) {
        let response = '';
        personagens
            .content
            .map((personagem) => response += PersonagemController.criarLinhasTabela(personagem));
        this._corpoTabela.innerHTML = response;
        this.adicionarEventos();
    }
    ativarBotaoAnterior(botoesPaginacao) {
        botoesPaginacao[0].classList.remove("disabled");
    }
    desativarBotaoAnterior(botoesPaginacao) {
        botoesPaginacao[0].classList.add("disabled");
    }
    ativarBotaoProximo(botoesPaginacao) {
        botoesPaginacao[1].classList.remove("disabled");
    }
    desativarBotaoProximo(botoesPaginacao) {
        botoesPaginacao[1].classList.add("disabled");
    }
}
//# sourceMappingURL=PersonagemController.js.map