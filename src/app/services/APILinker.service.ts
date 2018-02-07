import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { User } from '../models/user.model';
import { Stream } from '../models/stream.model';
import { Tag } from '../models/tag.model';

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

    forgot(email: string): Promise<string> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        let data = {'email': email};
        return this.http.post(this.API_URL + 'users/passwordreset', JSON.stringify(data), options)
                        .toPromise()
                        .then((response) => {
                            return response.json();
                        })
                        .catch(this.handleError);
    }

    reset(token: string, new_password: string): Promise<string> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        let data = {'password': new_password};
        return this.http.post(this.API_URL + 'users/passwordreset/' + token, JSON.stringify(data), options)
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
        return this.http.get(this.API_URL + 'users/' + id.toString(), options)
                        .toPromise()
                        .then((response) => {
                            return new User().deserialize(response.json());
                        })
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

    getStream(id: number): Promise<Stream> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'streams/' + id, options)
                        .toPromise()
                        .then((response) => {
                            return new Stream().deserialize(response.json());
                        })
                        .catch(this.handleError);
    }

    addUserPremium(id: number, duration: number, token: string): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'users/prenium/add?USER=' + id + '&DURATION=' + duration, options)
                        .toPromise()
                        .then((response) => {
                            return response;
                        })
                        .catch(this.handleError);
    }

    getUserPremium(id: number, token: string): Promise<any> {
        let headers: Headers;
        if (token != null)
            headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        else
            headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'users/' + id + '/prenium', options)
                        .toPromise()
                        .then((response) => {
                            return response;
                        })
                        .catch(this.handleError);
    }

    getTags(): Promise<Tag[]> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'tags/', options)
                        .toPromise()
                        .then((response) => {
                            let res : Tag[] = [];
                            for (let tag of response.json()["tag_list"])
                            {
                                res.push(new Tag().deserialize(tag));
                            }
                            return res;
                        })
                        .catch(this.handleError);
    }

    getRepository(token: any, id: number): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'application/json',
                                    'Authorization': token});
        const options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_URL + 'streams/' + id + '/repository', options)
                        .toPromise()
                        .then((response) => {
                            return response;
                        })
                        .catch(this.handleError);
    }

    createStream(token:any, title:any, description: any, language:any, tags:any): Promise<any> {
        let data = {
            'title': title,
            'short_description': description,
            'lang': language,
            'private': false,
            'tags': tags
        }
        const headers = new Headers({ 'Content-Type': 'application/json',
                                    'Authorization': token});
        const options = new RequestOptions({ headers: headers });

        return this.http.post(this.API_URL + 'streams', JSON.stringify(data), options)
                        .toPromise()
                        .then((response) => {
                            return (response);
                        })
                        .catch(this.handleError);
    }

    setStreamCover(token:any, id:number, cover:any): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'image/png',
                                    'Authorization': token});
        const options = new RequestOptions({headers: headers});
        return this.http.put(this.API_URL + 'streams/' + id + '/cover', cover, options)
                        .toPromise()
                        .then((response) => {
                            return (response);
                        })
                        .catch(this.handleError);            
    }

    deleteStream(token:any, id: any): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'application/json',
                                     'Authorization': token});
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(this.API_URL + 'streams/' + id, options)
                        .toPromise()
                        .then((response) => {
                            return (response);
                        })
                        .catch(this.handleError);
    }

    changePassword(token:any, id:any, password:any): Promise<any> {
        let data = {
        'password' : password
        };
        const headers = new Headers({ 'Content-Type': 'application/json',
                                    'Authorization': token});
        const options = new RequestOptions({headers: headers});
        return this.http.patch(this.API_URL + 'users/' + id, JSON.stringify(data), options)
                        .toPromise()
                        .then((response) => {
                            return (response);
                        })
                        .catch(this.handleError);
    }

    changeAvatar(token:any, id:any, picture:any): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'image/png',
                                    'Authorization': token});
        const options = new RequestOptions({headers: headers});
        return this.http.put(this.API_URL + 'users/' + id + '/avatar', picture, options)
                        .toPromise()
                        .then((response) => {
                            return (response);
                        })
                        .catch(this.handleError);        
    }
    
    patchUser(token:any, id:any, infos:any): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'application/json',
                                    'Authorization': token});
        const options = new RequestOptions({ headers: headers });
        return this.http.patch(this.API_URL + 'users/' + id, JSON.stringify(infos), options)
                        .toPromise()
                        .then((response) => {
                            return response.json();
                        })
                        .catch(this.handleError);        
    }
    
    removeUser(token:any, id:any): Promise<any> {
        const headers = new Headers({ 'Content-Type': 'application/json',
                                    'Authorization': token});
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(this.API_URL + 'users/' + id, options)
                        .toPromise()
                        .then((response) => {
                            return response.json();
                        })
                        .catch(this.handleError);        
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
