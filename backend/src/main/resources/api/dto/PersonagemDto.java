package br.com.fatecfranca.genshin.api.dto;

import br.com.fatecfranca.genshin.domain.model.Personagem;
import br.com.fatecfranca.genshin.domain.model.TipoArma;
import br.com.fatecfranca.genshin.domain.model.TipoElemental;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String nota;

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

}
