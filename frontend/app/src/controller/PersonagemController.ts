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

    constructor() {
        this.preencherCampos();

        fetch(this._urlArmas)
            .then((response: Response): Promise<any> => response.json())
            .then((armas: Array<string>): void => {
                armas
                    .forEach((arma: string): void => {
                        const option: HTMLOptionElement = new Option(
                            this.removerAspas(this.formatarNomeArma(arma)),
                            arma
                        );

                        this._armasSelect.options[this._armasSelect.options.length] = option;
                    });
            })
            .catch((error: Error): void => alert(error));

        fetch(this._urlTiposElementais)
            .then((response: Response): Promise<any> => response.json())
            .then((tiposElementais: Array<string>): void => {
                tiposElementais
                    .forEach((tipoElemental: string): void => {
                        const option: HTMLOptionElement = new Option(
                            this.removerAspas(tipoElemental),
                            tipoElemental
                        );

                        this._tiposElementaisSelect.options[this._tiposElementaisSelect.options.length] = option;
                    });
            })
            .catch((error: Error): void => alert(error));
    }

    public async findPersonagens(): Promise<PagePersonagem> {
        return await fetch(`${this._url}?page=0&size=10&sort=id,asc`)
            .then((response: Response): Promise<any> => response.json())
            .catch((error) => alert(error));
    }

    public async findAll(): Promise<void> {
        this.preencherCampos();

        const personagens: PagePersonagem = await this.findPersonagens();
        let response: string = "";
        personagens
            .content
            .map(
                (personagem: Personagem): string =>
                (response += `
                    <tr>
                        <td class="text-center"> ${personagem.id} </td> 
                        <td class="text-center"> ${personagem.nome} </td> 
                        <td class="text-center"> ${personagem.tipoElemental} </td>
                        <td class="text-center"> ${personagem.poder} </td>
                        <td class="text-center"> ${this.formatarNomeArma(personagem.arma)} </td>
                        <td class="text-center"> ${personagem.nota} </td> 
                        <td class="text-center"> <i role="button" .botao-atualizar class='bi bi-pencil text-warning'></i></td>
                        <td class="text-center"> <i role="button" class='bi bi-trash text-danger botao-excluir'></i> </td> 
                    </tr>`
                )
            );

        this._corpoTabela.innerHTML = response;
        this.adicionarEventos();
    }

    public async save(): Promise<void> {
        this.preencherCampos();
        const arma = this.removerAspas(
            this._armasSelect.options[this._armasSelect.selectedIndex].value
        );
        const tipoElemental = this.removerAspas(
            this._tiposElementaisSelect.options[this._tiposElementaisSelect.selectedIndex].value
        );
        let personagem: Personagem, metodo: string;

        if (this._idInput.value) {
            metodo = Method.PUT;
            this._url += `/${this._idInput.value}`;
            personagem = new Personagem(
                Number(this._idInput.value),
                this._nomeInput.value,
                tipoElemental,
                arma,
                this._poderInput.value,
                Number(this._notaInput.value)
            );
        } else {
            metodo = Method.POST;
            personagem = new Personagem(
                null,
                this._nomeInput.value,
                tipoElemental,
                arma,
                this._poderInput.value,
                Number(this._notaInput.value)
            );
        }

        await fetch(this._url, {
            method: metodo,
            body: Personagem.fromJson(personagem),
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        })
            .then((response: Response): void => {
                if (response.status == 200) {
                    alert("Atualização realizada com sucesso!");
                } else if (response.status == 201) {
                    alert("Cadastro realizado com sucesso!");
                } else if (response.status == 400) {
                    alert("Preencha todos os campos!");
                } else if (response.status == 500) {
                    alert("Erro no servidor!");
                }

                this.findAll();
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
            await fetch(`${this._url}/${id}`, {
                method: Method.DELETE,
            })
                .then((resposta: Response): void => {
                    alert(`Personagem foi removido com sucesso`);
                    this.findAll();
                })
                .catch((error: Error): void =>
                    alert(`Problema na remoção: ${error}`)
                );
        }
    }

    private formatarNomeArma(arma: string): string {
        return arma.replace("LANCA", "LANÇA").replace("_", " ");
    }

    private removerAspas(texto: string): string {
        return texto.replace(/['"]+/g, "");
    }

    private preencherCampos(): void {
        this._url = "https://trabalho-genshin.herokuapp.com/personagens";
        this._urlArmas = "https://trabalho-genshin.herokuapp.com/tipo-armas";
        this._urlTiposElementais = "https://trabalho-genshin.herokuapp.com/tipo-elemental";
        this._idInput = <HTMLInputElement>document.getElementById("id");
        this._nomeInput = <HTMLInputElement>document.getElementById("nome");
        this._notaInput = <HTMLInputElement>document.getElementById("nota");
        this._poderInput = <HTMLInputElement>document.getElementById("poder");
        this._armasSelect = <HTMLSelectElement>document.getElementById("armas");
        this._tiposElementaisSelect = <HTMLSelectElement>document.getElementById("tipoElemental");
        this._corpoTabela = <HTMLElement>document.getElementById("conteudoTabela");
    }

    public limparCampos(): void {
        this._idInput.value = "";
        this._nomeInput.value = "";
        this._notaInput.value = "";
        this._poderInput.value = "";
        this._armasSelect.selectedIndex = 0;
        this._tiposElementaisSelect.selectedIndex = 0;
    }

    private adicionarEventos(): void {
        const table: NodeListOf<HTMLTableRowElement> = <NodeListOf<HTMLTableRowElement>>document.querySelectorAll("#conteudoTabela > tr");

        table
            .forEach((tr, index) => {
                const tdId: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(1)");
                const tdNome: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(2)");
                const tdTipoElemental: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(3)");
                const tdPoder: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(4)");
                const tdArma: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(5)");
                const tdNota: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(6)");
                const buttonUpdate: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(7)");
                const buttonDelete: HTMLTableCellElement = <HTMLTableCellElement>tr.querySelector("td:nth-child(8)");

                buttonDelete.addEventListener("click", (event) => {
                    event.preventDefault();
                    this.delete(Number(tdId.innerText));
                });

                buttonUpdate.addEventListener("click", (event) => {
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
}
