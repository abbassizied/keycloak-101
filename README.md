# keycloak-101
A demonstration application showcasing the integration of Keycloak with Spring Boot (for the backend API), Angular (for a single-page application), and Next.js (for a server-rendered or full-stack application).

## Get started with Keycloak on Docker

```sh
docker run -p 127.0.0.1:7080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.3.2 start-dev
```

## What is the difference between 401 and 403 Forbidden?

* 401 indicates missing or invalid authentication.
* 403 indicates lack of permission despite valid authentication.


##