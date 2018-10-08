import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

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
                this.getListOfDetail()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getListOfDetail(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this._httpClient.get<any>(`${environment.api_url}/listitems/` 
                + this.routeParams.list_item_id + '/listofdates/' + this.routeParams.id + '/listdetails')
                .subscribe((resDetail: any) => {
                    this.detail = resDetail;
                    console.log(this.detail);
                    this.detailOnChanged.next(this.detail);
                    resolve(this.detail);
                }, reject);
        });
    }
}
