import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getChangePasswordStatus, PasswordManagementActions } from '@xtream/firebase-ngrx-user-management';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as RouterActions from 'src/app/store/actions/router.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  form: FormGroup;
  success: boolean;
  error: string;

  constructor(private store$: Store<AppState>, private fb: FormBuilder) {
    this.store$.pipe(select(getChangePasswordStatus), takeUntil(this.unsubscribe$)).subscribe(status => {
      console.log(status);
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
    let group = {
      email: ["", [Validators.required, Validators.email]]
    }

    this.form = this.fb.group(group);
  }

  confirmReset() {
    this.store$.dispatch(new PasswordManagementActions.ResetPasswordRequest({ email: this.form.value["email"], redirectUrl: "https://yoga-planner-40ec9.firebaseapp.com" }));
  }

  backToLogin() {
    this.store$.dispatch(RouterActions.routerBack());
  }

}
