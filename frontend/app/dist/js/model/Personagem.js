export default class Personagem {
    _id;
    _nome;
    _tipoElemental;
    _arma;
    _poder;
    _nota;
    constructor(_id, _nome, _tipoElemental, _arma, _poder, _nota) {
        this._id = _id;
        this._nome = _nome;
        this._tipoElemental = _tipoElemental;
        this._arma = _arma;
        this._poder = _poder;
        this._nota = _nota;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get nome() {
        return this._nome;
    }
    set nome(nome) {
        this._nome = nome;
    }
    get tipoElemental() {
        return this._tipoElemental;
    }
    set tipoElemental(tipoElemental) {
        this._tipoElemental = tipoElemental;
    }
    get arma() {
        return this._arma;
    }
    set arma(arma) {
        this._arma = arma;
    }
    get poder() {
        return this._poder;
    }
    set poder(poder) {
        this._poder = poder;
    }
    get nota() {
        return this._nota;
    }
    set nota(nota) {
        this._nota = nota;
    }
    static fromJson(personagem) {
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
//# sourceMappingURL=Personagem.js.map