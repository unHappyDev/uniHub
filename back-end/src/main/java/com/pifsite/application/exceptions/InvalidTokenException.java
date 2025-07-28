package com.pifsite.application.exceptions;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String mensagem) {
        super(mensagem);
    }
    
}
