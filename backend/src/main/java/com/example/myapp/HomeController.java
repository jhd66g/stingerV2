/**
 * backend/src/main.java/com/example/myapp/HomeController.java
 * 
 * backend portion of the main homepage
 */
package com.example.myapp;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// Allow calls from the React dev server running on localhost:3000
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {
    
    @GetMapping("/api/home")
    public String home() {
        return "Stinger";
    }
}