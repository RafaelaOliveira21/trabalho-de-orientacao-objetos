package br.com.fatecfranca.genshin.api.controller;

import br.com.fatecfranca.genshin.api.dto.PersonagemDto;
import br.com.fatecfranca.genshin.domain.model.Personagem;
import br.com.fatecfranca.genshin.domain.service.PersonagemService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/personagens")
public class PersonagemController {

    @Autowired
    private PersonagemService personagemService;

    @GetMapping
    public ResponseEntity<List<PersonagemDto>> findAll() {
        return ResponseEntity.ok(personagemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonagemDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(personagemService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PersonagemDto> save(@RequestBody Personagem personagem) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(personagemService.save(personagem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonagemDto> update(@PathVariable Long id, @RequestBody Personagem personagem) {
        Personagem personagemAtual = personagemService.findOrThrowException(id);

        BeanUtils.copyProperties(personagem, personagemAtual, "id");

        return ResponseEntity.ok(personagemService.save(personagemAtual));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        personagemService.delete(id);
    }

}
