// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as io from 'socket.io-client';
import { ChatMessage } from '../../models/chat.model';

import * as $ from 'jquery';

enum LayeringMode {
    OneTwo = 1,
    OneOneOne,
    TwoOne
}

import { SessionManager } from '../../services/SessionManager.service';
import { FileSystemLinker } from '../../services/FileSystemLinker.service';

@Component({
  selector: 'component-streamLayout',
  templateUrl: './live.html',
  styleUrls: ['./live.css', '../../app.component.css'],
})
export class LiveComponent implements OnInit, OnDestroy {

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router)
    {
    }

    ngAfterViewInit(){
    }
    
    
    layeringMode: LayeringMode = LayeringMode.OneTwo;
    
    private sendChatMessage(content: string) {
    }
    
    ngOnInit() {
    }
    
    ngOnDestroy() {
    }
}
