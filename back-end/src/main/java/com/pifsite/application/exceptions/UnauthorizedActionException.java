package com.pifsite.application.exceptions;

public class UnauthorizedActionException extends RuntimeException {

    public UnauthorizedActionException(String mensagem) {
        super(mensagem);
    }
    
}
