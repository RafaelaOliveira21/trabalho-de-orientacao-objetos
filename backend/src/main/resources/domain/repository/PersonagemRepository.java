package br.com.fatecfranca.genshin.domain.repository;

import br.com.fatecfranca.genshin.domain.model.Personagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonagemRepository extends JpaRepository<Personagem, Long> {

}
