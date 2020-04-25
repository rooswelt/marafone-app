import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/commons/services/alert.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private alertService: AlertService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    //TODO mrosetti - Fare qualcosa di più sicuro
    return this.alertService.showConfirmDialog('Conferma', 'Sei sicuro di voler entrare nella schermata di Admin?').pipe(map(confirm => !!confirm));
  }
}

// @Component({
//     selector: "admin-pin-dialog",
//     styleUrls: [],
//     templateUrl: "admin-pass-dialog.component.html"
// })
// export class AdminPassDialog {

//     public errorMessageDisplay: boolean = false;

//     currentPin: string[] = [];

//     constructor(public modalService: ModalService) { }

//     handleKeyboardEvent(event: KeyboardEvent) {
//         if (event.key == 'Enter') {
//             this.check();
//         }
//     }

//     onDigit(digit: string) {
//         if (this.errorMessageDisplay) {
//             this.currentPin.splice(0, this.currentPin.length);
//             this.errorMessageDisplay = false;
//         }
//         this.currentPin.push(digit);
//     }

//     onDelete() {
//         this.currentPin.pop();
//     }

//     onReset() {
//         if (this.errorMessageDisplay) {
//             this.currentPin.splice(0, this.currentPin.length);
//             this.errorMessageDisplay = false;
//         }
//         this.currentPin.splice(0, this.currentPin.length);
//     }

//     check() {
//         if (this.currentPin.join("") === environment["adminPin"]) {
//             this.modalService.dismissModal(true);
//         } else {
//             this.errorMessageDisplay = true;
//         }
//     }

//     cancel() {
//         this.modalService.dismissModal(false);
//     }
// }
