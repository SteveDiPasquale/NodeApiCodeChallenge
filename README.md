# NodeApiCodeChallenge

## Instructions for Locally Running API

1. Download the code and create a .env file in the parent directory. 

2. Add the following values to the .env file:

    - `ACCESS_TOKEN_SECRET=REPLACE_WITH_ANY_SECRET_VALUE`
    - `ACCESS_TOKEN_EXPIRES_IN=REPLACE_WITH_A_DURATION_VALUE`
    - `REDIS_URL=REPLACE_WITH_REDIS_URL`

    For the token expiry, I used 60s for testing purposes.
    For the Redis URL, I used:
    - If running the API in Docker: `redis://redis:6379`
    - If running the API locally: `redis://localhost:6379`

3. Run the API:

    - If using Docker, you can use the following command from the parent directory:
    `docker-compose up --build`
    - If running locally:
        - You will first need Redis installed on your system.  
        - Once installed, you will then need to run `npm install` from the parent directory to install dependencies
        - Run the `npm start` command to start the API

4. You can use a tool such as Postman to test the various endpoints:
    - `/register`
    - `/login`
    - `/protected`

    I have included a NodeApiCodingChallenge.postman_collection file that you can import into Postman and use for testing.

## General Solution Description

1. Created an authentication API in Node.js, using Redis for data storage

2. There is a "register" POST endpoint that takes the following request body:

    `{
        "username": "testUserName",
        "password": "validP@ssw0rd"
    }`

    The user is added to the datastore with a hashed password.  Usernames must be unique. Passwords must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.

3. There is a "login" POST endpoint that takes the following request body:

    `{
        "username": "testUserName",
        "password": "validP@ssw0rd"
    }`

    The data store is checked for an existing username with the provided password, and if successfully found, creates and returns an authentication token in the response.

4. There is a "protected" GET endpoint that will respond with a success message if the provided authentication token is valid.

## NPM Packages Used

- **BCrypt:** used for hashing and comparing passwords
- **DotEnv:** used for leveraging environment configuration files (.env)
- **Express:** used for api routing
- **Express Rate Limit:** used to implement basic rate limiting to limit exposure to brute force attacks. For testing purposes, I set the limits to 15 requests in a 5-minute window.  These should be increased to more reasonable values in a production environment.
- **Helmet:** used for securing HTTP headers
- **Joi:** used for username and password validation
- **JsonWebToken:** used to generate and verify auth tokens
- **Redis:** used as the data store for usernames and passwords.  Usernames are stored as the key in the form "user:username" and the hashed passwords are stores as the values.

## Other Considerations Not Implemented

1. In a production environment, I would want to enforce HTTPS traffic. I chose not to implement this due to time constraints and because it seemed like overkill for a demo project.
2. If there were other endpoints taking in user input, I would want to add logic to sanitize the inputs to prevent injection attacks. 
3. In this solution, I am simply returning a short-lived access token. Given more time, I would want to add refresh token functionality to extend the user's session without requiring re-authentication.
