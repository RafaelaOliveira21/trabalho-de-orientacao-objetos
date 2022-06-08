package br.com.fatecfranca.genshin.api.exception;

import lombok.Getter;

@Getter
public enum MessageType {

    RECURSO_NAO_ENCONTRADO("/recurso-nao-encontrado", "Recurso não encontrado"),
    ERRO_DE_SISTEMA("/erro-de-sistema", "Erro de sistema"),
    DADOS_INVALIDOS("/dados-invalidos", "Dados inválidos");

    private final String uri;
    private final String title;

    MessageType(String path, String title) {
        this.uri = path;
        this.title = title;
    }

}
