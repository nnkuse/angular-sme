import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { ListService } from './list.service';
import { Lists } from './../models/lists';
import { ListOfDate } from './../models/listOfDate';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EditDialogComponent } from './edit-list/edit.dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ListComponent implements OnInit, OnDestroy, AfterViewChecked {
  list: Lists;
  listOfDate: any;
  pageType: string;
  listForm: FormGroup;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _listService: ListService,
    private _changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private _matDialog: MatDialog,
  ) {
    // Set the default
    this.list = new Lists();

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to update product on changes
    this._listService.onListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(list => {
        this.list = new Lists(list);
      });

    this._listService.onListOfDateChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(listOfDate => {
        this.listOfDate = listOfDate;
      });
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRefs.detectChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  addListOfDate(newListName): void {
    if (newListName === '') {
      return;
    }
    this._listService.addListOfDate(new ListOfDate({ in_date: newListName }));
  }

  editList(): void {
    this.dialog.open(EditDialogComponent, {
      data: { list: this.list }
    }).afterClosed().subscribe(result => {
      if (result === 1) {
        this._changeDetectorRefs.detectChanges();
      }
    })
  }

  removeList(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'ต้องการลบ ' + this.list.list_name + ' ?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._listService.removeList();
      }
    });
  }

  onDrop(ev): void {
    this._listService.updateListOfDate();
  }
}
