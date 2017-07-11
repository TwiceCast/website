import { Injectable } from '@angular/core';

@Injectable()
export class SessionManager {

    private login: string;
    private api_key: string;

    constructor() {
        this.login = "";
        this.api_key = "";
    }
    
    Login(): boolean {
        return false;
    }
}
