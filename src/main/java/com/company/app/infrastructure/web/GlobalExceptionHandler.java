package com.company.app.infrastructure.web;

import com.company.app.domain.customer.CustomerAlreadyExistsException;
import com.company.app.domain.customer.CustomerNotFoundException;
import com.company.app.domain.user.UserAlreadyExistsException;
import com.company.app.domain.user.UserNotFoundException;
import com.company.app.infrastructure.web.dto.Error;
import com.company.app.infrastructure.web.dto.ValidationError;
import com.company.app.infrastructure.web.dto.ValidationErrorFieldErrorsInner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

/**
 * Global exception handler for the REST API
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler({UserNotFoundException.class, CustomerNotFoundException.class})
    public ResponseEntity<Error> handleNotFound(RuntimeException ex, WebRequest request) {
        logger.warn("Resource not found: {}", ex.getMessage());
        
        Error error = new Error();
        error.setMessage(ex.getMessage());
        error.setCode("NOT_FOUND");
        error.setTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        error.setPath(getRequestPath(request));
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler({UserAlreadyExistsException.class, CustomerAlreadyExistsException.class})
    public ResponseEntity<Error> handleAlreadyExists(RuntimeException ex, WebRequest request) {
        logger.warn("Resource already exists: {}", ex.getMessage());
        
        Error error = new Error();
        error.setMessage(ex.getMessage());
        error.setCode("CONFLICT");
        error.setTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        error.setPath(getRequestPath(request));
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationError> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        logger.warn("Validation error: {}", ex.getMessage());
        
        ValidationError error = new ValidationError();
        error.setMessage("Validation failed");
        error.setCode("VALIDATION_ERROR");
        error.setTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        error.setPath(getRequestPath(request));
        
        List<ValidationErrorFieldErrorsInner> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::toFieldError)
                .toList();
        error.setFieldErrors(fieldErrors);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Error> handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        logger.warn("Illegal argument: {}", ex.getMessage());
        
        Error error = new Error();
        error.setMessage(ex.getMessage());
        error.setCode("BAD_REQUEST");
        error.setTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        error.setPath(getRequestPath(request));
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Error> handleGenericException(Exception ex, WebRequest request) {
        logger.error("Unexpected error", ex);
        
        Error error = new Error();
        error.setMessage("An unexpected error occurred");
        error.setCode("INTERNAL_SERVER_ERROR");
        error.setTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        error.setPath(getRequestPath(request));
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    private ValidationErrorFieldErrorsInner toFieldError(FieldError fieldError) {
        ValidationErrorFieldErrorsInner error = new ValidationErrorFieldErrorsInner();
        error.setField(fieldError.getField());
        error.setMessage(fieldError.getDefaultMessage());
        return error;
    }
    
    private String getRequestPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }
}