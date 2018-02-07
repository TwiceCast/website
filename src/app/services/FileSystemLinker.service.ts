import * as Rx from 'rxjs/Rx';
import { Injectable, EventEmitter, Output } from '@angular/core';

import { User } from '../models/user.model';
import { File } from '../models/file.model';

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
    @Output('ReceivedFile') ReceivedFile: EventEmitter<string> = new EventEmitter(false);
    @Output('DeletedFile') DeletedFile: EventEmitter<string> = new EventEmitter(false);
    
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
            if (this.AuthStateChanged != null)
                this.AuthStateChanged.emit(this.authStatus);
        } else if (response.code == 200 && response.type == "fileGet") {
            this.ReceivedFile.emit(response.data);
        } else if (response.code == 200 && response.type == "fileDeleted") {
            this.DeletedFile.emit(response.data);
        } else if (response.code == 400 && response.type == "badParametersError" && response.message == "The streamer is not connected or the project is wrong") {
            if (this.AuthStateChanged != null)
                this.AuthStateChanged.emit(this.authStatus);
        } else {
            console.error(response);
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
    }
    
    public pullRequest(title: string, desc: string, files: File[]) {
        if (files.length > 0) {
            this.pullRequestCreate(title, desc);

            let i = 0;
            while (i < files.length) {
                this.pullRequestSendFile(files[i]);
                ++i;
            }

            this.pullRequestValidate();
        }
    }

    private pullRequestCreate(title: string, desc: string) {
        let prRequest: object = {
            "type": "pullrequest",
            "subtype": "creation",
            "data": {
                "title": title,
                "description": desc
            }
        };
        this.socket.send(JSON.stringify(prRequest));
        console.log('Pull Request "' + title + '" created');
    }

    private pullRequestSendFile(file: File) {
        console.log('sending file..' + file.name);
        let to_send: string = file.content;

        let prRequest: object = {
            "type": "file",
            "subtype": "post",
            "data": {
                "name": file.realName,/*PATH*/
                "content": btoa(to_send)
            }
        };

        this.socket.send(JSON.stringify(prRequest));
    }

    private pullRequestValidate() {
        let prRequest: object = {
            "type": "pullrequest",
            "subtype": "finish"
        };
        this.socket.send(JSON.stringify(prRequest));
        console.log('Pull Request validated');
    }

    public disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    constructor() { }
}
