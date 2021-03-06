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
import 'brace/mode/ini';
import 'brace/mode/lua';
import 'brace/mode/makefile';
import 'brace/mode/markdown';
import 'brace/mode/php';
import 'brace/mode/plain_text';
import 'brace/mode/ruby';
import 'brace/mode/rust';

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
	@ViewChild('chat') chat;
    @ViewChild('textcompleteDropdownEmojis') emojiHolder;
    public codeEditorOptions:any;
    public streamUrl:string = "";
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

    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef;

    // declare player var
    private player: any;
    public streamPlaying = false;

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router, private linker:APILinker) { }

    ngAfterViewInit(){
        this.editor.setTheme("tomorrow_night_eighties");
        this.editor.setMode("c_cpp");
        this.editor.setOptions({minLines: 25, maxLines: 25, printMargin: false});

        this.linker.getStreams().then(  response => {
            let foundStream = false;
            for (let stream of response)
            {
                if (this.id == stream.id)
                {
                    this.streamUrl = "https://stream.twicecast.ovh:444/hls/" + String(stream.owner.id) + "_";
                    console.log(this.streamUrl);
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
        this.fl.AuthStateChanged.subscribe(this.fileSystemAuthChanged.bind(this));
        this.fl.ReceivedFile.subscribe(this.receivedFile.bind(this));
        this.fl.DeletedFile.subscribe(this.deletedFile.bind(this));

        // Get Stream ID
        this.sub = this.route.params.subscribe(params => { this.id = params['id'] });

        this.codeEditorOptions = {
            minLines: 35,
            maxLines: 35,
            printMargin: false
        };

        ///
        /// Init chat system
        ///
        load().then(() => {
            this.chatService = new ChatService('#newChatMessage', '#sendChat', this.sm);
            this.chatService.Init(this.id);
        });

        this.linker.getStream(this.id).then((resp_stream) => {
            this.stream = resp_stream;
            this.initFileSystem();
        });
    }

    private initFileSystem()
    {
        ///
        /// Init file system
        ///
        this.sm.checkToken().then((token_valid) => {
            this.linker.getRepository(this.sm.getApiKey(), this.id).then((response) => {
                let rep_info = JSON.parse(response['_body']);
                this.fl.connect(rep_info.url).then((resp) => {
                    if (resp) {
                        console.info('Connected to file system !');
                        this.fl.auth(rep_info.token, this.sm.getUser().pseudo, this.stream.owner.pseudo, this.stream.title);
                    } else {
                        console.warn('Failed to connect to file system. Retrying in 3s...');
                        setTimeout(() => { this.initFileSystem(); }, 3000);
                    }
                });
            });
        });
    }

    private fileSystemAuthChanged(isAuth: boolean) {
        if (isAuth) {
            this.fl.getFiles();
            this.nodes.push(this.rootNode);
            this.tree.treeModel.update();
        } else {
            console.warn('Failed to auth to File System. Retrying in 3s...');
            setTimeout(() => { this.initFileSystem(); }, 3000);
            this.nodes = [];
            this.tree.treeModel.update();
        }
    }

    private initPlayer(isOnline: boolean) {
        var playerOptions = {
           controlBar: {
              children: [
                 'playToggle',
                 'progressControl',
                 'volumePanel',
                 'qualitySelector',
                 'fullscreenToggle',
              ],
           },
        };
        this.player = videojs(document.getElementById('stream_videojs'), playerOptions, function() {});
        var adsOptions = {
            id: 'stream_videojs',
            adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='
        };

        this.player.ima(adsOptions);
        
        this.player.ready(function() {
            let myPlayer = this.player, id = myPlayer.id();
            myPlayer.controlBar.addChild('QualitySelector');
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
                myPlayer.src([{type:"application/x-mpegURL", src:this.streamUrl + "low/index.m3u8", label:"Low", selected:true},{type:"application/x-mpegURL", src:this.streamUrl + "medium/index.m3u8", label:"Medium"}, {type:"application/x-mpegURL", src:this.streamUrl + "high/index.m3u8", label:"High"}, {type:"application/x-mpegURL", src:"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", label:"Demo"}]);
                myPlayer.autoplay(true);
                //myPlayer.play();
                setTimeout(() => {this.permanentCheck();}, 5000);
            }
        }.bind(this));
    }

    permanentCheck() {
        if (this.player.tech({ IWillNotUseThisInPlugins: true }).hls.duration() == Infinity)
            this.streamPlaying = true;
        else
            this.streamPlaying = false;
        if (this.streamPlaying == false) {
            setTimeout(() => {this.permanentCheck();}, 1000);
        }
    }

    // FROM HERE : CODE EDITOR

    @ViewChild('editor') editor;
    @ViewChild(TreeComponent) private tree: TreeComponent;

    public code:string;
    public commitMessage: string;
    public commitTitle: string;
    public _selectedFile: File = null;
    public showLanguage = true;
    public language = "C/C++";
    public Languages = [
        {'title': 'C/C++', 'file': 'c_cpp', 'ext': 'c:cpp:h:hpp'},
        {'title': 'YAML', 'file': 'yaml', 'ext': 'yaml:yml'},
        {'title': 'CSS', 'file': 'css', 'ext': 'css'},
        {'title': 'HTML', 'file': 'html', 'ext': 'html'},
        {'title': 'PHP', 'file': 'php', 'ext': 'php'},
        {'title': 'JavaScript', 'file': 'javascript', 'ext': 'js:ts'},
        {'title': 'JSON', 'file': 'json', 'ext': 'json'},
        {'title': 'Java', 'file': 'java', 'ext': 'java'},
        {'title': 'Ini file', 'file': 'ini', 'ext': 'ini'},
        {'title': 'LUA', 'file': 'lua', 'ext': 'lua'},
        {'title': 'Makefile', 'file': 'lua', 'ext': 'lua'},
        {'title': 'Markdown', 'file': 'markdown', 'ext': ''},
        {'title': 'Ruby', 'file': 'ruby', 'ext': 'rs'},
        {'title': 'Rust', 'file': 'rust', 'ext': 'md'},
        {'title': 'Text', 'file': 'plain_text', 'ext': 'txt'}
    ];
    public nodes = [];
    public openedFiles: File[] = [];

    private receivedFiles: object = {};

    onChangeCodeInsideEditor(code)
    {
        this.code = code;
        if (this._selectedFile != null) {
            this._selectedFile.lockFile(true);
            this._selectedFile.content = this.code;
        }
    }

    sendPullRequest() {
        console.log(this.commitTitle);
        console.log(this.commitMessage);

        let to_send: any[] = [];

        for (let prop in this.receivedFiles) {
            if (this.receivedFiles.hasOwnProperty(prop)) {
                let file: File = this.receivedFiles[prop];
                console.log(file.name + ' - ' + file.isModified());
                if (file.isModified()) {
                    to_send.push(file);
                }
            }
        }

        if (this.commitTitle) {
            this.fl.pullRequest(this.commitTitle, this.commitMessage, to_send);
        }
    }

    private fileUpdated(file: File) {
        if (this._selectedFile == file && !file.isLocked()) {
            this.SelectOpenedFile(file);
        }
    }

    private receivedFile(content: any) {
        if (content.name in this.receivedFiles) {
            let wasComplete = this.receivedFiles[content.name].isComplete();
            this.receivedFiles[content.name].deserialize(content);
            if (wasComplete) {
                this.fileUpdated(this.receivedFiles[content.name]);
            } else if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        } else {
            this.receivedFiles[content.name] = new File().deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        }
    }

    private deletedFile(content: any) {
        if (content.file in this.receivedFiles) {
            for (let of of this.openedFiles) {
                if (of.realName == content.file)
                    this.closeOpenedFile(of);
            }

            delete this.receivedFiles[content.file];

            this.rootNode.children = [];
            for (var file in this.receivedFiles) {
                if (this.receivedFiles.hasOwnProperty(file))
                    if (this.receivedFiles[file].isComplete())
                        this.fileCompleted(file);
            }
        }
    }


    public fileSelected($event) {
        let clicked = $event.node.data;
        if (clicked.type == 'file') {
            let file_ref = this.receivedFiles[clicked.id];
            if (this.openedFiles.indexOf(file_ref) < 0) {
                this.openedFiles.push(file_ref);
            }
            this.SelectOpenedFile(file_ref);
        }
    }

    private addFolder(rootNode: any, folder: string): any {
        let foundFolder = false;
        let result = rootNode;
        if (rootNode != null && rootNode.children != null) {
            for (let i = 0; i < rootNode.children.length; i++) {
                if (rootNode.children[i].name == folder) {
                    foundFolder = true;
                    result = rootNode.children[i];
                }
            }
        }

        if (!foundFolder) {
            result = {name: folder, type: 'folder', children:[]};
            rootNode.children.push(result);
        }

        return result;
    }

    private createSubFolders(path: string) {
        let divided = path.split('/');
        let folder = this.rootNode;
        if (divided.length > 2) {
            for (let i = 1; i < divided.length - 1; i++) {
                console.log(divided);
                if (divided[i] == '') {
                    divided[i] = '/';
                }
                folder = this.addFolder(folder, divided[i]);
            }
        }

        return folder;
    }

    public closeOpenedFile(openedfile: File): void {
        let index = this.openedFiles.indexOf(openedfile);
        let selectNew = false;
        console.log("remove");
        if (index > -1) {
            if (this._selectedFile == this.openedFiles[index]) {
                console.log("select new");
                selectNew = true;
            }
            if (index == this.openedFiles.length - 1) {
                this.openedFiles.pop();
            } else if (index >= 0) {
                this.openedFiles.splice(index, 1);
            }
            if (selectNew) {
                if (index - 1 <= 0 && this.openedFiles.length > 0) {
                    console.log("s1");
                    this.SelectOpenedFile(this.openedFiles[0]);
                } else if (this.openedFiles.length >= index - 1 && this.openedFiles.length > 0) {
                    console.log("s2");
                    this.SelectOpenedFile(this.openedFiles[index - 1]);
                } else if (this.openedFiles.length > 0) {
                    console.log("s3");
                    this.SelectOpenedFile(this.openedFiles[this.openedFiles.length - 1]);
                } else {
                    console.log("s4");
                    this._selectedFile = null;
                    this.code = "";
                }
            }
        }
    }


    public SelectOpenedFile(openedfile: File): void {
        if (openedfile != null) {
            this._selectedFile = openedfile;
            this.code = openedfile.content;
            this.switchLanguageOnExtension();
            setTimeout(function() {this.editor.getEditor().clearSelection();}.bind(this), 10);
        }
    }
    
    public rootNode: any = {name: '/', type: 'folder', children:[]};
    private fileCompleted(fileName: string) {
        let fileNode: any = {};
        fileNode.id = fileName;
        let fileNameSplit = fileName.split('/');
        fileNode.name = fileNameSplit[fileNameSplit.length - 1];
        fileNode.type = 'file';
        fileNode.children = [];
        let folder = this.createSubFolders(fileName);
        folder.children.push(fileNode);
        //this.nodes.push(fileNode);
        this.tree.treeModel.update();
    }


    public reloadFile(openedfile: File): void {
        openedfile.content = openedfile.originalContent;
        openedfile.lockFile(false);
        this.SelectOpenedFile(openedfile);
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
        this.fl.AuthStateChanged.unsubscribe();
        this.fl.ReceivedFile.unsubscribe();
        this.fl.DeletedFile.unsubscribe();
        this.sub.unsubscribe();
        if (this.player) {
            this.player.dispose();
        }
        window.onresize = undefined;
    }

    private switchLanguageOnExtension() {
        let extsToFind = this._selectedFile.name.split('.');
        if (extsToFind.length > 1) {
            let extToFind = extsToFind[extsToFind.length - 1];
            console.log(extToFind);
            for (let prop in this.Languages) {
                if (this.Languages.hasOwnProperty(prop)) {
                    let lang = this.Languages[prop];
                    let exts = lang.ext.split(':');
                    console.log(lang);
                    console.log(exts);
                    for (let ext in exts) {
                        if (exts[ext].toLowerCase() == extToFind.toLowerCase()) {
                            this.switchLanguage(lang);
                            break;
                        }
                    }
                }
            }
        }
    }

            // END OF CODE EDITOR

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
