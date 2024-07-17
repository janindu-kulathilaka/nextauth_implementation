'use server';

import * as z from 'zod';

import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFeilds = LoginSchema.safeParse(values);
  let error = '';
  let success = '';

  if (!validateFeilds.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validateFeilds.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return { error: 'Invalid credentials!', success: '' };
        }
        default: {
          return { error: 'Something went wrong!', success: '' };
        }
      }
    }

    throw error;
  }
  return { error, success };
};
