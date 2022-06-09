import PersonagemController from "./controller/PersonagemController.js";
const personagemControlle = new PersonagemController();
window.addEventListener("load", (event) => {
    event.preventDefault();
    personagemControlle.findAll();
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
//# sourceMappingURL=app.js.map