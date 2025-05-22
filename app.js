import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import {
  connectToDataStore,
  usernameExists,
  addUser,
  retrieveUser,
} from "./redisDataStore.js";
import { generateAccessToken, verifyAccessToken } from "./authTokenUtils.js";
import {
  validateCredentials,
  hashPassword,
  comparePassword,
} from "./inputValidationUtils.js";

const app = express();

connectToDataStore();

app.use(express.json());

// Add security headers
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // set window to 5 minutes for testing - change to more reasonable value in production
  max: 15, // limit each IP to 15 requests per window for testing - change to more reasonable value in production
});
app.use(limiter);

app.post("/register", async (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  const inputValidationErrors = validateCredentials(username, password);

  if (inputValidationErrors.length > 0) {
    return response.status(400).json({
      message: "Input validation errors",
      errors: inputValidationErrors,
    });
  }

  try {
    if (await usernameExists(username)) {
      return response.status(409).json({ error: `Username must be unique` });
    }

    const hashedPassword = await hashPassword(password);
    await addUser(username, hashedPassword);

    response.status(201).json({ message: `User successfully registered` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: `Error registering user` });
  }
});

app.post("/login", async (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  if (!username || !password) {
    return response
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await retrieveUser(username);

    if (!user) {
      return response
        .status(401)
        .json({ error: "Invalid username or password" });
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return response
        .status(401)
        .json({ error: "Unauthorized - Invalid username or password" });
    }

    const accessToken = generateAccessToken(user);

    response
      .status(200)
      .json({ message: "User authenticated", accessToken: accessToken });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error: `Error authenticating user ${username}` });
  }
});

app.get("/protected", verifyAccessToken, (request, response) => {
  response
    .status(200)
    .json({ message: "Successfully accessed protected route" });
});

console.log("Server started on port 3000");

app.listen(3000);
