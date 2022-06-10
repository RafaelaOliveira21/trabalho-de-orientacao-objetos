import { Method } from "../enums/Method.js";
import PagePersonagem from "../model/PagePersonagem.js";
import Personagem from "../model/Personagem.js";

export default class PersonagemController {
    private _url: string;
    private _urlArmas: string;
    private _urlTiposElementais: string;
    private _idInput: HTMLInputElement;
    private _nomeInput: HTMLInputElement;
    private _notaInput: HTMLInputElement;
    private _poderInput: HTMLInputElement;
    private _armasSelect: HTMLSelectElement;
    private _tiposElementaisSelect: HTMLSelectElement;
    private _corpoTabela: HTMLElement;
    private _paginacao: HTMLUListElement;
    private _pageSize: HTMLSelectElement;
    private _filterInput: HTMLInputElement;

    constructor() {
        this.preencherCampos();

        fetch(this._urlArmas)
            .then((response: Response): Promise<any> => response.json())
            .then((armas: Array<string>): void => {
                armas
                    .forEach((arma: string): void => {
                        this._armasSelect.options[this._armasSelect.options.length] = new Option(
                            PersonagemController.removerAspas(PersonagemController.formatarNomeArma(arma)),
                            arma
                        );
                    });
            })
            .catch((error: Error): void => alert(error));

        fetch(this._urlTiposElementais)
            .then((response: Response): Promise<any> => response.json())
            .then((tiposElementais: Array<string>): void => {
                tiposElementais
                    .forEach((tipoElemental: string): void => {
                        this._tiposElementaisSelect.options[this._tiposElementaisSelect.options.length] = new Option(
                            PersonagemController.removerAspas(tipoElemental),
                            tipoElemental
                        );
                    });
            })
            .catch((error: Error): void => alert(error));
    }

    public async findPersonagens(page?: number, pageSize?: number): Promise<PagePersonagem> {
        const size = Number(this._pageSize.options[this._pageSize.selectedIndex].value);

        return await fetch(`${PersonagemController.getUrl()}?page=${page ? page : 0}&size=${pageSize ? pageSize : size}&sort=id,asc`)
            .then((response: Response): Promise<any> => response.json())
            .catch((error) => alert("Erro: " + error));
    }

    public async findAll(page?: number, pageSize?: number): Promise<void> {
        const personagens: PagePersonagem = await this.findPersonagens(page, pageSize);
        this.criarPaginacao(personagens);
        this.paginacaoController(personagens);
        localStorage.setItem("personagens", JSON.stringify(personagens.content));
    }

