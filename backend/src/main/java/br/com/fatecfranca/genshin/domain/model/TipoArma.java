package br.com.fatecfranca.genshin.domain.model;

import lombok.Getter;

@Getter
public enum TipoArma {

    ESPADA("Espada"),
    ESPADA_PESADA("Espada Pesada"),
    ARCO("Arco"),
    LANCA("Lança"),
    CATALISADOR("Catalisador/Livro");

    TipoArma(String descricao) {
    }

}
