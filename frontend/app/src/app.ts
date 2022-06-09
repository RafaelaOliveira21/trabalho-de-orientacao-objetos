import PersonagemController from "./controller/PersonagemController.js";

const personagemControlle: PersonagemController = new PersonagemController();

window.addEventListener(
    "load",
    (event) => {
        event.preventDefault();
        personagemControlle.findAll();
      const teste =  personagemControlle.findPersonagens();
      teste.then(data => console.log(data.content));
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

// ---------------------------------------
// function populateList() {
//     console.log('rodando a função')
// }

// populateList();

const state = {
    page: 1,
    perPage: 5,
    totalPages: 5
}

const controls = {
    next() {
        state.page++;

        // if()
    },
    prev() {

    },
    goTo() {

    }
}