import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ListService } from '../list.service';
import { EditListOfDateComponent } from './edit-list-name/edit-list-name.component';

// import { ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
// import { Card } from 'app/main/apps/scrumboard/card.model';
// import { ScrumboardCardDialogComponent } from 'app/main/apps/scrumboard/board/dialogs/card/card.component';

@Component({
    selector: 'list-of-date',
    templateUrl: './list-of-date.component.html',
    styleUrls: ['./list-of-date.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListOfDateComponent implements OnInit, OnDestroy {
    listOfDate: any;
    dialogRef: any;

    @Input()
    list;

    @ViewChild(FusePerfectScrollbarDirective)
    listScroll: FusePerfectScrollbarDirective;

    @ViewChild(EditListOfDateComponent) 
    child: EditListOfDateComponent; 

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {ScrumboardService} _scrumboardService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _listService: ListService,
        private _matDialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._listService.onListOfDateChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(listOfDate => {
                this.listOfDate = listOfDate;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

  
    onListNameChanged(newListName): void {
        this.list.in_date = newListName;
    }

    editList(): void {
        this.child.openForm();
    }

    removeListOfDate(listId): void {

        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'ต้องการลบข้อมูล?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._listService.removeListOfDate(listId);

            }
        });
    }

    onDrop(ev): void {
        this._listService.updateListOfDate();
    }
}
