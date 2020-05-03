import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Actions, EffectsModule, ofType } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthActions, FirebaseNgrxUserManagementModule } from '@xtream/firebase-ngrx-user-management/';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
import { take } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { RouterEffects } from './store/effects/router.effects';
import { AppState, metaReducers, reducers } from './store/reducers';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: "#d35776",
  fgsType: SPINNER.threeBounce,
  hasProgressBar: false,
  overlayColor: "rgba(130,130,130,0.7)"
};

export function initApplication(store: Store<AppState>, actions$: Actions): Function {
  return () => new Promise(resolve => {
    store.dispatch(new AuthActions.GetUser());
    actions$.pipe(ofType(AuthActions.AuthActionTypes.Authenticated, AuthActions.AuthActionTypes.NotAuthenticated), take(1)).subscribe(() => resolve(true))
  })
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true
    }),
    AngularFireModule.initializeApp(environment.firebase, 'Marafone'),
    FirebaseNgrxUserManagementModule,
    AngularFirestoreModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([RouterEffects])
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [Store, Actions],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
