// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'brace';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/mode/c_cpp';

import * as $ from 'jquery';

declare function videojs(id: any, options: any, ready:any): any;


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
    
    public chatService: ChatService;
    
    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef;

    // declare player var
    private player: any;

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router, private linker:APILinker)
    {
        this.player = false;
    }
	
    public nodes = [
        {
          id: 1,
          name: 'root1',
          children: [
            { id: 2, name: 'child1' },
            { id: 3, name: 'child2' }
          ]
        },
        {
          id: 4,
          name: 'root2',
          children: 
            [
                {
                id: 5, name: 'child2.1' 
                },
                {
                id: 6,
                    name: 'child2.2',
                children: 
                    [
                        { id: 7, name: 'subsub' }
                    ]
                }
            ]
        }
    ];
     
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
        this.fl.connect();
        this.fl.auth();
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
