package br.com.fatecfranca.genshin.api.controller;

import br.com.fatecfranca.genshin.domain.model.TipoElemental;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tipo-elemental")
public class TipoElementalController {

    @GetMapping
    public List<TipoElemental> findAll() {
        return TipoElemental.getAll();
    }
}
