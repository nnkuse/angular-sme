import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../interfaces/user';
import { of as observableOf } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient, private router: Router) { }

  getUsers(): Observable<User> {
    return observableOf(localStorage.getItem('uid') ? JSON.parse(atob(localStorage.getItem('uid'))) : null);
  }

  check(): boolean {
    return localStorage.getItem('uid') ? true : false;
  }

  doLogin(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${environment.api_url}/auth/login`, { email: email, password: password })
      .do(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('uid', btoa(JSON.stringify(data.user)));
      });
  }

  doLogout(): void {
    this.http.get<any>(`${environment.api_url}/auth/logout`).subscribe(
      res => {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      }
    );
  }

  setUser(): void {
    this.http.get<any>(`${environment.api_url}/auth/me`)
    .subscribe(data => {
        localStorage.setItem('uid', btoa(JSON.stringify(data.user)));
      });
  }

  waitUserResponse(): Promise<Observable<User>> {
    return new Promise(resolve => {
      this.setUser();
      setTimeout(() => {
        resolve(this.getUsers());
      }, 1000);
    });
  }
}
