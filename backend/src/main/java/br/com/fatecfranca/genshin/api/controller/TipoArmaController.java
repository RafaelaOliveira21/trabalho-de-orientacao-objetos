package br.com.fatecfranca.genshin.api.controller;

import br.com.fatecfranca.genshin.domain.model.TipoArma;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tipo-armas")
public class TipoArmaController {

    @GetMapping
    public List<TipoArma> findAll() {
        return TipoArma.getAll();
    }

}
