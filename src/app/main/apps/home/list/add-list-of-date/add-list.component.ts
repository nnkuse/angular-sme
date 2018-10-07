import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector   : 'add-list-of-date',
    templateUrl: './add-list.component.html',
    styleUrls  : ['./add-list.component.scss']
})
export class AddListOfDateComponent
{
    formActive: boolean;
    form: FormGroup;
    listOfDate: string;

    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    onListAdd: EventEmitter<any>;

    @ViewChild('dateInput')
    dateInputField;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
    )
    {
        // Set the defaults
        this.formActive = false;
        this.onListAdd = new EventEmitter();
    }

    openForm(): void {
        this.form = this._formBuilder.group({
            in_date: new Date()
        });
        this.formActive = true;
    }

    /**
     * Close form
     */
    closeForm(): void {
        this.formActive = false;
    }

    /**
     * On form submit
     */
    onFormSubmit(): void {
        if (this.form.valid) {
            this.onListAdd.next(this.form.getRawValue().in_date);
            this.formActive = false;
        }
    }
}
