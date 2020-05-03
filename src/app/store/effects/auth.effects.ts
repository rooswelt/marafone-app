import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions, PasswordManagementActions } from '@xtream/firebase-ngrx-user-management';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, switchMap, tap } from 'rxjs/operators';
import { AlertService } from 'src/app/commons/services/alert.service';

import * as MyAuthActions from '../actions/auth.actions';
import * as RouterActions from '../actions/router.actions';

@Injectable()
export class AuthEffects {

  loginCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AuthActionTypes.Authenticated, AuthActions.AuthActionTypes.RegistrationSuccess),
      map(() => RouterActions.routerGo({ path: ['/dashboard'] }))
    )
  );

  logoutCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AuthActionTypes.NotAuthenticated),
      map(() => RouterActions.routerGo({ path: ['/login'] }))
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MyAuthActions.tryLogout),
      switchMap(() => {
        return this.alertService.showConfirmDialog('Conferma uscita', 'Sei sicuro di voler uscire?')
      }),
      map((confirm) => confirm ? new AuthActions.Logout() : MyAuthActions.logoutCancelled())
    )
  );

  onRegisterCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthActions.RegistrationSuccess>(AuthActions.AuthActionTypes.RegistrationSuccess),
      map(action => action.payload),
      tap(() => this.alertService.showConfirmMessage(`Registrazione completata`))
    ), { dispatch: false }
  );

  onPasswordChange = createEffect(() =>
    this.actions$.pipe(
      ofType(PasswordManagementActions.PasswordManagementActionTypes.ChangePasswordSuccess),
      tap(() => this.alertService.showConfirmMessage(`Password aggiornata`)),
      map(() => RouterActions.routerGo({ path: ['/home'] }))
    )
  );

  showLoader$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.AuthActionTypes.CredentialsLogin,
        AuthActions.AuthActionTypes.FacebookLogin,
        AuthActions.AuthActionTypes.GoogleLogin,
        AuthActions.AuthActionTypes.CredentialsRegistration,
        PasswordManagementActions.PasswordManagementActionTypes.ChangePasswordRequest,
        PasswordManagementActions.PasswordManagementActionTypes.ResetPasswordRequest,
      ),
      tap(() => this.ngxService.start())
    ), { dispatch: false }
  )

  hideLoader$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.AuthActionTypes.Authenticated,
        AuthActions.AuthActionTypes.NotAuthenticated,
        AuthActions.AuthActionTypes.AuthError,
        AuthActions.AuthActionTypes.RegistrationSuccess,
        PasswordManagementActions.PasswordManagementActionTypes.ResetPasswordRequestError,
        PasswordManagementActions.PasswordManagementActionTypes.ResetPasswordRequestSuccess,
        PasswordManagementActions.PasswordManagementActionTypes.ChangePasswordError,
        PasswordManagementActions.PasswordManagementActionTypes.ChangePasswordSuccess,
      ),
      tap(() => this.ngxService.stop())
    ), { dispatch: false }
  )

  constructor(
    private actions$: Actions,
    private alertService: AlertService,
    private ngxService: NgxUiLoaderService,
  ) { }
}
