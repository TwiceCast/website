// Imports
import { Component, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import * as $ from 'jquery';

import { SessionManager } from '../../../services/SessionManager.service';
import { ChatService } from '../../../services/ChatService.service';

@Component({
  selector: 'component-standaloneChat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css', '../../../app.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
	@ViewChild('chat') chat;
    private id: number;
    private sub: any;
	private disableScrollDown = false;

    public chatService: ChatService;

    constructor(private sm:SessionManager, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        // Get Stream ID
        this.sub = this.route.params.subscribe(params => { this.id = params['id'] });

        ///
        /// Init chat system
        ///
        this.chatService = new ChatService('#newChatMessage', '#sendChat', this.sm);
        this.chatService.Init(this.id);
    }

    ngAfterViewChecked() {
        $('nav').remove();
        $('footer').remove();
        if (!this.disableScrollDown) {
			this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
        }
	}

    ngOnDestroy() {
        this.chatService.Destroy();
        this.sub.unsubscribe();
        window.onresize = undefined;
    }
}
