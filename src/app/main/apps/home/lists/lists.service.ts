import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lists } from '../models/lists';
import * as moment from 'moment';

@Injectable()
export class ListsService implements Resolve<Lists[]>
{
  lists: any[];
  onListsChanged: BehaviorSubject<any>;

  dataChange: BehaviorSubject<Lists[]> = new BehaviorSubject<Lists[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient
  ) {
    // Set the defaults
    this.onListsChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Lists[]> | Promise<Lists[]> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getLists()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }
  
  getLists(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<Lists[]>(`${environment.api_url}/listitems`)
        .subscribe((response: any) => {
          this.lists = response.data;
          this.onListsChanged.next(this.lists);
          resolve(response);
        }, reject);
    });
  }

  // ADD, POST METHOD
  addList(lists: Lists): Promise<any> {
    this.dialogData = lists;
    const body = {
      list_name: this.dialogData.list_name,
      agency: this.dialogData.agency,
      start_date: moment(this.dialogData.start_date).format('YYYY-MM-DD'),
      end_date: moment(this.dialogData.end_date).format('YYYY-MM-DD')
    };
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(`${environment.api_url}/listitems`, body)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    }).then(() => {
      return new Promise((resolve, reject) => {
        Promise.all([
          this.getLists()
        ]).then(() => {
            resolve();
          }, reject);
      });
    });
  }

}
