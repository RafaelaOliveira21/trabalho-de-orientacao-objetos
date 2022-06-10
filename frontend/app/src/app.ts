import PersonagemController from "./controller/PersonagemController.js";
import PagePersonagem from './model/PagePersonagem.js';
import Personagem from './model/Personagem';

const personagemControlle: PersonagemController = new PersonagemController();

window.addEventListener(
    "load",
    (event) => {
        event.preventDefault();
        personagemControlle.findAll();
        personagemControlle.filtrarTabela();
    },
    false
);

const buttonCadastrar: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("cadastrar")
);
const buttonAtualizar: HTMLButtonElement = <HTMLButtonElement>(
    document.getElementById("limpar")
);
buttonCadastrar.addEventListener("click", (event) => {
    event.preventDefault();
    personagemControlle.save();
});
buttonAtualizar.addEventListener("click", (event) => {
    event.preventDefault();
    personagemControlle.limparCampos();
});