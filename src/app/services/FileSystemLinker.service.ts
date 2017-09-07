import * as Rx from 'rxjs/Rx';
import { Injectable, EventEmitter, Output } from '@angular/core';

import { User } from '../models/user.model';

import 'rxjs/add/operator/toPromise';

import { APILinker } from './APILinker.service';

@Injectable()
export class FileSystemLinker {
    private FILESERVEUR_ADDR: string = "ws://repository.twicecast.ovh:3006/";
    private PROTOCOL: string = "";
    
    private socket: any;
    
    /*
    ** Usual parameters
    */
    private username: string;
    private project: string;
    private streamer: string;
    private project_token: string;
    
    /*
    ** Events
    */
    @Output('AuthStateChanged') AuthStateChanged: EventEmitter<boolean> = new EventEmitter(false);
    
    /*
    ** States
    */
    private authStatus: boolean = false;
    
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
        var response = JSON.parse(data["data"]);
        if (response.code == 200 && response.type == "pullRequestAuth") {
            this.authStatus = true;
            this.AuthStateChanged.emit(this.authStatus);
        } else {
            console.log(response);
        }
    }
    
    public isAuth(): boolean {
        return this.authStatus;
    }
    
    public getFiles() {
        let getfilerequest: object = {
            "type":"file",
            "subtype":"get",
            "data": {
                "username": this.streamer,
                "project": this.project,
                "name": "/",
                "recursively": true 
            }
        };
        
        this.socket.send(JSON.stringify(getfilerequest));
    }
    
    public auth(token: string, username: string, streamer: string, stream_name: string) {
        this.username = username;
        this.streamer = streamer;
        this.project = stream_name;
        this.project_token = token;
        
        
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
        console.log(authrequest);
    }
    
    public disconnect() {
        this.socket.close();
        this.socket = null;
    }

    constructor() { }
}
