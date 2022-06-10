import PersonagemController from "./controller/PersonagemController.js";
const personagemControlle = new PersonagemController();
window.addEventListener("load", (event) => {
    event.preventDefault();
    personagemControlle.findAll();
    personagemControlle.filtrarTabela();
}, false);
const buttonCadastrar = (document.getElementById("cadastrar"));
const buttonAtualizar = (document.getElementById("limpar"));
buttonCadastrar.addEventListener("click", (event) => {
    event.preventDefault();
    personagemControlle.save();
});
buttonAtualizar.addEventListener("click", (event) => {
    event.preventDefault();
    personagemControlle.limparCampos();
});
const state = {
    page: 1,
    perPage: 5,
    totalPages: 5
};
const controls = {
    next() {
        state.page++;
    },
    prev() {
    },
    goTo() {
    }
};
//# sourceMappingURL=app.js.map