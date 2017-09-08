// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'brace';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/mode/c_cpp';

import * as $ from 'jquery';

declare function videojs(id: any, options: any, ready:any): any;

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
    public codeEditorOptions:any;
    public streamUrl:string = "";
    public code:String;
    private id: number;
    private sub: any;
	private disableScrollDown = false;
    
    public stream: Stream;
    
    public chatService: ChatService;
    
    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef;

    // declare player var
    private player: any;

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router, private linker:APILinker)
    {
        this.player = false;
        this.fl.AuthStateChanged.subscribe(this.fl.getFiles.bind(this.fl));
        this.fl.ReceivedFile.subscribe(this.receivedFile.bind(this));
    }

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
        this.player = videojs(document.getElementById('stream_videojs'), {techOrder: ['flash']}, function() {
            var myPlayer = this, id = myPlayer.id();
            var aspectRatio = 9/16;
            myPlayer.autoplay(true);
            function resizeVideoJS(){
                var width = document.getElementById(id).parentElement.offsetWidth;
                myPlayer.width(width);
                myPlayer.height( width * aspectRatio );
            }
            resizeVideoJS();
            window.onresize = resizeVideoJS;
        });
    }
    
    logCode()
    {
        console.log(this.code);
    }

    ngOnInit() {
        // Get Stream ID
        this.sub = this.route.params.subscribe(params => { this.id = params['id'] });
        this.linker.getStreams().then(response => {
            for (let stream of response)
            {
                if (this.id == stream.id)
                {
                    this.streamUrl = "rtmp://37.187.99.70:1935/live/" + String(stream.owner.id);
                    this.player.src({type:"rtmp/mp4",src:this.streamUrl});
                    this.player.play();
                    $('window').trigger("resize");
                }
            }
        });

        this.codeEditorOptions = {
                maxLines: 10, 
                printMargin: true
            };

        ///
        /// Init chat system
        ///
        this.chatService = new ChatService('#newChatMessage', '#sendChat', this.sm);
        this.chatService.Init(this.id);

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
    }

    private receivedFile(content: any) {
        console.log(content);
        if (content.name in this.receivedFiles) {
            this.receivedFiles[content.name].deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                console.log(content.name + ' COMPLETE');
                this.fileCompleted(content.name);
            }
        } else {
            this.receivedFiles[content.name] = new File().deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                console.log(content.name + ' COMPLETE');
                this.fileCompleted(content.name);
            }
        }
    }

    public fileSelected($event) {
        let clicked = $event.node.data;
        let file_ref = this.receivedFiles[clicked.name];
        console.log(file_ref);
        this.code = file_ref.content;
    }
    
    private fileCompleted(fileName: string) {
        let fileNode: any = {};
        fileNode.id = fileName;
        fileNode.name = fileName;
        console.log(fileNode);
        this.nodes.push(fileNode);
        this.tree.treeModel.update();
    }
    
    ngAfterViewChecked() {
        if (!this.disableScrollDown) {
			this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
        }
	}

    ngOnDestroy() {
        this.chatService.Destroy();
        this.fl.disconnect();
        this.sub.unsubscribe();
        this.player.dispose();
        window.onresize = undefined;
    }

    public onChatScroll(event) {
		this.disableScrollDown = (this.chat.nativeElement.scrollTop + this.chat.nativeElement.clientHeight !== this.chat.nativeElement.scrollHeight);
    }
}
