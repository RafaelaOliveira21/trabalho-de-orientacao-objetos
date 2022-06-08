package br.com.fatecfranca.genshin.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Personagem {

    @Id
    @NotNull
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoElemental tipoElemental;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoArma arma;

    @NotBlank
    private String poder;

    @NotBlank
    private String nota;

}
