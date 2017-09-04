// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as io from 'socket.io-client';
import { ChatMessage } from '../../models/chat.model';

import * as $ from 'jquery';

import { SessionManager } from '../../services/SessionManager.service';
import { APILinker } from '../../services/APILinker.service';
import { FileSystemLinker } from '../../services/FileSystemLinker.service';

@Component({
  selector: 'component-streamLayout',
  templateUrl: './live.html',
  styleUrls: ['./live.css', '../../app.component.css'],
})
export class LiveComponent implements OnInit, OnDestroy {

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router, private linker:APILinker)
    {
    }

    ngAfterViewInit(){
    }
        
    public live: boolean = false;
    public InputStreamTitle: String;
    public InputStreamDescription: String;
    
    public chatMessages: ChatMessage[];
    
    public sendChatMessage(content: string) {
    }
    
    checkLive(response:any) {
        for (let stream of response)
        {
            if (stream.owner.id == this.sm.getId())
                this.live = true;
        }
    }
    
    goLive() {
        if (!this.InputStreamTitle || this.InputStreamTitle.length < 4)
            return;
        if (!this.InputStreamDescription || this.InputStreamDescription.length < 4)
            return;
        this.sm.checkToken().then((response) => {
            if (response == true) {
                this.linker.createStream(this.sm.getApiKey(), this.InputStreamTitle, this.InputStreamDescription, "FRA").catch((error) => {
                    if (error["status"] == 401) {
                        this.sm.Login(this.sm.getLogin(), this.sm.getPassword()).then((resp) => {
                            if (resp == true) {
                                this.goLive();
                            }
                        });
                    }
                });
                this.live = true;
            } else {
                console.log("Please relog");
            }
        }).catch((response) => { console.log("not logged"); });
    }
    
    liveOff() {
        this.sm.checkToken().then((response) => {
            if (response == true) {
                var streamId: string = "";
                this.linker.getStreams().then((response_stream) => {
                    for (let stream of response_stream)
                    {
                        if (stream.owner.id == this.sm.getId())
                        {
                            this.linker.deleteStream(this.sm.getApiKey(), String(stream.id));
                            this.live = false;
                        }
                    }
                });
            } else {
                console.log("Please relog");
            }
        }).catch((response) => { console.log("not logged"); });
    }
    
    ngOnInit() {
        this.linker.getStreams().then(response => {
            this.checkLive(response);
        });        
    }
    
    ngOnDestroy() {
    }
}
