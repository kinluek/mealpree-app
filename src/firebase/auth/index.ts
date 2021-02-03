import firebase from '../';

import { AuthErrorCodes, CreateUserResponse, SignInWithEmailResponse, SignInWithProviderResponse } from './types';

/**
 * Auth service for the default app.
 */
export const auth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Allows a user to create a new account with email and password. If the email
 * is already in use, the sign in method will be returned.
 * @param email
 * @param password
 */
export const createUserWithEmailAndPassword = async (email: string, password: string): Promise<CreateUserResponse> => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    if (!userCredential.user) {
      throw new Error('no user returned from createUserWithEmailAndPassword');
    }
    await userCredential.user.sendEmailVerification();
    return { userCredential, alternative: null };
  } catch (error) {
    if (error.code === AuthErrorCodes.EmailAlreadyInUse) {
      const methods = await auth.fetchSignInMethodsForEmail(email);
      return { userCredential: null, alternative: { method: methods[0] } };
    }
    throw error;
  }
};

/**
 * Allows a user to sign in with email and password.
 * @param email
 * @param password
 */
export const signInWithEmailAndPassword = async (email: string, password: string): Promise<SignInWithEmailResponse> => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return { userCredential, alternative: null };
  } catch (error) {
    if (error.code === AuthErrorCodes.WrongPassword) {
      const methods = await auth.fetchSignInMethodsForEmail(email);
      if (methods.length > 0) {
        return {
          userCredential: null,
          alternative: { method: methods[0] },
        };
      }
    }
    throw error;
  }
};

/**
 * Allows a user to sign in with popup with a given oauth provider.
 * If account/email already exists with a different set of credentials, then an
 * alternative set of details are returned which the user can use to authenticate
 * with link the new credential.
 * @param provider
 */
export const signInWithPopup = async (provider: firebase.auth.AuthProvider): Promise<SignInWithProviderResponse> => {
  try {
    const userCredential = await auth.signInWithPopup(provider);
    return { userCredential, alternative: null };
  } catch (error) {
    if (error.code === AuthErrorCodes.DifferentCredentialsExists) {
      const credential = error.pendingCred;
      const email = error.email;
      const methods = await auth.fetchSignInMethodsForEmail(email);
      return {
        userCredential: null,
        alternative: { email, credential, method: methods[0] },
      };
    }
    throw error;
  }
};

/**
 * Allows a user to sign in with a given provider and link another credential.
 * @param provider
 * @param credential
 */
export const linkCredentialWithProvider = async (
  provider: firebase.auth.AuthProvider,
  credential: firebase.auth.AuthCredential
): Promise<firebase.auth.UserCredential> => {
  const result = await auth.signInWithPopup(provider);
  if (!result.user) {
    throw new Error(`no user returned from firebase signInWithPopup - provider: ${provider.providerId}`);
  }
  return result.user.linkWithCredential(credential);
};

/**
 * Allow a user to sign in with an email and password and link another credential.
 * @param email
 * @param password
 * @param credential
 */
export const linkCredentialWithEmail = async (
  email: string,
  password: string,
  credential: firebase.auth.OAuthCredential
): Promise<firebase.auth.UserCredential> => {
  const result = await auth.signInWithEmailAndPassword(email, password);
  if (!result.user) {
    throw new Error(`no user returned from firebase signInWithEmailAndPassword - email: ${email}`);
  }
  return result.user.linkWithCredential(credential);
};

/**
 * Allows are user to sign in with google.
 */
export const signInWithGoogle = () => signInWithPopup(googleProvider);