    public async save(): Promise<void> {
        this.preencherCampos();
        const arma = PersonagemController.removerAspas(
            this._armasSelect.options[this._armasSelect.selectedIndex].value
        );
        const tipoElemental = PersonagemController.removerAspas(
            this._tiposElementaisSelect.options[this._tiposElementaisSelect.selectedIndex].value
        );
        let personagem: Personagem;

        const id: number | null = Number(this._idInput.value);
        const metodo = id ? Method.PUT : Method.POST;
        this._url = id ? `${PersonagemController.getUrl()}/${id}` : PersonagemController.getUrl();
        personagem = new Personagem(
            id,
            this._nomeInput.value,
            tipoElemental,
            arma,
            this._poderInput.value,
            Number(this._notaInput.value)
        );

        await fetch(this._url, {
            method: metodo,
            body: Personagem.fromJson(personagem),
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        })
            .then((response: Response): void => {
                switch (response.status) {
                    case 200:
                        alert("Atualização realizada com sucesso!");
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
            .catch((error: Error): void => {
                alert(error);
            });
    }

    public update(
        id: string,
        nome: string,
        tipoElemental: string,
        poder: string,
        arma: string,
        nota: string
    ): void {
        this._idInput.value = id.toString();
        this._nomeInput.value = nome.toString();
        this._poderInput.value = poder.toString();
        this._notaInput.value = nota.toString();

        const armasList: NodeListOf<HTMLOptionElement> = document.querySelectorAll("#armas > option");
        armasList
            .forEach((armaAtual, index) => {
                if (armaAtual.innerText == arma) {
                    this._armasSelect.selectedIndex = index;
                }
            });

        const tiposElementais: NodeListOf<HTMLOptionElement> = this._tiposElementaisSelect.querySelectorAll("option");
        tiposElementais
            .forEach((tipoElementalAtual, index): void => {
                if (tipoElementalAtual.innerText === tipoElemental) {
                    this._tiposElementaisSelect.selectedIndex = index;
                }
            });
    }

    public async delete(id: number): Promise<void> {
        const confirmar: boolean = confirm(
            `Confirmar exclusão do personagem de id ${id}?`
        );

        if (confirmar) {
            await fetch(`${PersonagemController.getUrl()}/${id}`, {
                method: Method.DELETE,
            })
                .then((response: Response): void => {
                    alert(`Personagem foi removido com sucesso`);
                    this.findAll();
                })
                .catch((error: Error): void =>
                    alert(`Problema na remoção: ${error}`)
                );
        }
    }

    private static formatarNomeArma(arma: string): string {
        return arma.replace("LANCA", "LANÇA").replace("_", " ");
    }

    private static removerAspas(texto: string): string {
        return texto.replace(/['"]+/g, "");
    }

    private static getUrl(): string {
        return "https://trabalho-genshin.herokuapp.com/personagens";
    }

    private static criarLinhasTabela(personagem: Personagem): string {
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

    private preencherCampos(): void {
        this._urlArmas = "https://trabalho-genshin.herokuapp.com/tipo-armas";
        this._urlTiposElementais = "https://trabalho-genshin.herokuapp.com/tipo-elemental";
        this._idInput = <HTMLInputElement>document.getElementById("id");
        this._nomeInput = <HTMLInputElement>document.getElementById("nome");
        this._notaInput = <HTMLInputElement>document.getElementById("nota");
        this._poderInput = <HTMLInputElement>document.getElementById("poder");
        this._armasSelect = <HTMLSelectElement>document.getElementById("armas");
        this._tiposElementaisSelect = <HTMLSelectElement>document.getElementById("tipoElemental");
        this._corpoTabela = <HTMLElement>document.getElementById("conteudoTabela");
        this._pageSize = <HTMLSelectElement>document.getElementById("pageSize");
        this._pageSize.selectedIndex = 1;
        this._filterInput = <HTMLInputElement>document.getElementById("filter");
        this._paginacao = <HTMLUListElement>document.getElementById("pagination");
    }

    public limparCampos(): void {
        this._idInput.value = "";
        this._nomeInput.value = "";
        this._notaInput.value = "";
        this._poderInput.value = "";
        this._armasSelect.selectedIndex = 0;
        this._tiposElementaisSelect.selectedIndex = 0;
    }

    public filtrarTabela(): void {
        this._filterInput.addEventListener("keyup", (event: Event): void => {
            event.preventDefault();

            let response = '';
            JSON.parse(<string>localStorage.getItem("personagens"))
                .filter((personagem: Personagem): boolean => PersonagemController.filter(personagem, this._filterInput.value))
                .map((personagem: Personagem): string => response += PersonagemController.criarLinhasTabela(personagem));

            this._corpoTabela.innerHTML = response;
        });

        this._filterInput.addEventListener("blur", (event: Event): void => {
            if (!this._filterInput.value) {
                this.findAll();
            }
        });
    }

    private adicionarEventos(): void {
        this._pageSize.addEventListener("change", (event: Event): void => {
            event.preventDefault();
            this.findAll(0, Number(this._pageSize.value));
        });

        const table: NodeListOf<HTMLTableRowElement> = <NodeListOf<HTMLTableRowElement>>document.querySelectorAll("#conteudoTabela > tr");

        table
            .forEach((tr: HTMLTableRowElement): void => {
                const tdId: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(1)");
                const tdNome: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(2)");
                const tdTipoElemental: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(3)");
                const tdPoder: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(4)");
                const tdArma: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(5)");
                const tdNota: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(6)");
                const buttonUpdate: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(7) > i:nth-child(1)");
                const buttonDelete: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(7) > i:nth-child(2)");

                buttonDelete.addEventListener("click", (event: Event) => {
                    event.preventDefault();
                    this.delete(Number(tdId.innerText));
                });

                buttonUpdate.addEventListener("click", (event: Event) => {
                    event.preventDefault();
                    this.update(
                        tdId.innerText,
                        tdNome.innerText,
                        tdTipoElemental.innerText,
                        tdPoder.innerText,
                        tdArma.innerText,
                        tdNota.innerText
                    );
                });
            });
    }

    private static filter(personagem: Personagem, valor: string): boolean {
        return personagem.id === Number(valor)
            || personagem.arma.toLowerCase().includes(valor)
            || personagem.nome.toLowerCase().includes(valor)
            || personagem.tipoElemental.toLowerCase().includes(valor)
            || personagem.poder.toLowerCase().includes(valor)
            || personagem.nota === Number(valor);
    }

    private criarPaginacao(personagens: PagePersonagem): void {
        const botaoAnterior: string = `<li class="page-item"><button class="page-link controlador">Anterior</button></li>`;
        const botaoProximo: string = `<li class="page-item"><button class="page-link controlador">Próximo</button></li>`;
        let botaoPageNumber: string = '';

        for (let i: number = 0; i < personagens.totalPages; i++) {
            botaoPageNumber += `<li class="page-item"><button class="page-link number">${i + 1}</button></li>`;
        }

        this._paginacao.innerHTML = botaoAnterior + botaoPageNumber + botaoProximo;
    }

    private paginacaoController(personagens: PagePersonagem): void {
        // TODO: Melhorar o código, a lógica já está funcionando.
        const botoesNumber: NodeListOf<HTMLButtonElement> =
            <NodeListOf<HTMLButtonElement>>document.querySelectorAll("#pagination > li > button.number");
        const botoesPaginacao: NodeListOf<HTMLButtonElement> =
            <NodeListOf<HTMLButtonElement>>document.querySelectorAll("#pagination > li > button.controlador");

        botoesNumber[0].classList.toggle("active");
        botoesPaginacao[0].classList.toggle("disabled");
        if(botoesNumber.length < 2) {
            botoesPaginacao[1].classList.add("disabled");
        }

        botoesPaginacao.forEach((botaoPaginacao: HTMLButtonElement): void => {
            botaoPaginacao.addEventListener("click", async (event: Event): Promise<void> => {
                event.preventDefault();

                let pageNumber: number;
                if (botaoPaginacao.innerText == "Anterior") {
                    pageNumber = --personagens.number;
                    personagens = await this.findPersonagens(pageNumber, Number(this._pageSize.value));
                    botoesNumber[pageNumber].classList.add("active");
                    botoesNumber[++pageNumber].classList.remove("active");
                } else if (botaoPaginacao.innerText == "Próximo") {
                    pageNumber = ++personagens.number;
                    personagens = await this.findPersonagens(pageNumber, Number(this._pageSize.value));
                    botoesNumber[pageNumber].classList.add("active");
                    botoesNumber[--pageNumber].classList.remove("active");
                }

                if (botoesNumber[0].classList.contains("active")) {
                    botoesPaginacao[0].classList.add("disabled");

                    if (botoesNumber.length === 2) {
                        botoesPaginacao[1].classList.remove("disabled");
                    }

                } else if (Number(botoesNumber[personagens.number].innerText) === personagens.totalPages) {
                    botoesPaginacao[1].classList.add("disabled");

                    if (botoesNumber.length === 2) {
                        botoesPaginacao[0].classList.remove("disabled");
                    }

                } else {
                    botoesPaginacao[0].classList.remove("disabled");
                    botoesPaginacao[1].classList.remove("disabled");
                }

                this.preencherTabela(personagens);
            });
        });


        botoesNumber.forEach((botaoNumber: HTMLButtonElement): void => {
            botaoNumber.addEventListener("click", async (event: Event): Promise<void> => {
                event.preventDefault();
                botoesNumber.forEach((botao: HTMLButtonElement): void => botao.classList.remove("active"));
                botaoNumber.classList.add("active");

                if (botaoNumber.innerText === "1") {
                    botoesPaginacao[0].classList.add("disabled");

                    if (botoesNumber.length === 2) {
                        botoesPaginacao[1].classList.remove("disabled");
                    }

                } else if (Number(botaoNumber.innerText) === (personagens.totalPages)) {
                    botoesPaginacao[1].classList.add("disabled");

                    if (botoesNumber.length === 2) {
                        botoesPaginacao[0].classList.remove("disabled");
                    }

                } else {
                    botoesPaginacao[0].classList.remove("disabled");
                    botoesPaginacao[1].classList.remove("disabled");
                }

                personagens = await this.findPersonagens(Number(botaoNumber.innerText) - 1);

                this.preencherTabela(personagens);

            });
        });

        this.preencherTabela(personagens);
    }

    private preencherTabela(personagens: PagePersonagem): void {
        let response = '';
        personagens
            .content
            .map((personagem: Personagem): string => response += PersonagemController.criarLinhasTabela(personagem));
        this._corpoTabela.innerHTML = response;
        this.adicionarEventos();
    }
}
