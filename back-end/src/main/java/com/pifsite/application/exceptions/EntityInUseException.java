package com.pifsite.application.exceptions;

public class EntityInUseException extends RuntimeException {

    public EntityInUseException(String mensagem) {
        super(mensagem);
    }
    
}
