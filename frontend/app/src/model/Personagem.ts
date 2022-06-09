export default class Personagem {
    constructor(
        private _id: number | null,
        private _nome: string,
        private _tipoElemental: string,
        private _arma: string,
        private _poder: string,
        private _nota: number
    ) {}

    get id(): number | null {
        return this._id;
    }

    set id(id: number | null) {
        this._id = id;
    }

    get nome(): string {
        return this._nome;
    }

    set nome(nome: string) {
        this._nome = nome;
    }

    get tipoElemental(): string {
        return this._tipoElemental;
    }

    set tipoElemental(tipoElemental: string) {
        this._tipoElemental = tipoElemental;
    }

    get arma(): string {
        return this._arma;
    }

    set arma(arma: string) {
        this._arma = arma;
    }

    get poder(): string {
        return this._poder;
    }

    set poder(poder: string) {
        this._poder = poder;
    }

    get nota(): number {
        return this._nota;
    }

    set nota(nota: number) {
        this._nota = nota;
    }

    public static fromJson(personagem: Personagem): string {
        return JSON.stringify({
            id: personagem.id,
            nome: personagem.nome,
            tipoElemental: personagem.tipoElemental,
            arma: personagem.arma,
            poder: personagem.poder,
            nota: personagem.nota,
        });
    }
}
