import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: "root" })
export class AlertService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }

  public showConfirmMessage(
    message: string,
    snackBarConfig?: MatSnackBarConfig
  ) {
    let snackBarRef = this.snackBar.open(
      message,
      "X",
      Object.assign({ duration: 5000 }, snackBarConfig)
    );
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }

  public showErrorMessage(message: string, error: any) {
    let errorMessage = error || "";
    if (error instanceof HttpErrorResponse) {
      errorMessage = error.message;
    }
    if (error && error.error && error.error.message) {
      errorMessage = error.error.message;
      if (typeof errorMessage != "string") {
        errorMessage = JSON.stringify(errorMessage);
      }
    }
    this.showConfirmMessage(`${message} ${errorMessage}`, { duration: -1, verticalPosition: "top", panelClass: "error" });
  }

  public showConfirmDialog(
    title: string,
    message: string,
    force: boolean = false
  ): Observable<boolean> {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: !force
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.confirmMessage = message;
    dialogRef.componentInstance.force = force;

    return dialogRef.afterClosed();
  }
}
