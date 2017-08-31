import { Injectable } from '@angular/core';
import { APILinker } from './APILinker.service';

import { User } from '../models/user.model';

@Injectable()
export class SessionManager {

    private login: string;
    private password: string;
    private api_key: string;

    constructor(private linker:APILinker) {
        this.login = "";
        this.api_key = "";
    }
    
    isLogged(): boolean {
        return this.api_key != "";
    }
    
    getLogin(): string {
        return this.login;
    }
    
    getPassword(): string {
        return this.password;
    }
    
    Logout(): void {
        this.login = "";
        this.password = "";
        this.api_key = "";
        this.clearCredentials();
    }
    
    Register(email: string, password: string, name: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.linker.register(email, password, name).then(response => {
                console.log(response);
                try
                {
                    if (response['email'])
                    {
                        resolve(true);
                    }
                    else
                    {
                        resolve(false);
                    }
                    
                }
                catch (e)
                {
                    resolve(false);
                }
            }).catch((e) => {resolve(false);});
        });
    }
    
    Login(email: string, password: string): Promise<boolean> {
        this.login = email;
        this.password = password;
        return new Promise((resolve, reject) => {
            this.linker.login(email, password).then(response => {
                console.log(response);
                try
                {
                    if (response['token'])
                    {
                        this.api_key = response['token'];
                        this.SaveCredentials();
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
    
    // WAITING FOR API
    /*RetrieveUser(): Promise<boolean> {
        
    }*/
    
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
