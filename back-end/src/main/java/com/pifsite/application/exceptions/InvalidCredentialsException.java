package com.pifsite.application.exceptions;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String mensagem) {
        super(mensagem);
    }
    
}
