import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AuthActions, getAuthError } from '@xtream/firebase-ngrx-user-management';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as RouterActions from 'src/app/store/actions/router.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  error: string;
  registerForm: FormGroup;

  constructor(
    private store$: Store<AppState>,
    private fb: FormBuilder
  ) {
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
    this.registerForm = this.fb.group(
      {
        email: ["", Validators.email],
        password: ["", Validators.required],
        confirmPass: ["", Validators.required]
      },
      { validator: this.checkIfMatchingPasswords("password", "confirmPass") }
    );
  }

  checkIfMatchingPasswords(
    passwordKey: string,
    passwordConfirmationKey: string
  ) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  register() {
    this.error = null;
    this.store$.dispatch(new AuthActions.CredentialsRegistration({ email: this.registerForm.value["email"], password: this.registerForm.value["password"], remember: true }));
  }

  goBack() {
    this.store$.dispatch(RouterActions.routerBack());
  }
}
