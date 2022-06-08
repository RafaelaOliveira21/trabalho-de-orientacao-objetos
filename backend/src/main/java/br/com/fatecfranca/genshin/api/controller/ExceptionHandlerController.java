package br.com.fatecfranca.genshin.api.controller;

import br.com.fatecfranca.genshin.api.exception.Message;
import br.com.fatecfranca.genshin.api.exception.MessageType;
import br.com.fatecfranca.genshin.domain.exception.PersonagemInexistenteException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class ExceptionHandlerController extends ResponseEntityExceptionHandler {

    public static final String MSG_ERRO_GENERICA_USUARIO_FINAL = "Ocorreu um erro interno inesperado no sistema. " +
            "Tente novamente e se o problema persistir, entre em contato com o administrador do sistema.";

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,
                                                                  HttpStatus status, WebRequest request) {

        MessageType messageType = MessageType.DADOS_INVALIDOS;
        String detail = "Um ou mais campos estão inválidos. Faça o preenchimento correto e tente novamente.";

        BindingResult bindingResult = ex.getBindingResult();

        List<Message.Field> messageFields = bindingResult
                .getFieldErrors()
                .stream()
                .map(fieldError -> Message
                        .Field
                        .builder()
                        .name(fieldError.getField())
                        .message(fieldError.getDefaultMessage())
                        .build()
                )
                .collect(Collectors.toList());

        Message message = createMessage(status, messageType, detail)
                .fields(messageFields)
                .build();

        return handleExceptionInternal(ex, message, headers, status, request);
    }

    @ExceptionHandler(PersonagemInexistenteException.class)
    public ResponseEntity<?> handleEntidadeNaoEncontrado(PersonagemInexistenteException ex, WebRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        MessageType messageType = MessageType.RECURSO_NAO_ENCONTRADO;
        String detail = ex.getMessage();

        Message message = createProblemBuilder(status, messageType, detail)
                .message(detail)
                .build();

        return handleExceptionInternal(ex, message, new HttpHeaders(), status, request);
    }

    @ExceptionHandler(Exception.class)
    private ResponseEntity<?> handleUncaught(Exception ex, WebRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        MessageType messageType = MessageType.ERRO_DE_SISTEMA;
        String detail = MSG_ERRO_GENERICA_USUARIO_FINAL;

        log.error(ex.getMessage(), ex);

        Message message = createProblemBuilder(status, messageType, detail)
                .message(detail)
                .build();

        return handleExceptionInternal(ex, message, new HttpHeaders(), status, request);

    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers,
                                                                   HttpStatus status, WebRequest request) {

        MessageType messageType = MessageType.RECURSO_NAO_ENCONTRADO;
        String detail = String.format("O recurso '%s', que você tentou acessar, é inexistente.", ex.getRequestURL());

        Message message = createProblemBuilder(status, messageType, detail)
                .message(MSG_ERRO_GENERICA_USUARIO_FINAL)
                .build();

        return handleExceptionInternal(ex, message, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
                                                             HttpStatus status, WebRequest request) {

        if (body == null) {
            body = Message
                    .builder()
                    .timestamp(LocalDateTime.now())
                    .title(status.getReasonPhrase())
                    .status(status.value())
                    .message(MSG_ERRO_GENERICA_USUARIO_FINAL)
                    .build();
        } else if (body instanceof String) {
            body = Message
                    .builder()
                    .timestamp(LocalDateTime.now())
                    .title((String) body)
                    .status(status.value())
                    .message(MSG_ERRO_GENERICA_USUARIO_FINAL)
                    .build();
        }

        return super.handleExceptionInternal(ex, body, headers, status, request);
    }


    private Message.MessageBuilder createProblemBuilder(HttpStatus status, MessageType messageType, String detail) {
        return Message
                .builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .type(messageType.getUri())
                .title(messageType.getTitle());
    }

    private Message.MessageBuilder createMessage(HttpStatus status, MessageType messageType, String message) {
        return Message
                .builder()
                .message(message)
                .status(status.value())
                .type(messageType.getUri())
                .title(messageType.getTitle())
                .timestamp(LocalDateTime.now());
    }

}
