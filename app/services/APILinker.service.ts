import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { User } from '../models/user.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class APILinker {
    private API_URL: string = "http://37.187.99.70/";

    constructor(private http: Http) { }
    
    getUsers(): Promise<User[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + "users", options)
                        .toPromise()
                        .then(response => response.json() as User[])
                        .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
