package com.pifsite.application.exceptions;

public class ExpiredTokenException extends RuntimeException {

    public ExpiredTokenException(String mensagem) {
        super(mensagem);
    }
    
}
