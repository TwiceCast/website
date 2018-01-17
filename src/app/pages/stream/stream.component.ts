// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'brace';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/mode/c_cpp';
import 'brace/mode/yaml';
import 'brace/mode/css';
import 'brace/mode/html';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/json';

import * as $ from 'jquery';

declare function videojs(id: any, options: any, ready:any): any;

import { load, parse, find as findEmojis, all as allEmojis } from 'gh-emoji'

import { Stream } from '../../models/stream.model';
import { File } from '../../models/file.model';

import { TreeModule, TreeComponent, TreeNode } from 'angular-tree-component';

import { SessionManager } from '../../services/SessionManager.service';
import { FileSystemLinker } from '../../services/FileSystemLinker.service';
import { APILinker } from '../../services/APILinker.service';
import { ChatService } from '../../services/ChatService.service';

@Component({
  selector: 'component-streamLayout',
  templateUrl: './stream.html',
  styleUrls: ['./stream.css', '../../app.component.css'],
})
export class StreamComponent implements OnInit, OnDestroy {
    @ViewChild('editor') editor;
	@ViewChild('chat') chat;
    @ViewChild('textcompleteDropdownEmojis') emojiHolder;
    public codeEditorOptions:any;
    public streamUrl:string = "";
    public code:String;
    private id: number;
    private sub: any;
	private disableScrollDown = false;
    
    public stream: Stream;
    
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
    
    public showLanguage = true;
    public language = "C/C++";
    public Languages = [
        {'title': 'C/C++', 'file': 'c_cpp'},
        {'title': 'YAML', 'file': 'yaml'},
        {'title': 'CSS', 'file': 'css'},
        {'title': 'HTML', 'file': 'html'},
        {'title': 'JavaScript', 'file': 'javascript'},
        {'title': 'JSON', 'file': 'json'},
        {'title': 'Java', 'file': 'java'}
    ];
    
    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef;

    // declare player var
    private player: any;
    public streamPlaying = false;

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router, private linker:APILinker) { }

    private receivedFiles: File[] = [];

    @ViewChild(TreeComponent)
    private tree: TreeComponent;
    public nodes = [];

    onChangeCodeInsideEditor(code)
    {
        this.code = code;
    }

    ngAfterViewInit(){
        this.editor.setTheme("tomorrow_night_eighties");
        this.editor.setMode("c_cpp");
        this.editor.setOptions({minLines: 15, maxLines: 15});

        this.linker.getStreams().then(  response => {
            let foundStream = false;
            for (let stream of response)
            {
                if (this.id == stream.id)
                {
                    this.streamUrl = "rtmp://37.187.99.70:1935/live/" + String(stream.owner.id);
                    this.initPlayer(true);
                    foundStream = true;
                }
            }
            if (!foundStream) {
                this.initPlayer(false);
            }
        });
    }
    
    logCode()
    {
        console.log(this.code);
    }

    ngOnInit() {
        this.player = false;
        this.fl.AuthStateChanged.subscribe(this.fl.getFiles.bind(this.fl));
        this.fl.ReceivedFile.subscribe(this.receivedFile.bind(this));

        // Get Stream ID
        this.sub = this.route.params.subscribe(params => { this.id = params['id'] });

        this.codeEditorOptions = {
            maxLines: 10,
            printMargin: true
        };

        ///
        /// Init chat system
        ///
        load().then(() => {
            this.chatService = new ChatService('#newChatMessage', '#sendChat', this.sm);
            this.chatService.Init(this.id);
        });

        ///
        /// Init file system
        ///
        this.linker.getStream(this.id).then((resp_stream) => {
            console.log(resp_stream);
            this.stream = resp_stream;
            this.sm.checkToken().then((token_valid) => {
                this.linker.getRepository(this.sm.getApiKey(), this.id).then((response) => {
                    console.log(response);
                    let rep_info = JSON.parse(response['_body']);
                    this.fl.connect(rep_info.url).then((resp) => {
                        if (resp) {
                            this.fl.auth(rep_info.token, this.sm.getUser().pseudo, this.stream.owner.pseudo, this.stream.title);
                        }
                    });
                });
            });
        });
        this.nodes.push(this.rootNode);
        this.tree.treeModel.update();
    }

    private initPlayer(isOnline: boolean) {
        console.log('player init go');
        this.player = videojs(document.getElementById('stream_videojs'), {techOrder: ['flash']}, function() {});

        this.player.ready(function() {
            let myPlayer = this.player, id = myPlayer.id();
            myPlayer.poster('./assets/stream_offline.png');
            let aspectRatio = 9/16;
            function resizeVideoJS(){
                var width = document.getElementById(id).parentElement.offsetWidth;
                myPlayer.width(width);
                myPlayer.height( width * aspectRatio );
            }
            resizeVideoJS();
            window.onresize = resizeVideoJS;
            if (isOnline) {
                console.log('stream is in BDD');
                myPlayer.src({type:"rtmp/mp4",src:this.streamUrl});
                myPlayer.autoplay(true);
                myPlayer.play();
                this.player.on('playing', function() {
                    this.streamPlaying = true;
                }.bind(this));
            }
        }.bind(this));
    }

    private receivedFile(content: any) {
        if (content.name in this.receivedFiles) {
            this.receivedFiles[content.name].deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        } else {
            this.receivedFiles[content.name] = new File().deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        }
    }

    public fileSelected($event) {
        let clicked = $event.node.data;
        if (clicked.type == 'file') {
            let file_ref = this.receivedFiles[clicked.id];
            console.log(file_ref.isComplete());
            console.log(file_ref.content);
            this.code = file_ref.content;
        }
    }

    private createSubFolders(path: any) {

    }
    
    public rootNode: any = {name: '/', type: 'folder', children:[]};
    private fileCompleted(fileName: string) {
        let fileNode: any = {};
        fileNode.id = fileName;
        let fileNameSplit = fileName.split('/');
        fileNode.name = fileNameSplit[fileNameSplit.length - 1];
        fileNode.type = 'file';
        fileNode.children = [];
        this.rootNode.children.push(fileNode);
        //this.nodes.push(fileNode);
        this.tree.treeModel.update();
    }
    
    private switchLanguage(lang:any) {
        console.log(lang);
        this.editor.setMode('' + lang.file);
        this.language = lang.title;
    }
    
    ngAfterViewChecked() {
        if (!this.disableScrollDown && this.chat != null) {
			this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
        }
	}

    ngOnDestroy() {
        this.chatService.Destroy();
        this.fl.disconnect();
        this.sub.unsubscribe();
        if (this.player) {
            this.player.dispose();
        }
        window.onresize = undefined;
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
}
