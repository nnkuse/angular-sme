import { fuseAnimations } from '@fuse/animations';
import { AddDialogComponent } from './dialogs/add/add.dialog.component';
import { FuseUtils } from './../../../../../@fuse/utils/index';
import { Observable } from 'rxjs/observable';
import { DataSource } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ListsService } from './lists.service';
import { Subject, BehaviorSubject, merge, fromEvent } from 'rxjs';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Lists } from './../models/lists';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  animations: fuseAnimations
})
export class ListsComponent implements OnInit, AfterViewChecked {

  lists: Lists;

  dataSource: FilesDataSource | null;
  displayedColumns = ['list_name', 'agency', 'start_date', 'end_date', 'net_income'];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  @ViewChild('filter')
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _listsService: ListsService,
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private _changeDetectorRefs: ChangeDetectorRef
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRefs.detectChanges();
  }

  addNew(): void {
    this.lists = new Lists();
    this.dialog.open(AddDialogComponent, {
      data: { lists: this.lists }
    }).afterClosed().subscribe(result => {
      if (result === 1) {
        this.loadData();
        this._changeDetectorRefs.detectChanges();
      }
    });
  }

  public loadData(): void {
    this.dataSource = new FilesDataSource(this._listsService, this.paginator, this.sort, this._route);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}

export class FilesDataSource extends DataSource<Lists>
{
  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(
    private _listsService: ListsService,
    public _matPaginator: MatPaginator,
    private _matSort: MatSort,
    private _route: ActivatedRoute,
  ) {
    super();
    this._filterChange.subscribe(() => this._matPaginator.pageIndex = 0);
    this.filteredData = this._listsService.lists;
    this.filteredData = this._route.snapshot.data;
  }

  connect(): Observable<Lists[]> {
    const displayDataChanges = [
      this._listsService.onListsChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return Observable.merge(...displayDataChanges)
      .pipe(
        map(() => {
        let data = this._listsService.lists.slice();

          data = this.filterData(data);

          this.filteredData = [...data];

          data = this.sortData(data);

          // Grab the page's slice of data.
          const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
          return data.splice(startIndex, this._matPaginator.pageSize);
        }
        ));
  }

  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  // Filter
  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filterData(data): any {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[] {
    if (!this._matSort.active || this._matSort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._matSort.active) {
        case 'list_name':
          [propertyA, propertyB] = [a.list_name, b.list_name];
          break;
        case 'agency':
          [propertyA, propertyB] = [a.agency, b.agency];
          break;
        case 'start_date':
          [propertyA, propertyB] = [a.start_data, b.start_date];
          break;
        case 'end_date':
          [propertyA, propertyB] = [a.end_date, b.end_date];
          break;
        case 'net_income':
          [propertyA, propertyB] = [a.net_income, b.net_income];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect(): void {
  }
}
