/**
 * backend/src/main.java/com/example/myapp/HomeController.java
 * 
 * backend portion of the main homepage
 */
package com.example.myapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HomeController provides a basic API endpoint.
 */
@RestController
public class HomeController {

    /**
     * Returns a welcome message.
     * @return A welcome string.
     */
    @GetMapping("/")
    public String home() {
        return "Welcome to the Movie Catalog API";
    }
}