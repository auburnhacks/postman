# Postman API Documentation

## Basic
- Protocol: HTTP/1.1 & HTTP/2.0
- Design: REST API
- Security: SSL/TLS

### Endpoints
#### `Base routes`
- GET `/`: default index route
    - This just returns the version of the postman server
    - ``` { "version": 1.0.0 }```
- GET `/healthz`: RPC endpoint for kubernetes liveness probe.
    - Returns `ok` that's it!

#### `Email routes`
- POST `/email/queue`: queue an email to be sent later
    - Send a json payload in the following pattern
        ```
            {
                "to_emails": [
                    "johndoe@example.com"
                ],
                "subject": "email subject",
                "email_text": "some kewl text"
            }
        ```
    - Response is a json payload that is marshaled from the `EmailJob` object in `email.model.ts`
- GET: `/email/pending`: view a list of all pending jobs for postman.
    - Response is a json payload that contains a list of `EmailJob` objects
- POST: `/email/send_now`: send an email right now 😎.
    - Send a json payload following this pattern
         ```
            {
                "to_emails": [
                    "johndoe@example.com"
                ],
                "subject": "email subject",
                "email_text": "some kewl text"
            }
        ```
    - This endpoint should be used with caution as there is no retry policy