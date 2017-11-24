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

    private chatColors = [
        '#338dc7',
        '#06a806',
        '#993baf',
        '#bebe52',
        '#edcc8f',
        '#60e2b4'
    ];

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

    getDisplayImage(msg: any) {
        if (msg.rank == 0) {
            return 'assets/icon-chomp.png';
        } else if (msg.rank == 1) {
            return 'assets/icon-redshell.png';
        }
        return null;
    }

    getPseudoColorValue(data: string): number {
        let result = 0;
        for (let l of data) {
            result += +l.charCodeAt(0);
        }
        return result;
    }

    getColor(author: string): string {
        if (author == "") {
            return 'rgba(0, 0, 0, 0.28)';
        } else if (author != this.sm.getLogin()) {
            let colorValue = this.getPseudoColorValue(author);
            return this.chatColors[colorValue % this.chatColors.length];
        }
        return '';
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
