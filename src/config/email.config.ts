import 'dotenv/config';
import * as joi from 'joi';

interface EnvsVars {
  SERVER_PORT: number;
  GRPC_PORT: number;
  EMAIL_DEFAULT_PROVIDER: string;
  MAILTRAP_HOST: string;
  MAILTRAP_PORT: number;
  MAILTRAP_USER: string;
  MAILTRAP_PASS: string;
}

const envsSchema = joi
  .object({
    SERVER_PORT: joi.number().default(3200),
    GRPC_PORT: joi.number().default(50057),
    EMAIL_DEFAULT_PROVIDER: joi.string().valid('mailtrap').default('mailtrap'),
    MAILTRAP_HOST: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'mailtrap',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    MAILTRAP_PORT: joi.number().default(2525),
    MAILTRAP_USER: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'mailtrap',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    MAILTRAP_PASS: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'mailtrap',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
  })
  .unknown(true);

const validationResult = envsSchema.validate(process.env);

if (validationResult.error)
  throw new Error(`Config validation error: ${validationResult.error.message}`);

const envVars: EnvsVars = validationResult.value as EnvsVars;

export const envs = {
  server: {
    port: envVars.SERVER_PORT,
  },
  grpc: {
    port: envVars.GRPC_PORT,
  },
  email: {
    providers: {
      default: envVars.EMAIL_DEFAULT_PROVIDER,
      mailtrap: {
        host: envVars.MAILTRAP_HOST,
        port: envVars.MAILTRAP_PORT,
        user: envVars.MAILTRAP_USER,
        pass: envVars.MAILTRAP_PASS,
      },
    },
  },
};
