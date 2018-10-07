import { ListOfDate } from './../models/listOfDate';
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Lists } from '../models/lists';

@Injectable()
export class ListService implements Resolve<any>
{
  routeParams: any;
  list: any;
  onListChanged: BehaviorSubject<any>;
  onListOfDateChanged: BehaviorSubject<any>;

  listOfDate: any;

  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private _location: Location,
    private _router: Router,
  ) {
    // Set the defaults
    this.onListChanged = new BehaviorSubject({});
    this.onListOfDateChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getList(),
        this.getListOfDate()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<any>(`${environment.api_url}/listitems/` + this.routeParams.id)
        .subscribe((response: any) => {
          if (response === null) {
            resolve();
            this._router.navigate(['/apps/sme/lists']);
          } else {
            this.list = response.data[0];
            this.onListChanged.next(this.list);
            resolve(response);
          }
        }, reject);
    });
  }

  editList(data: Lists): Promise<any> {
    const body = {
      list_name: data.list_name,
      agency: data.agency,
      start_date: moment(data.start_date).format('YYYY-MM-DD'),
      end_date: moment(data.end_date).format('YYYY-MM-DD')
    };
    return new Promise((resolve, reject) => {
      this._httpClient.put<any>(`${environment.api_url}/listitems/` + this.routeParams.id, body)
      .subscribe(() => {
        resolve();
      }, reject);
    }).then(() => {
      this.updateListOfDate();
    });
  }

  getListOfDate(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<any>(`${environment.api_url}/listitems/` + this.routeParams.id + '/listofdates')
        .subscribe((response: any) => {
          this.listOfDate = response.data;
          this.onListOfDateChanged.next(this.listOfDate);
          resolve(response);
        }, reject);
    });
  }

  removeList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.delete(`${environment.api_url}/listitems/` + this.routeParams.id)
      .subscribe(res => {
        // console.log(res);
        this._router.navigate(['/apps/sme/lists']);
      });
    });
  }

  addListOfDate(newList): Promise<any> {
    this.listOfDate = newList;
    const body = {
      list_item_id: this.routeParams.id,
      in_date: moment(this.listOfDate).format('YYYY-MM-DD')
    };
    return new Promise((resolve, reject) => {
      this._httpClient.post<any>(`${environment.api_url}/listitems/` + this.routeParams.id + '/listofdates', body)
        .subscribe((response: any) => {
          console.log(response);
          resolve(response);
        }, reject);
    }).then(() => {
      this.updateListOfDate();
    });
  }

  editListOfDate(listOfDateID, inDate): Promise<any> {
    const body = {
      in_date: inDate
    };
    return new Promise((resolve, reject) => {
      this._httpClient.put<any>(`${environment.api_url}/listitems/` + this.routeParams.id + '/listofdates/' + listOfDateID, body)
      .subscribe(res => {
        this.updateListOfDate();
      });
    });
  }

  removeListOfDate(listOfDateID): void {
    this._httpClient.delete(`${environment.api_url}/listitems/` + this.routeParams.id + '/listofdates/' + listOfDateID)
      .subscribe(res => {
        this.updateListOfDate();
      });
  }

  updateListOfDate(): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getList(),
        this.getListOfDate()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }
}
