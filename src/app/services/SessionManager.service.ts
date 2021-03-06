import { Injectable } from '@angular/core';
import { APILinker } from './APILinker.service';

import { User } from '../models/user.model';

@Injectable()
export class SessionManager {

    private login: string;
    private password: string;
    private api_key: string;

    private user: User;
    
    constructor(private linker:APILinker) {
        this.login = "";
        this.api_key = "";
        this.password = "";
        this.user = null;
    }
    
    isLogged(): boolean {
        return this.api_key != "";
    }
    
    getApiKey(): string {
        return this.api_key;
    }
    
    getLogin(): string {
        return this.login;
    }
    
    getPassword(): string {
        return this.password;
    }
    
    getId(): number {
        if (!this.isLogged())
            return -1;
        return JSON.parse(atob(this.api_key.split(".")[1]))["uid"];
    }
    
    getUser() : User {
        return this.user;
    }
    
    Logout(): void {
        this.login = "";
        this.password = "";
        this.api_key = "";
        this.user = null;
        this.clearCredentials();
    }
    
    checkToken(): Promise<boolean> {
        if (!this.isLogged()) {
            return new Promise((resolve, reject) => { reject(false); });
        } else {
            let token_date = new Date(JSON.parse(atob(this.api_key.split(".")[1]))["exp"] * 1000);
            let current_date = new Date();
            if (token_date < current_date) {
                return this.Login(this.login, this.password);
            } else {
                return new Promise((resolve, reject) => { resolve(true); });
            }
        }
    }
    
    Register(email: string, password: string, name: string): Promise<[boolean, string]> {
        return new Promise((resolve, reject) => {
            this.linker.register(email, password, name).then(response => {
                console.log('Register');
                console.log(response);
                try
                {
                    if (response['email'])
                    {
                        resolve([true, "Success"]);
                    }
                    else
                    {
                        if (response['description'])
                            resolve([false, response['description']]);
                        else
                            resolve([false, "Please contact an administrator"]);
                    }
                    
                }
                catch (e)
                {
                    resolve([false, "Please contact an administrator"]);
                }
            }).catch((e) => {
                if (e.json() && e.json()['description'])
                    resolve([false, e.json()['description']]);
                else
                    resolve([false, "Please contact an administrator"]);
            });
        });
    }
    
    Login(email: string, password: string): Promise<boolean> {
        this.login = email;
        this.password = password;
        return new Promise((resolve, reject) => {
            this.linker.login(email, password).then(response => {
                console.log('Login');
                console.log(response);
                try
                {
                    if (response['token'])
                    {
                        this.api_key = response['token'];
                        this.SaveCredentials();
                        this.RetrieveUser();
                        resolve(true);
                    }
                    else
                    {
                        this.clearCredentials();
                        resolve(false);
                    }
                    
                }
                catch (e)
                {
                    this.clearCredentials();
                    resolve(false);
                }
            }).catch((e) => {resolve(false);});
        });
    }
    
    RetrieveUser(): boolean {
        if (!this.isLogged())
            return false;
        this.linker.getUser(this.getId()).then((response) => {
            this.user = response;
            return true;
        }).catch((error) => {
            console.log('Session Manager: coudn\'t retrieve user');
            return false;
        });
    }
    
    private LC_loginKey = 'TC_login';
    private LC_passwordKey = 'TC_pass';
    private LC_apiKey = 'TC_api';

    private clearCredentials(): void {
        localStorage.removeItem(this.LC_loginKey);
        localStorage.removeItem(this.LC_passwordKey);
        localStorage.removeItem(this.LC_apiKey);
    }
    
    private SaveCredentials(): Boolean {
        if (this.isLogged()) {
            localStorage.setItem(this.LC_loginKey, this.login);
            localStorage.setItem(this.LC_passwordKey, this.password);
            localStorage.setItem(this.LC_apiKey, this.api_key);
            return true;
        }
        return false;
    }
    
    public retrieveCredentials(): Boolean {
        let tmp_login: string = localStorage.getItem(this.LC_loginKey);
        let tmp_pass: string = localStorage.getItem(this.LC_passwordKey);
        let tmp_apikey: string = localStorage.getItem(this.LC_apiKey);
        
        if (tmp_login && tmp_pass && tmp_apikey && tmp_login != 'undefined' && tmp_pass != 'undefined' && tmp_apikey != 'undefined' && tmp_login != 'null' && tmp_pass != 'null' && tmp_apikey != 'null') {
            this.login = tmp_login;
            this.password = tmp_pass;
            this.api_key = tmp_apikey;
            return true;
        }
        return false;
    }
}
