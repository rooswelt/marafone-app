import { createAction } from '@ngrx/store';

// export const register = createAction('[Auth] Register', props<{ email: string, password: string }>());
// export const registerCompleted = createAction('[Auth] Register Completed', props<{ user: firebase.User }>());
// export const registerFailed = createAction('[Auth] Register Failed', props<{ error: any }>());

// export const loginWithEmail = createAction('[Auth] Login With Email', props<{ email: string, password: string }>());
// export const loginWithFacebook = createAction('[Auth] Facebook Login');
// export const loginWithGoogle = createAction('[Auth] Google Login');
// export const loginCompleted = createAction('[Auth] Login Completed');
// export const loginFailed = createAction('[Auth] Login Failed', props<{ error: any }>());

export const tryLogout = createAction('[Auth] Try Logout');
export const logoutCancelled = createAction('[Auth] Logout Cancelled');
