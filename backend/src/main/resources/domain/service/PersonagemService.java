package br.com.fatecfranca.genshin.domain.service;

import br.com.fatecfranca.genshin.api.dto.PersonagemDto;
import br.com.fatecfranca.genshin.domain.model.Personagem;
import br.com.fatecfranca.genshin.domain.repository.PersonagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PersonagemService {

    @Autowired
    private PersonagemRepository personagemRepository;

    public Page<PersonagemDto> findAll(Pageable page) {
        return personagemRepository.findAll(page)
                .map(PersonagemDto::of);
    }

    public PersonagemDto findById(Long id) {
        return PersonagemDto.of(findOrThrowException(id));
    }

    public PersonagemDto save(Personagem personagem) {
        return PersonagemDto.of(personagemRepository.save(personagem));
    }

    public Personagem findOrThrowException(Long id) {
        return personagemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format("Não existe um personagem com o id %d", id)));
    }

}
