import { ListService } from './../../list.service';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector   : 'edit-list-of-date',
    templateUrl: './edit-list-name.component.html',
    styleUrls  : ['./edit-list-name.component.scss']
})
export class EditListOfDateComponent
{
    formActive: boolean;
    form: FormGroup;
    _list: any;
    date: any;

    @Input()
    public get list(): any {
        return this._list;
    }
    public set list(value) {
        this._list = value;
        moment.locale('th');
        this.date = moment(this._list.in_date)
            .format('DD MMMM ' + `${moment(this._list.in_date).get('year') + 543}`);
        // console.log(this._list);
    }

    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    onNameChanged: EventEmitter<any>;

    @ViewChild('dateInput')
    dateInputField;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _listService: ListService,
    )
    {
        // Set the defaults
        this.formActive = false;
        this.onNameChanged = new EventEmitter();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the form
     */
    openForm(): void
    {
        this.form = this._formBuilder.group({
            in_date: [this.list.in_date]
        });
        this.formActive = true;
        this.focusNameField();
    }

    /**
     * Close the form
     */
    closeForm(): void
    {
        this.formActive = false;
    }

    /**
     * Focus to the name field
     */
    focusNameField(): void
    {
        setTimeout(() => {
            this.dateInputField.nativeElement.focus();
        });
    }

    /**
     * On form submit
     */
    onFormSubmit(): void
    {
        // console.log(this.list.id);
        if ( this.form.valid )
        {
            this.list.in_date = moment(this.form.getRawValue().in_date).format('YYYY-MM-DD');
            this._listService.editListOfDate(this.list.id, this.list.in_date);
            this.formActive = false;
        }
    }
}
