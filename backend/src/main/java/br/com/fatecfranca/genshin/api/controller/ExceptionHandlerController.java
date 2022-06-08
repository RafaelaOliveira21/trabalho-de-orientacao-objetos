package br.com.fatecfranca.genshin.api.controller;

import br.com.fatecfranca.genshin.api.exception.Message;
import br.com.fatecfranca.genshin.api.exception.MessageType;
import br.com.fatecfranca.genshin.domain.exception.PersonagemInexistenteException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.OffsetDateTime;

@Slf4j
@RestControllerAdvice
public class ExceptionHandlerController extends ResponseEntityExceptionHandler {

    public static final String MSG_ERRO_GENERICA_USUARIO_FINAL = "Ocorreu um erro interno inesperado no sistema. " +
            "Tente novamente e se o problema persistir, entre em contato com o administrador do sistema.";

    @ExceptionHandler(PersonagemInexistenteException.class)
    public ResponseEntity<?> handleEntidadeNaoEncontrado(PersonagemInexistenteException ex, WebRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        MessageType messageType = MessageType.RECURSO_NAO_ENCONTRADO;
        String detail = ex.getMessage();

        Message problem = createProblemBuilder(status, messageType, detail)
                .userMessage(detail)
                .build();

        return handleExceptionInternal(ex, problem, new HttpHeaders(), status, request);
    }

    @ExceptionHandler(Exception.class)
    private ResponseEntity<?> handleUncaught(Exception ex, WebRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        MessageType messageType = MessageType.ERRO_DE_SISTEMA;
        String detail = MSG_ERRO_GENERICA_USUARIO_FINAL;

        log.error(ex.getMessage(), ex);

        Message message = createProblemBuilder(status, messageType, detail)
                .userMessage(detail)
                .build();

        return handleExceptionInternal(ex, message, new HttpHeaders(), status, request);

    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers,
                                                                   HttpStatus status, WebRequest request) {

        MessageType messageType = MessageType.RECURSO_NAO_ENCONTRADO;
        String detail = String.format("O recurso '%s', que você tentou acessar, é inexistente.", ex.getRequestURL());

        Message message = createProblemBuilder(status, messageType, detail)
                .userMessage(MSG_ERRO_GENERICA_USUARIO_FINAL)
                .build();

        return handleExceptionInternal(ex, message, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
                                                             HttpStatus status, WebRequest request) {

        if (body == null) {
            body = Message
                    .builder()
                    .timestamp(OffsetDateTime.now())
                    .title(status.getReasonPhrase())
                    .status(status.value())
                    .userMessage(MSG_ERRO_GENERICA_USUARIO_FINAL)
                    .build();
        } else if (body instanceof String) {
            body = Message
                    .builder()
                    .timestamp(OffsetDateTime.now())
                    .title((String) body)
                    .status(status.value())
                    .userMessage(MSG_ERRO_GENERICA_USUARIO_FINAL)
                    .build();
        }

        return super.handleExceptionInternal(ex, body, headers, status, request);
    }


    private Message.MessageBuilder createProblemBuilder(HttpStatus status, MessageType messageType, String detail) {
        return Message
                .builder()
                .timestamp(OffsetDateTime.now())
                .status(status.value())
                .type(messageType.getUri())
                .title(messageType.getTitle())
                .detail(detail);
    }

}
