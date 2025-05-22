import joi from "joi";
import bcrypt from "bcrypt";

const schema = joi.object({
  username: joi.string().alphanum().min(3).max(30).trim().required(),

  password: joi
    .string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@.#$!%*?&])[a-zA-Z0-9@.#$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        '"password" must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
});

function validateCredentials(username, password) {
  const result = schema.validate(
    { username: username, password: password },
    { abortEarly: false }
  );
  if (result.error) {
    return result.error.details.map((error) => error.message);
  }

  return [];
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export { validateCredentials, hashPassword, comparePassword };
