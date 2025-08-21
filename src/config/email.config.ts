import 'dotenv/config';
import * as joi from 'joi';

interface EnvsVars {
  SERVER_PORT: number;
  GRPC_PORT: number;
  EMAIL_DEFAULT_PROVIDER: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  MAILTRAP_HOST: string;
  MAILTRAP_PORT: number;
  MAILTRAP_USER: string;
  MAILTRAP_PASS: string;
  MAILERSEND_API_KEY: string;
  OFFICE365_HOST: string;
  OFFICE365_PORT: number;
  OFFICE365_SECURE: boolean;
  OFFICE365_REQUIRE_TLS: boolean;
  OFFICE365_USER: string;
  OFFICE365_PASS: string;
  OFFICE365_SECURITY: string;
  OFFICE365_TLS_CIPHERS: string;
  OFFICE365_TLS_REJECT_UNAUTHORIZED: boolean;
}

const envsSchema = joi
  .object({
    SERVER_PORT: joi.number().default(3200),
    GRPC_PORT: joi.number().default(50057),
    EMAIL_DEFAULT_PROVIDER: joi
      .string()
      .valid('mailtrap', 'mailersend', 'office365')
      .default('office365'),
    EMAIL_FROM: joi.string().email().required(),
    EMAIL_FROM_NAME: joi.string().required(),
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
    MAILERSEND_API_KEY: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'mailersend',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
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
    OFFICE365_SECURITY: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    OFFICE365_TLS_CIPHERS: joi.string().when('EMAIL_DEFAULT_PROVIDER', {
      is: 'office365',
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    OFFICE365_TLS_REJECT_UNAUTHORIZED: joi
      .boolean()
      .when('EMAIL_DEFAULT_PROVIDER', {
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
      mailtrap: {
        host: envVars.MAILTRAP_HOST,
        port: envVars.MAILTRAP_PORT,
        user: envVars.MAILTRAP_USER,
        pass: envVars.MAILTRAP_PASS,
      },
      mailersend: {
        apiKey: envVars.MAILERSEND_API_KEY,
      },
      office365: {
        host: envVars.OFFICE365_HOST,
        port: envVars.OFFICE365_PORT,
        secure: envVars.OFFICE365_SECURE,
        requireTLS: envVars.OFFICE365_REQUIRE_TLS,
        user: envVars.OFFICE365_USER,
        pass: envVars.OFFICE365_PASS,
        security: envVars.OFFICE365_SECURITY,
        tlsCiphers: envVars.OFFICE365_TLS_CIPHERS,
        tlsRejectUnauthorized: envVars.OFFICE365_TLS_REJECT_UNAUTHORIZED,
      },
    },
  },
};
