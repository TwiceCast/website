import * as Rx from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { User } from '../models/user.model';

import 'rxjs/add/operator/toPromise';

import { APILinker } from './APILinker.service';

@Injectable()
export class FileSystemLinker {
    private FILESERVEUR_ADDR: string = "ws://repository.twicecast.ovh:3006/";
    private PROTOCOL: string = "";
    
    private socket: any;
    
    public connect(url: string): Promise<boolean> {
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
    
    public auth(token: string, username: string, streamer: string, stream_name: string) {
        
        let authrequest: object = {
            "type":"authenticate",
            "data": {
                "pullrequest" : {
                    "username" : username,
                    "streamer" : streamer,
                    "project" : stream_name
                },
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
