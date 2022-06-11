package br.com.fatecfranca.genshin.api.dto;

import br.com.fatecfranca.genshin.domain.model.Personagem;
import br.com.fatecfranca.genshin.domain.model.TipoArma;
import br.com.fatecfranca.genshin.domain.model.TipoElemental;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonagemDto {

    private Long id;
    private String nome;
    private TipoElemental tipoElemental;
    private TipoArma arma;
    private String poder;
    private BigDecimal nota;

    public static PersonagemDto of(Personagem personagem) {
        return PersonagemDto
                .builder()
                .id(personagem.getId())
                .nome(personagem.getNome())
                .tipoElemental(personagem.getTipoElemental())
                .arma(personagem.getArma())
                .poder(personagem.getPoder())
                .nota(personagem.getNota())
                .build();
    }

    public static boolean filter(PersonagemDto personagem, String filtro) {
        return String
                .valueOf(personagem.id)
                .toUpperCase()
                .contains(filtro)
                || String
                .valueOf(personagem.arma)
                .replace("LANCA", "LANÇA")
                .toUpperCase()
                .contains(filtro)
                || personagem.nome
                .toUpperCase()
                .contains(filtro)
                || String
                .valueOf(personagem.tipoElemental)
                .replace("_", " ")
                .toUpperCase()
                .contains(filtro)
                || personagem.poder
                .toUpperCase()
                .contains(filtro)
                || String
                .valueOf(personagem.nota).toUpperCase().contains(filtro);
    }

}
