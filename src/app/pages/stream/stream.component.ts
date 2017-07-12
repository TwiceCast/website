// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as io from 'socket.io-client';
import { ChatMessage } from '../../models/chat.model';
import 'brace';

enum LayeringMode {
    OneTwo = 1,
    OneOneOne,
    TwoOne
}

import { SessionManager } from '../../services/SessionManager.service';

@Component({
  selector: 'component-streamLayout',
  templateUrl: './stream.html',
  styleUrls: ['./stream.css', '../../app.component.css'],
})
export class StreamComponent implements OnInit, OnDestroy {
    @ViewChild('editor') editor;
    public codeEditorOptions:any;
    private code:String;
	
    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef

    // declare player var
    private player: any;

    constructor(private sm:SessionManager)
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
//        this.player = videojs(document.getElementById("stream_videojs"), {}, function() {
//
//          // Store the video object
//          var myPlayer = this, id = myPlayer.id();
//
//          // Make up an aspect ratio
//          var aspectRatio = 50/800;
//
//          // internal method to handle a window resize event to adjust the video player
//          function resizeVideoJS(){
//            var width = document.getElementById(id).parentElement.offsetWidth;
//            myPlayer.width(width);
//            myPlayer.height( width * aspectRatio );
//          }
//
//          // Initialize resizeVideoJS()
//          resizeVideoJS();
//
//          // Then on resize call resizeVideoJS()
//          window.onresize = resizeVideoJS;
//        });
    }
    
    
    layeringMode: LayeringMode = LayeringMode.OneTwo;
    
    private chatMessages: ChatMessage[];
    

    private mysock: any;
	private displayErrorConnect: boolean;
    
    logCode()
    {
        console.log(this.code);
    }
    
    private sendChatMessage(content: string) {
        console.log(content);
        this.mysock.emit('message', {'content': content});
    }
    
    ngOnInit() {
        this.codeEditorOptions = {
                maxLines: 10, 
                printMargin: true
            };
        // CHAT
        this.chatMessages = [];
        this.mysock = io('http://localhost:3006');
        
		this.displayErrorConnect = true;
		
		var connecting_message = new ChatMessage();
		connecting_message.id = -1;
		connecting_message.author = "";
		connecting_message.message = "Joining chat...";
		this.chatMessages.push(connecting_message);
		
        this.mysock.on('connect', function(data:any){
			this.displayErrorConnect = true;
			var logging_in_message = new ChatMessage();
			logging_in_message.id = -1;
			logging_in_message.author = "";
            if (this.sm.isLogged())
            {
                logging_in_message.message = "Logging in...";
                this.chatMessages.push(logging_in_message);
                this.mysock.emit('auth', {'username': this.sm.getLogin(), 'password':'loltest', 'room':'stream1'});
            }
            else
            {
                logging_in_message.message = "Please log in to use the chat service !";
                this.chatMessages.push(logging_in_message);
            }
        }.bind(this));
        
        this.mysock.on('message', function(data:any){
            console.log('(CHAT MESSAGE)' + data.user + ': ' + data.content);
            this.chatMessages.push(new ChatMessage().deserialize(data));
        }.bind(this));
        
        this.mysock.on('auth', function(data:any){
            console.log('CHAT LOG (' + data.code + '): ' + data.message);
			var logged_in_message = new ChatMessage();
			logged_in_message.id = -1;
			logged_in_message.author = "";
			logged_in_message.message = "Logged in !";
			this.chatMessages.push(logged_in_message);
        }.bind(this));
        
        this.mysock.on('cerror', function(data:any){
            console.error('CHAT ERROR (' + data.code + '): ' + data.message);
        }.bind(this));

		this.mysock.on('connect_error', function(error:any){
			if (this.displayErrorConnect == true) {
				var error_connect_message = new ChatMessage();
				error_connect_message.id = -1;
				error_connect_message.author = "";
				error_connect_message.message = "Couldn't connect ! Waiting to reconnect...";
				this.chatMessages.push(error_connect_message);
				this.displayErrorConnect = false;
			}
		}.bind(this));
		
		this.mysock.on('disconnect', function(reason:any){
			var disconnect_message = new ChatMessage();
			disconnect_message.id = -1;
			disconnect_message.author = "";
			disconnect_message.message = "You got disconnected !";
			this.chatMessages.push(disconnect_message);
		}.bind(this));
    }
    
    ngOnDestroy() {
        this.mysock.close(true);
    }
}
