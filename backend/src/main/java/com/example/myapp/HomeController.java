/**
 * backend/src/main.java/com/example/myapp/HomeController.java
 * 
 * backend portion of the main homepage
 */
package com.example.myapp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HomeController provides a basic endpoint for the API.
 */
@RestController
public class HomeController {

    /**
     * Basic endpoint for the root path.
     * @return A welcome message.
     */
    @GetMapping("/")
    public String home() {
        return "Welcome to the Movie Catalog API";
    }
}