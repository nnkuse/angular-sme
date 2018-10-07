import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Lists } from './../../../models/lists';
import { ListsService } from './../../lists.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.scss']
})

export class AddDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Lists,
              private _listsService: ListsService) { }

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
    this._listsService.addList(this.data).then(() => {
      this.dialogRef.close(1);
    });
  }
}
