import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../types';
import { getUser } from '../../firebase/firestore';
import { signInWithEmailAndPassword, signInWithGoogle, createUserWithEmailAndPassword } from '../../firebase/auth';
import { setAndGetUser } from '../../firebase/firestore';
import { useState, Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';

export type UserSate = {
  isAuthed: boolean;

  uid: string;
  displayName: string;
  email: string;

  isVendorAdmin: boolean;
  vendorId: string;

  fetching: boolean;
  fetchError: Error | null;

  signingIn: boolean;
  signingInError: Error | null;
};

const INITIAL_STATE: UserSate = {
  isAuthed: false,

  uid: '',
  displayName: '',
  email: '',

  isVendorAdmin: false,
  vendorId: '',

  fetching: false,
  fetchError: null,

  signingIn: false,
  signingInError: null,
};

type UserDetails = {
  displayName: string;
  email: string;
  associatedVendorId?: string;
};

type AuthSuccessParams = {
  uid: string;
  displayName: string;
  email: string;
  associatedVendorId?: string;
};

const userSlice = createSlice({
  name: 'user',
  initialState: INITIAL_STATE,
  reducers: {
    fetchStart: (state) => {
      state.fetching = true;
    },
    fetchSuccess: (state, { payload }: PayloadAction<AuthSuccessParams>) => {
      state.fetching = false;
      state.fetchError = null;
      setAuthSuccessParams(state, payload);
    },
    fetchFailure: (state, { payload }: PayloadAction<Error>) => {
      state.fetching = false;
      state.fetchError = payload;
    },

    signInStart: (state) => {
      state.signingIn = true;
    },
    signInSuccess: (state, { payload }: PayloadAction<AuthSuccessParams>) => {
      state.signingIn = false;
      state.signingInError = null;
      setAuthSuccessParams(state, payload);
    },
    signInFailure: (state, { payload }: PayloadAction<Error>) => {
      state.signingIn = false;
      state.signingInError = payload;
    },
    clearSignInError: (state) => {
      state.signingInError = null;
    },

    logOut: () => {
      return INITIAL_STATE;
    },
  },
});

const setAuthSuccessParams = (state: UserSate, payload: AuthSuccessParams) => {
  state.isAuthed = true;
  state.uid = payload.uid;
  state.displayName = payload.displayName;
  state.email = payload.email;
  if (payload.associatedVendorId) {
    state.isVendorAdmin = true;
    state.vendorId = payload.associatedVendorId;
  } else {
    state.isVendorAdmin = false;
    state.vendorId = '';
  }
};

const actions = userSlice.actions;

/**
 * Thunk to handle auth state change received on auth state subscription.
 * @param uid
 */
export const fetchUserOnAuthChangeThunk = (uid: string): AppThunk => async (dispatch, getState) => {
  if (getState().user.signingIn) {
    return;
  }
  dispatch(actions.fetchStart());
  try {
    const userRef = getUser(uid);
    const snapShot = await userRef.get();
    if (snapShot.exists) {
      const { displayName, email, associatedVendorId } = snapShot.data() as UserDetails;
      dispatch(actions.fetchSuccess({ uid, displayName, email, associatedVendorId }));
    } else {
      dispatch(actions.fetchSuccess({ uid, displayName: '', email: '' }));
    }
  } catch (e) {
    dispatch(actions.fetchFailure(e));
  }
};

/**
 * Thunk to handle sign in with google.
 */
export const signInWithGoogleThunk = (): AppThunk => async (dispatch) => {
  dispatch(actions.signInStart());
  try {
    const { user } = await signInWithGoogle();
    if (!user) throw new Error('no credential returned from sign in with google');
    const resp = await setAndGetUser(user);
    const { email, displayName, associatedVendorId } = resp.userDoc as UserDetails;
    dispatch(actions.signInSuccess({ uid: user.uid, email, displayName, associatedVendorId }));
  } catch (error) {
    dispatch(actions.signInFailure(error));
  }
};

/**
 * Thunk to handle sign in with email and password.
 * @param email
 * @param password
 */
export const signInWithEmailAndPasswordThunk = (email: string, password: string): AppThunk => async (dispatch) => {
  dispatch(actions.signInStart());
  try {
    const { user } = await signInWithEmailAndPassword(email, password);
    if (!user) throw new Error('no credential returned from sign in with email and password');
    const resp = await setAndGetUser(user);
    const { displayName, associatedVendorId } = resp.userDoc as UserDetails;
    dispatch(actions.signInSuccess({ uid: user.uid, email, displayName, associatedVendorId }));
  } catch (error) {
    dispatch(actions.signInFailure(error));
  }
};

type SignUpDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

/**
 * Thunk to handle sign up with email and password
 * @param signUpDetails
 */
export const signUpWithEmailAndPasswordThunk = ({
  firstName,
  lastName,
  email,
  password,
}: SignUpDetails): AppThunk => async (dispatch) => {
  dispatch(actions.signInStart());
  try {
    const user = await createUserWithEmailAndPassword(email, password);
    const resp = await setAndGetUser(user, { firstName, lastName, email });
    const { displayName, associatedVendorId } = resp.userDoc as UserDetails;
    dispatch(actions.signInSuccess({ uid: user.uid, email, displayName, associatedVendorId }));
  } catch (error) {
    dispatch(actions.signInFailure(error));
  }
};

type SignUpDetailsWithConfirmation = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UseSignUpWithEmailAndPasswordOutput = {
  signUpDetails: SignUpDetailsWithConfirmation;
  setSignUpDetails: Dispatch<SetStateAction<SignUpDetailsWithConfirmation>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

/**
 * Hook
 */
export const useSignUpWithEmailAndPassword = (): UseSignUpWithEmailAndPasswordOutput => {
  const [signUpDetails, setSignUpDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = signUpDetails;

    if (!firstName) {
      dispatch(actions.signInFailure(new Error('please enter first name')));
    }
    if (!lastName) {
      dispatch(actions.signInFailure(new Error('please enter last name')));
    }
    if (!email) {
      dispatch(actions.signInFailure(new Error('please enter email')));
    }
    if (!password) {
      dispatch(actions.signInFailure(new Error('please enter password')));
    }
    if (confirmPassword !== password) {
      dispatch(actions.signInFailure(new Error('passwords do not match')));
    }
    dispatch(signUpWithEmailAndPasswordThunk({ firstName, lastName, email, password }));
  };

  return { signUpDetails, setSignUpDetails, handleSubmit };
};

export const { logOut: logOutUserAction, clearSignInError: clearSignInErrorAction } = userSlice.actions;

export default userSlice.reducer;
