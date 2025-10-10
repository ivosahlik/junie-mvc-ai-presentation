package cz.ivosahlik.juniemvcaipresentation.controllers;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for consistent error responses across the API.
 * Uses RFC 7807 Problem Details format.
 */
@RestControllerAdvice
class GlobalExceptionHandler {

    /**
     * Handle resource not found exceptions.
     */
    @ExceptionHandler(RuntimeException.class)
    ProblemDetail handleResourceNotFound(RuntimeException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );

        addCommonProps(problemDetail, "Resource Not Found");
        return problemDetail;
    }

    /**
     * Handle validation errors from @Valid annotations.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            validationErrors.put(fieldName, errorMessage);
        });

        problemDetail.setProperty("validationErrors", validationErrors);
        addCommonProps(problemDetail, "Validation Error");
        return problemDetail;
    }

    /**
     * Handle constraint violation errors.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    ProblemDetail handleConstraintViolation(ConstraintViolationException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

        Map<String, String> validationErrors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            validationErrors.put(fieldName, errorMessage);
        });

        problemDetail.setProperty("validationErrors", validationErrors);
        addCommonProps(problemDetail, "Constraint Violation");
        return problemDetail;
    }

    /**
     * Handle optimistic locking failures.
     */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    ProblemDetail handleOptimisticLocking(OptimisticLockingFailureException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                "The resource was updated by another user. Please try again with the latest version."
        );

        addCommonProps(problemDetail, "Concurrent Modification");
        return problemDetail;
    }

    /**
     * Handle data integrity violations (e.g., unique constraints).
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    ProblemDetail handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                "Data integrity violation: " + ex.getMessage()
        );

        addCommonProps(problemDetail, "Data Integrity Violation");
        return problemDetail;
    }

    /**
     * Handle general server errors.
     */
    @ExceptionHandler(Exception.class)
    ProblemDetail handleGeneralError(Exception ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred: " + ex.getMessage()
        );

        addCommonProps(problemDetail, "Server Error");
        return problemDetail;
    }

    /**
     * Add common properties to all problem details.
     */
    private void addCommonProps(ProblemDetail problemDetail, String title) {
        problemDetail.setTitle(title);
        problemDetail.setType(URI.create("https://api.beerorderservice.com/errors/" + title.toLowerCase().replace(" ", "-")));
        problemDetail.setProperty("timestamp", Instant.now());
    }
}
