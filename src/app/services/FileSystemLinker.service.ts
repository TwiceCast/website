import * as Rx from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { User } from '../models/user.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FileSystemLinker {
    private FILESERVEUR_ADDR: string = "ws://localhost:3005/";
    private PROTOCOL: string = "";
    
    private socket: any;
    
    public connect() {
        if (this.socket != null)
            this.disconnect();
        this.socket = new WebSocket(this.FILESERVEUR_ADDR);
    }
    
    public auth() {
        var authrequest: object = {
            "type":"file",
            "subtype":"auth",
            "data": {
                "username": "Streamers username",
                "project":"Streamers project"
            }
        };
        
        console.log(authrequest);
    }
    
    public disconnect() {
        this.socket.close();
        this.socket = null;
    }

    constructor() { }
}
