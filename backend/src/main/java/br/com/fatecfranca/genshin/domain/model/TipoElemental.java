package br.com.fatecfranca.genshin.domain.model;

import lombok.Getter;

@Getter
public enum TipoElemental {

    ANEMO("Vento"),
    GEO("Pedra"),
    ELECTRO("Relâmpago"),
    DENDRO("Natureza"),
    HYDRO("Água"),
    PYRO("Fogo"),
    CRYO("Gelo");

    TipoElemental(String descricao) {
    }

}
