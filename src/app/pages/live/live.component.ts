// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as io from 'socket.io-client';

import * as $ from 'jquery';

import { Tag } from '../../models/tag.model';

import { SessionManager } from '../../services/SessionManager.service';
import { APILinker } from '../../services/APILinker.service';
import { FileSystemLinker } from '../../services/FileSystemLinker.service';
import { ChatService } from '../../services/ChatService.service';

import { load, parse, find as findEmojis, all as allEmojis } from 'gh-emoji'

@Component({
  selector: 'component-streamLayout',
  templateUrl: './live.html',
  styleUrls: ['./live.css', '../../app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LiveComponent implements OnInit, OnDestroy {

    @ViewChild('chat') chat;
    @ViewChild('textcompleteDropdownEmojis') emojiHolder;
    private disableScrollDown = false;

    public tags:Array<any>;
    
    public activeTags: Object = {};
    public formattedTags:Array<String> = new Array<String>();

    private sub: any;
    private id: number;

    public stream: any;

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router, private linker:APILinker)
    {}

    public live: boolean = false;
    public InputStreamTitle: String;
    public InputStreamDescription: String;

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

    parseEmojis(text: string) {
        return parse(text);
    }

    public emojisPropositions = [];
    public emojiPorpositionPosition = {x: 0, y: 0};
    parseEmojisType(text: string) {
        this.emojisPropositions = [];
        let toCheck = this.caretPos - 1;
        while (toCheck > 0 && text[toCheck] != ' ' && text[toCheck] != ':') {
            toCheck--;
        }
        if (toCheck < 0)
            return;
        if (text[toCheck] == ':' && toCheck != text.length - 1) {
            toCheck++;
            let lengthCheck = toCheck;
            while (lengthCheck < text.length && text[lengthCheck] != ' ')
                lengthCheck++;
            if (lengthCheck > 0) {
                var possibleEmojiText = text.substr(toCheck, lengthCheck - toCheck);

                for (var emojiId in allEmojis()) {
                    if (emojiId.startsWith(possibleEmojiText))
                        this.emojisPropositions.push(emojiId);
                }

                while (this.emojisPropositions.length > 3)
                    this.emojisPropositions.pop();
            }
        }
    }

    displayEmoji(emoji: string) {
        return ':' + emoji + ':' + ' ' + this.parseEmojis(':' + emoji + ':');
    }

    getCaretPos(oField, ruler) {
        if (oField.selectionStart || oField.selectionStart == '0') {
            this.caretPos = oField.selectionStart;

            if (this.emojiHolder != null) {
                ruler.innerHTML = oField.value;

                let eTop = $(oField).offset().top;

                let carac = ruler.offsetWidth / $(oField).val().toString().length;
                this.emojiPorpositionPosition.y = eTop - 53 * (this.emojisPropositions.length);
                this.emojiPorpositionPosition.x = carac * this.caretPos + $(oField).offset().left;
            }
        }
    }

    ngAfterViewChecked() {
        if (!this.disableScrollDown && this.chat != null) {
			this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
        }
	}


    checkLive(response:any) {
        for (let stream of response)
        {
            console.log(stream);
            if (stream.owner.id == this.sm.getId()) {
                this.live = true;
                this.formattedTags = [];
                this.stream = stream;
                this.activeTags = {};
                if (this.chatService != null)
                    this.chatService.Destroy();
                load().then(() => {
                    this.chatService = new ChatService('#newChatMessage', '#sendChat', this.sm);
                    this.chatService.Init(stream.id);
                });
                console.log(stream.id);
            }
        }
    }

    private hasProperties(object: Object): boolean {
        for (let prop in object) {
            if (object.hasOwnProperty(prop))
                return true;
        }
        return false;
    }
    
    public tagPressed(id: number) {
        if (id in this.activeTags)
            delete this.activeTags[id];
        else
            this.activeTags[id] = true;
    }
     
    goLive() {
        if (!this.InputStreamTitle || this.InputStreamTitle.length < 4) {
            this.processingLive = false;
            return;
        }
        if (this.InputStreamDescription && this.InputStreamDescription.length < 4) {
            this.processingLive = false;
            return;
        }
        for(var key in this.activeTags) {
            this.formattedTags.push(key);
        }
        console.log(this.formattedTags);
        this.sm.checkToken().then((response) => {
            if (response == true) {
                this.linker.createStream(this.sm.getApiKey(), this.InputStreamTitle, this.InputStreamDescription, "FRA", this.formattedTags).then((response) => {
                    // SET STREAM COVER //
//                    this.linker.setStreamCover(this.sm.getApiKey(), response.id, cover);
                    // Need Cover Picture Here //
                    this.linker.getStreams().then(live_response => {
                        this.checkLive(live_response);
                        this.processingLive = false;
                    });
                }).catch((error) => {
                    if (error["status"] == 401) {
                        this.sm.Login(this.sm.getLogin(), this.sm.getPassword()).then((resp) => {
                            if (resp == true) {
                                this.goLive();
                            } else {
                                this.processingLive = false;
                            }
                        });
                    }
                    else
                        this.processingLive = false;
                });
            } else {
                console.log("Please relog");
                this.processingLive = false;
            }
        }).catch((response) => { console.log("not logged"); this.processingLive = false; });
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
                            this.stream = null;
                            if (this.chatService) {
                                this.chatService.Destroy();
                                this.chatService = null;
                            }
                        }
                    }
                    this.processingLive = false;
                });
            } else {
                console.log("Please relog");
                this.processingLive = false;
            }
        }).catch((response) => { console.log("not logged"); this.processingLive = false; });
    }

    public processingLive: boolean = false;
    ProcessLive() {
        this.processingLive = true;
        if (this.live)
            this.liveOff();
        else
            this.goLive();
    }
    
    ngOnInit() {

        // Get Stream ID
        this.sub = this.route.params.subscribe(params => { this.id = params['id'] });
        if (!this.sm.isLogged() || this.sm.getId() != this.id) {
            this.router.navigate(['/']);
        } else {
            this.linker.getTags().then((response) => {
                this.tags = []
                for (let tag of response) {
                    this.tags.push({id: tag.id, name: tag.name, icon:'', class: 'tag'});
                }
            });

            this.linker.getStreams().then(response => {
                this.checkLive(response);
            });
        }
    }
    
    ngOnDestroy() {
        if (this.chatService)
            this.chatService.Destroy();
    }

    public newImage = null;
    public imageData = null;
    public fileChangeEvent(fileInput: any){
        if (fileInput.target.files && fileInput.target.files[0]) {
            var reader = new FileReader();

            reader.onload = (e:any) => {
                this.newImage = e.target.result;
                $('#newCoverPreview').attr('src', this.newImage);
            }

            reader.readAsDataURL(fileInput.target.files[0]);
            this.imageData = fileInput.target.files[0];
            //this.api.changeAvatar(this.sm.getApiKey(), this.sm.getId(), fileInput.target.files[0]);
        }
    }

    public UpdateCover() {
        if (this.newImage && this.imageData && this.stream) {
            this.processingLive = true;
            this.linker.setStreamCover(this.sm.getApiKey(), this.stream.id, this.imageData)
                .catch((error) => {
                    console.error(error);
                    this.processingLive = false;
                }).then((response) => {
                    if (response.status == 200) {
                        $('#actualCoverPreview').attr('src', this.newImage);
                    }
                    console.log(response);
                    this.processingLive = false;
            });
        }
    }

}
