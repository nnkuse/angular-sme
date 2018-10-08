import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListDetailService } from '../list-detail.service';


@Component({
    selector   : 'invoice-compact',
    templateUrl: './compact.component.html',
    styleUrls  : ['./compact.component.scss']
})
export class ListDetailComponent implements OnInit, OnDestroy
{
    invoice: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _listDetailService: ListDetailService
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
            .subscribe((invoice) => {
                this.invoice = invoice;
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
}
