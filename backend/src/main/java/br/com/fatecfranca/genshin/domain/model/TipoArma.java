package br.com.fatecfranca.genshin.domain.model;

import lombok.Getter;

import java.util.List;

@Getter
public enum TipoArma {

    ESPADA("Espada"),
    ESPADA_PESADA("Espada Pesada"),
    ARCO("Arco"),
    LANCA("Lança"),
    CATALISADOR("Catalisador/Livro");

    TipoArma(String descricao) {
    }

    public static List<TipoArma> getAll() {
        return List.of(TipoArma.values());
    }

}
