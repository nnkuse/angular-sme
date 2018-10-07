import { Component, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { ListService } from './list.service';
import { Lists } from './../models/lists';
import { ListOfDate } from './../models/listOfDate';

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

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _listService: ListService,
    private _changeDetectorRefs: ChangeDetectorRef,
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

  }

  removeList(): void {
    this._listService.removeList();
  }

  onDrop(ev): void {
    this._listService.updateListOfDate();
  }
}
