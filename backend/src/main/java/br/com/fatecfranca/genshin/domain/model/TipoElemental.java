package br.com.fatecfranca.genshin.domain.model;

import lombok.Getter;

import java.util.List;

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

    public static List<TipoElemental> getAll() {
        return List.of(TipoElemental.values());
    }

}
