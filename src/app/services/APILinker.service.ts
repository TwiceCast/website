import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { User } from '../models/user.model';
import { Stream } from '../models/stream.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class APILinker {
    private API_URL = 'https://api.twicecast.ovh/';

    constructor(private http: Http) { }

    login(email: string, password: string): Promise<string> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        let data = {'email': email, 'password': password};
        return this.http.post(this.API_URL + 'login', JSON.stringify(data), options)
                        .toPromise()
                        .then((response) => {
                            return response.json();
                        })
                        .catch(this.handleError);
    }

    register(email: string, password: string, name: string) {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        let data = {
            'name': name,
            'email': email,
            'password': password,
            'language': {
                'code': 'FRA'
            }
        };
        return this.http.post(this.API_URL + 'users', JSON.stringify(data), options)
                        .toPromise()
                        .then((response) => {
                            return response.json();
                        })
                        .catch(this.handleError);
    }

    getUsers(): Promise<User[]> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'users', options)
                        .toPromise()
                        .then((response) => {
                            let res : User[] = [];
                            for (let user of response.json()["user_list"])
                            {
                                res.push(new User().deserialize(user));
                            }
                            return res;
                        })
                        .catch(this.handleError);
    }

    getUser(id: number): Promise<User> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'users/' + id, options)
                        .toPromise()
                        .then(response => new User().deserialize(response.json()) as User)
                        .catch(this.handleError);
    }

    getStreams(): Promise<Stream[]> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'streams', options)
                        .toPromise()
                        .then((response) => {
                            let res : Stream[] = [];
                            for (let stream of response.json()["stream_list"])
                            {
                                res.push(new Stream().deserialize(stream));
                            }
                            return res;
                        })
                        .catch(this.handleError);
    }

    createStream(id:any, title:any, language:any): Promise<any> {
        let data = {
            'id': id,
            'title': title,
            'lang': 'FRA',
            'private': false,
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(this.API_URL + 'streams/' + id, JSON.stringify(data), options)
                        .toPromise()
                        .then((response) => {
                            return (response);
                        })
                        .catch(this.handleError);
    }

    
    deleteStream(id: any): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(this.API_URL + 'streams/' + id, options)
                        .toPromise()
                        .then((response) => {
                            return (response);
                        })
                        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
