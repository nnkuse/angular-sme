import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ListDetail } from '../../models/listDetail';
import { ApiUrl } from '../../../../../services/api';

@Injectable()
export class ListDetailService implements Resolve<any>
{
    detail: any;
    detailOnChanged: BehaviorSubject<any>;
    routeParams: any;

    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.detailOnChanged = new BehaviorSubject({});
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getListDetail()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getListDetail(): Promise<any[]> {
        // console.log(this.routeParams.list_item_id, this.routeParams.id);
        return new Promise((resolve, reject) => {
            this._httpClient.get<any>(`${ApiUrl.api_url}/listitems/` 
                + this.routeParams.list_item_id + '/listofdates/' + this.routeParams.id + '/listdetails')
                .subscribe((resDetail: any) => {
                    this.detail = resDetail.data;
                    // console.log(this.detail);
                    this.detailOnChanged.next(this.detail);
                    resolve(this.detail);
                }, reject);
        });
    }

    addDetail(data): Promise<any> {
        const body = {
            list_detail_name: data.detail.list_detail_name,
            in_come: data.detail.in_come,
            expense: data.detail.expense
        };
        console.log(data.detail);
        return new Promise((resolve, reject) => {
            this._httpClient.post<any>(`${ApiUrl.api_url}/listitems/`
                + this.routeParams.list_item_id + '/listofdates/' + this.routeParams.id + '/listdetails', body)
                .subscribe((response: any) => {
                    console.log(response);
                    resolve(response);
                }, reject);
        }).then(() => {
            this.updateListOfDate();
        });
    }

    editDetail(data): Promise<any> {
        const body = {
            list_detail_name: data.detail.list_detail_name,
            in_come: data.detail.in_come,
            expense: data.detail.expense
        };
        // console.log(this.routeParams.list_item_id, this.routeParams.id, data.detail.id);
        // console.log(body);
        return new Promise((resolve, reject) => {
            this._httpClient.put<any>(`${ApiUrl.api_url}/listitems/`
                + this.routeParams.list_item_id + '/listofdates/' + this.routeParams.id + '/listdetails/' + data.detail.id, body)
                .subscribe((response: any) => {
                    // console.log(response);
                    resolve();
                }, reject);
        }).then(() => {
            this.updateListOfDate();
        });
    }

    removeDetail(data): Promise<any> {
        console.log(this.routeParams.list_item_id, this.routeParams.id, data.detail.id);
        return new Promise((resolve, reject) => {
            this._httpClient.delete<any>(`${ApiUrl.api_url}/listitems/`
                + this.routeParams.list_item_id + '/listofdates/' + this.routeParams.id + '/listdetails/' + data.detail.id)
                .subscribe((response: any) => {
                    console.log(response);
                    resolve();
                }, reject);
        }).then(() => {
            this.updateListOfDate();
        });
    }

    updateListOfDate(): Promise<any> {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getListDetail()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }
}
