import 'dotenv/config';
import * as joi from 'joi';

interface EnvsVars {
  SERVER_PORT: number;
  GRPC_PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_SYNCHRONIZE: boolean;
  EMAIL_DEFAULT_PROVIDER: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  OFFICE365_HOST: string;
  OFFICE365_PORT: number;
  OFFICE365_SECURE: boolean;
  OFFICE365_REQUIRE_TLS: boolean;
  OFFICE365_USER: string;
  OFFICE365_PASS: string;
}

const envsSchema = joi
  .object({
    SERVER_PORT: joi.number().default(3200),
    GRPC_PORT: joi.number().default(50057),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().default(3306),
    DB_NAME: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().allow(''),
    DB_SYNCHRONIZE: joi.boolean().default(true),
    EMAIL_DEFAULT_PROVIDER: joi
      .string()
      .valid('mailtrap', 'mailersend', 'office365')
      .default('office365'),
    EMAIL_FROM: joi.string().email().required(),
    EMAIL_FROM_NAME: joi.string().required(),
    OFFICE365_HOST: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    OFFICE365_PORT: joi.number().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    OFFICE365_SECURE: joi.boolean().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    OFFICE365_REQUIRE_TLS: joi.boolean().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    OFFICE365_USER: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    OFFICE365_PASS: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
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
    from: envVars.EMAIL_FROM,
    fromName: envVars.EMAIL_FROM_NAME,
    providers: {
      default: envVars.EMAIL_DEFAULT_PROVIDER,
      office365: {
        host: envVars.OFFICE365_HOST,
        port: envVars.OFFICE365_PORT,
        secure: envVars.OFFICE365_SECURE,
        requireTLS: envVars.OFFICE365_REQUIRE_TLS,
        user: envVars.OFFICE365_USER,
        pass: envVars.OFFICE365_PASS,
      },
    },
  },
  database: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    name: envVars.DB_NAME,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    synchronize: envVars.DB_SYNCHRONIZE,
  },
};
