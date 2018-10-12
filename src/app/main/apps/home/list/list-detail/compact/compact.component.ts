import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListDetailService } from '../list-detail.service';
import { fuseAnimations } from '@fuse/animations';
import { ListDetail } from '../../../models/listDetail';
import { AddDetailDialogComponent } from '../dialogs/add/add.dialog.component';
import * as moment from 'moment';


@Component({
    selector: 'list-detail-compact',
    templateUrl: './compact.component.html',
    styleUrls  : ['./compact.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ListDetailComponent implements OnInit, OnDestroy
{
    listDetail: any;
    listItemID: number;
    listDetailInDate: any;
    editDetail: ListDetail;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _listDetailService: ListDetailService,
        public dialog: MatDialog,
        private _changeDetectorRefs: ChangeDetectorRef
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._listDetailService.detailOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((listDetail) => {
                this.listDetail = listDetail;
                // console.log(this.listDetail);
                this.listItemID = listDetail.list_item_id;
                moment.locale('th');
                this.listDetailInDate = moment(listDetail.in_date)
                    .format('DD MMMM ' + `${moment(listDetail.in_date).get('year') + 543}`);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    addNew(state: string): void {
        this.editDetail = new ListDetail();
        this.editDetail.in_come = this.editDetail.expense = '0.00';
        this.dialog.open(AddDetailDialogComponent, {
            data: { state: state, detail: this.editDetail }
        }).afterClosed().subscribe(result => {
            if (result === 1) {
                this._changeDetectorRefs.detectChanges();
            }
        });
    }

    editOrDelete(state: string, detail: ListDetail): void {
        this.editDetail = new ListDetail(detail);
        this.dialog.open(AddDetailDialogComponent, {
            data: { state: state, detail: this.editDetail }
        }).afterClosed().subscribe(result => {
            if (result === 1) {
                this._changeDetectorRefs.detectChanges();
            }
        });
    }
}
