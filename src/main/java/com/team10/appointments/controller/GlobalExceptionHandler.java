package com.team10.appointments.controller;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Translates exceptions thrown by the service layer into appropriate HTTP responses
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Maps EntityNotFoundException (thrown when an id doesn't exist) to 404 Not Found
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(EntityNotFoundException ex) {
        return ex.getMessage();
    }
}
