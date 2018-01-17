// Imports
import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import * as $ from 'jquery';

import { SessionManager } from '../../../services/SessionManager.service';
import { ChatService } from '../../../services/ChatService.service';

import { load, parse, find as findEmojis, all as allEmojis } from 'gh-emoji'

@Component({
  selector: 'component-standaloneChat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css', '../../../app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit, OnDestroy {
	@ViewChild('chat') chat;
    @ViewChild('textcompleteDropdownEmojis') emojiHolder;
    private id: number;
    private sub: any;
	private disableScrollDown = false;

    public chatService: ChatService;

    public caretPos: number = 0;

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
        load().then(() => {
            this.chatService = new ChatService('#newChatMessage', '#sendChat', this.sm);
            this.chatService.Init(this.id);
        });
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
        if (!this.disableScrollDown && this.chat != null) {
			this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
        }
	}

    parseEmojis(text: string) {
        return parse(text);
    }

    public emojisPropositions = [];
    public emojiPorpositionPosition = {x: 0, y: 0};
    parseEmojisType(text: string) {
        this.emojisPropositions = [];
        let toCheck = text.length - 1;
        while (toCheck > 0 && text[toCheck] != ' ' && text[toCheck] != ':') {
            toCheck--;
        }
        if (text[toCheck] == ':' && toCheck != text.length - 1) {
            toCheck++;
            var possibleEmojiText = text.substr(toCheck);

            for (var emojiId in allEmojis()) {
                if (emojiId.startsWith(possibleEmojiText))
                    this.emojisPropositions.push(emojiId);
            }

            while (this.emojisPropositions.length > 3)
                this.emojisPropositions.pop();
        }
    }

    displayEmoji(emoji: string) {
        return ':' + emoji + ':' + ' ' + this.parseEmojis(':' + emoji + ':');
    }

    getCaretPos(oField, ruler) {
        if ((oField.selectionStart || oField.selectionStart == '0') && this.emojiHolder != null) {
            ruler.innerHTML = oField.value;

            let eTop = $(oField).offset().top;
            this.caretPos = oField.selectionStart;
            this.emojiPorpositionPosition.y = eTop - 53 * (this.emojisPropositions.length);
            this.emojiPorpositionPosition.x = ruler.offsetWidth + oField.offsetLeft + 32;

            console.log($(this.emojiHolder));
            console.log(this.emojiPorpositionPosition);

        }
    }

    ngOnDestroy() {
        this.chatService.Destroy();
        this.sub.unsubscribe();
        window.onresize = undefined;
    }
}
