import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ListService } from '../list.service';
import { Lists } from '../../models/lists';

@Component({
  selector: 'app-edit.dialog',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.scss']
})

export class EditDialogComponent implements OnInit {

  listEdit: Lists;

  listForm: FormGroup;

   formControl = new FormControl('', [
    Validators.required
  ]);

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _listsService: ListService,
    private _formBuilder: FormBuilder,
  ) {
    // Set the default
    this.listEdit = new Lists(data.list);
  }

  ngOnInit(): void {
    this.listForm = this.createProductForm();
  }

  createProductForm(): FormGroup {
    return this._formBuilder.group({
      id:         [this.listEdit.id],
      list_name:  [this.listEdit.list_name],
      agency:     [this.listEdit.agency],
      start_date: [this.listEdit.start_date],
      end_date:   [this.listEdit.end_date],
      net_income: [this.listEdit.net_income],
    });
  }

  getErrorMessage(): string {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit(): void {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmEdit(): void {
    this._listsService.editList(this.listForm.value).then(() => {
      this.dialogRef.close(1);
    });
  }
}
