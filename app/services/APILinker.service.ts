import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { User } from '../models/user.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class APILinker {
    private API_URL: string = "https://twicecast.ovh/";

    constructor(private http: Http) { }
    
    login(email: string, password: string): Promise<string> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let data = {'email': email, 'password': password};
        return this.http.post(this.API_URL + "login", JSON.stringify(data), options)
                        .toPromise()
                        .then((response) => {
                            return response.json();
                        })
                        .catch(this.handleError);
    }
    
    getUsers(): Promise<User[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + "users", options)
                        .toPromise()
                        .then((response) => {
                            var res : User[] = [];
                            for (let user of response.json()["user_list"])
                            {
                                res.push(new User().deserialize(user));
                            }
                            return res;
                        })
                        .catch(this.handleError);
    }
    
    getUser(id: any): Promise<User> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + "users/" + id, options)
                        .toPromise()
                        .then(response => new User().deserialize(response.json()) as User)
                        .catch(this.handleError);
    }
    
    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
