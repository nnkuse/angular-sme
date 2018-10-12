import { FuseConfirmDialogComponent } from './../../../../../../../../@fuse/components/confirm-dialog/confirm-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ListDetailService } from '../../list-detail.service';
import { ListDetail } from '../../../../models/listDetail';

@Component({
  selector: 'app-add-detail.dialog',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.scss']
})

export class AddDetailDialogComponent {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(public dialogRef: MatDialogRef<AddDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _listDetailService: ListDetailService,
              public dialog: MatDialog,
              private _matDialog: MatDialog) { }

  formControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage(): string {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit(): void {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmAdd(): void {
    this._listDetailService.addDetail(this.data).then(() => {
      this.dialogRef.close(1);
    });
  }

  edit(): void {
    // console.log(this.data);
    this._listDetailService.editDetail(this.data).then(() => {
      this.dialogRef.close(1);
    });
  }

  delete(): void {
    console.log(this.data);
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'ต้องการลบ ' + this.data.detail.list_detail_name + ' ?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._listDetailService.removeDetail(this.data).then(() => {
          this.dialogRef.close(1);
        });
      }
    });
  }
}
