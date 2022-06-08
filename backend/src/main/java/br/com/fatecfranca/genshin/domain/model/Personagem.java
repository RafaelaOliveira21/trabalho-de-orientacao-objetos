package br.com.fatecfranca.genshin.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Personagem {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O campo nome é obrigatório")
    private String nome;

    @NotNull(message = "O campo tipoElemental é obrigatório")
    @Enumerated(EnumType.STRING)
    private TipoElemental tipoElemental;

    @NotNull(message = "O campo arma é obrigatório")
    @Enumerated(EnumType.STRING)
    private TipoArma arma;

    @NotBlank(message = "O campo poder é obrigatório")
    private String poder;

    @NotNull(message = "O campo nota é obrigatório")
    private BigDecimal nota;

}
