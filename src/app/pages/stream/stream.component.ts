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
    public code:String;
    private id: number;
	private disableScrollDown = false;
    
    public chatService: ChatService;
    
    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef;

    // declare player var
    private player: any;

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router)
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
        this.editor.setTheme('tomorrow_night_eighties');
        this.editor.setMode('c_cpp');
        this.editor.setOptions({minLines: 15, maxLines: 15});
        this.player = videojs(document.getElementById('stream_videojs'), {techOrder: ['flash']}, function() {

          // Store the video object
          var myPlayer = this, id = myPlayer.id();

          // Make up an aspect ratio
          var aspectRatio = 9/16;

          // internal method to handle a window resize event to adjust the video player
          function resizeVideoJS(){
            var width = document.getElementById(id).parentElement.offsetWidth;
            myPlayer.width(width);
            myPlayer.height( width * aspectRatio );
          }

          // Initialize resizeVideoJS()
          resizeVideoJS();

          // Then on resize call resizeVideoJS()
          window.onresize = resizeVideoJS;
        });
    }
    
    logCode()
    {
        console.log(this.code);
    }

    ngOnInit() {
        // Get Stream ID
        this.route.paramMap.switchMap((params: ParamMap) =>
            params.get('id')
        ).subscribe((id: any) => this.id = id);
        
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
    }

    public onChatScroll(event) {
		this.disableScrollDown = (this.chat.nativeElement.scrollTop + this.chat.nativeElement.clientHeight !== this.chat.nativeElement.scrollHeight);
    }
}
