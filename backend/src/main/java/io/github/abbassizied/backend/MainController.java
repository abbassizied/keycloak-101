package io.github.abbassizied.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
public class MainController {

    @GetMapping("/")
    public String hello() {
        return "hello, world!";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAdminMessage(@AuthenticationPrincipal Jwt jwt) {
        return String.format("Hello %s, You have full administrative privileges",
                jwt.getClaimAsString("preferred_username"));
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String getUserMessage(@AuthenticationPrincipal Jwt jwt) {

        return String.format("Hello %s, You have standard user privileges", jwt.getClaimAsString("preferred_username"));
    }
}