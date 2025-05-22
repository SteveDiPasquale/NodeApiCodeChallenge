import redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function connectToDataStore() {
  await redisClient.connect();
}

async function usernameExists(username) {
  const userKey = `user:${username}`;
  return await redisClient.exists(userKey);
}

async function addUser(username, password) {
  const userKey = `user:${username}`;
  await redisClient.set(userKey, password);
}

async function retrieveUser(username) {
  const userKey = `user:${username}`;
  const hashedPassword = await redisClient.get(userKey);

  if (!hashedPassword) {
    return null;
  }

  return { username: username, password: hashedPassword };
}

export { connectToDataStore, usernameExists, addUser, retrieveUser };
