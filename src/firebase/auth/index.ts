import firebase from '../';

/**
 * Auth service for the default app.
 */
export const auth = firebase.auth();

if (window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099');
}

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Allows a user to create a new account with email and password. If the email
 * is already in use, the sign in method will be returned.
 * @param email
 * @param password
 */
export const createUserWithEmailAndPassword = async (email: string, password: string): Promise<firebase.User> => {
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  if (!cred.user) throw new Error('error creating user, no user returned');
  await cred.user.sendEmailVerification();
  return cred.user;
};

/**
 * Allows a user to sign in with email and password.
 * @param email
 * @param password
 */
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<firebase.auth.UserCredential> => {
  return auth.signInWithEmailAndPassword(email, password);
};

/**
 * Allows a user to sign in with popup with a given oauth provider.
 * If account/email already exists with a different set of credentials, then an
 * alternative set of details are returned which the user can use to authenticate
 * with link the new credential.
 * @param provider
 */
export const signInWithPopup = async (provider: firebase.auth.AuthProvider): Promise<firebase.auth.UserCredential> => {
  return await auth.signInWithPopup(provider);
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
