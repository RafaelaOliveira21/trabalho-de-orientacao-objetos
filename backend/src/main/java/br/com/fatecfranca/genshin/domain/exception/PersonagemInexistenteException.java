package br.com.fatecfranca.genshin.domain.exception;

public class PersonagemInexistenteException extends RuntimeException {

    public PersonagemInexistenteException(String mensagem) {
        super(mensagem);
    }

    public PersonagemInexistenteException(Long id) {
        this(String.format("Não existe um personagem com o id %d", id));
    }

}
