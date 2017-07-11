// Imports
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as io from 'socket.io-client';
import { ChatMessage } from '../../models/chat.model';
import 'brace';

import { SessionManager } from '../../services/SessionManager.service';

enum LayeringMode {
    OneTwo = 1,
    OneOneOne,
    TwoOne
}


@Component({
  selector: 'component-streamLayout',
  templateUrl: 'app/pages/stream/stream.html',
})
export class StreamComponent implements OnInit, OnDestroy {
    @ViewChild('editor') editor;
    public codeEditorOptions:any;
    private code:String;

    constructor(private sm:SessionManager)
    { }

    onChangeCodeInsideEditor(code)
    {
        this.code = code;
    }

    ngAfterViewInit(){
        this.editor.setTheme("tomorrow_night_eighties");
        this.editor.setMode("c_cpp"); 
        this.editor.setOptions({minLines: 15, maxLines: 15});
    }

    private layeringMode: LayeringMode = LayeringMode.OneTwo;
    
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
			logging_in_message.message = "Logging in...";
			this.chatMessages.push(logging_in_message);
            this.mysock.emit('auth', {'username': this.sm.getLogin(), 'password':'loltest', 'room':'stream1'});
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
