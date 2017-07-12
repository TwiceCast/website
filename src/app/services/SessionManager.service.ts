import { Injectable } from '@angular/core';
import { APILinker } from './APILinker.service';

@Injectable()
export class SessionManager {

    private login: string;
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
    
    Logout(): void {
        this.login = "";
        this.api_key = "";
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
        return new Promise((resolve, reject) => {
            this.linker.login(email, password).then(response => {
                console.log(response);
                try
                {
                    if (response['token'])
                    {
                        this.api_key = response['token'];
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
}
