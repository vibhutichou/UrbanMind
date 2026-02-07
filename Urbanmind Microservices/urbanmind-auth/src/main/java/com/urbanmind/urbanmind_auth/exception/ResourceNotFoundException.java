package com.urbanmind.urbanmind_auth.exception;

// Suppress serial warning because we don't use serialization in this simple exception class
@SuppressWarnings("serial")
/**
 * Exception thrown when a requested resource (entity) cannot be found.
 * Typically translated to HTTP 404 by a global exception handler.
 */
public class ResourceNotFoundException extends RuntimeException {
    /**
     * Construct with a human-readable message describing the missing resource.
     * @param msg message like "Problem not found with id 5"
     */
    public ResourceNotFoundException(String msg) {
        super(msg);
    }
}