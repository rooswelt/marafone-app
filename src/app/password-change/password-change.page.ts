import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getChangePasswordStatus, PasswordManagementActions } from '@xtream/firebase-ngrx-user-management';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.page.html',
  styleUrls: ['./password-change.page.scss'],
})
export class PasswordChangePage implements OnInit {
  private unsubscribe$ = new Subject<void>();

  form: FormGroup;
  success: boolean;
  error: string;

  constructor(private store$: Store<AppState>, private fb: FormBuilder) {
    this.store$.pipe(select(getChangePasswordStatus), takeUntil(this.unsubscribe$)).subscribe(status => {
      this.success = status.success;
      this.error = status.error ? status.error.message : "";
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
    this.form = this.fb.group(
      {
        oldPassword: ["", Validators.required],
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

  confirmChange() {
    this.store$.dispatch(new PasswordManagementActions.ChangePasswordRequest({ oldPassword: this.form.value["oldPassword"], newPassword: this.form.value["password"] }));
  }
}
