import * as Rx from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { User } from '../models/user.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FileSystemLinker {
    private FILESERVEUR_ADDR: string = "ws://file.twicecast.ovh:3005/";
    private PROTOCOL: string = "";
    
    private socket: any;
    
    public connect(): Promise<boolean> {
        if (this.socket != null)
            this.disconnect();
        this.socket = new WebSocket(this.FILESERVEUR_ADDR);
        return new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.onmessage = this.message.bind(this);
                this.socket.onopen = function() {
                    console.log("connected to FS");
                    resolve(true);
                };
            } else {
                resolve(false);
            }
        });
    }
    
    private message(data: any) {
        console.log(data);
    }
    
    public auth(token: String) {
        let authrequest: object = {
            "type":"authenticate",
            "data": {
                "token": token
            }
        };
        this.socket.send(JSON.stringify(authrequest));
        this.socket.send('BONJOUR');
        console.log(authrequest);
    }
    
    public disconnect() {
        this.socket.close();
        this.socket = null;
    }

    constructor() { }
}
