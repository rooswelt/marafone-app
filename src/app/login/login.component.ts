import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AuthActions, getAuthError } from '@xtream/firebase-ngrx-user-management';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as RouterActions from 'src/app/store/actions/router.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  form: FormGroup;
  error: string;

  constructor(private store$: Store<AppState>, private fb: FormBuilder) {
    this.store$.pipe(select(getAuthError), takeUntil(this.unsubscribe$)).subscribe(error => {
      this.error = error ? error.message : "";
    });
  }

  ngOnInit() {
    this._createForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private _createForm() {
    let group = {
      email: ["", [Validators.email, Validators.required]],
      password: ["", Validators.required]
    }

    this.form = this.fb.group(group);
  }

  login() {
    this.store$.dispatch(new AuthActions.CredentialsLogin(this.form.value["email"], this.form.value["password"], true));
  }

  loginWithFB() {
    this.store$.dispatch(new AuthActions.FacebookLogin());
  }

  loginWithGoogle() {
    this.store$.dispatch(new AuthActions.GoogleLogin());
  }

  register() {
    this.store$.dispatch(RouterActions.routerGo({ path: ['/register'] }));
  }

  resetPassword() {
    this.store$.dispatch(RouterActions.routerGo({ path: ['/password-reset'] }));
  }
}
