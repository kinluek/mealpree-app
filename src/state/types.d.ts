import { ThunkAction, Action } from '@reduxjs/toolkit';
import { UserSate } from './user';

export type RootState = { user: UserSate };

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
