package br.com.fatecfranca.genshin.domain.service;

import br.com.fatecfranca.genshin.api.dto.PersonagemDto;
import br.com.fatecfranca.genshin.domain.exception.PersonagemInexistenteException;
import br.com.fatecfranca.genshin.domain.model.Personagem;
import br.com.fatecfranca.genshin.domain.repository.PersonagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonagemService {

    @Autowired
    private PersonagemRepository personagemRepository;

    public Page<PersonagemDto> findAll(Pageable pageable) {
        return personagemRepository.findAll(pageable)
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
                .orElseThrow(() -> new PersonagemInexistenteException(id));
    }

    public void delete(Long id) {
        try {
            personagemRepository.deleteById(id);
        } catch (EmptyResultDataAccessException ex) {
            throw new PersonagemInexistenteException(id);
        }
    }

}
