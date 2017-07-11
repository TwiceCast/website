// Imports
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as io from 'socket.io-client';
import { ChatMessage } from '../../models/chat.model';
import 'brace';
import 'brace/theme/clouds';
import 'brace/mode/c_cpp';

enum LayeringMode {
    OneTwo = 1,
    OneOneOne,
    TwoOne
}


@Component({
  selector: 'component-streamLayout',
  templateUrl: './stream.html',
  styleUrls: ['./stream.css', '../../app.component.css'],
})
export class StreamComponent implements OnInit, OnDestroy {
    @ViewChild('editor') editor;
    public codeEditorOptions:any;
    private code:String;

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
        
        this.mysock.on('connect', function(data:any){
			var logging_in_message = new ChatMessage();
			logging_in_message.id = -1;
			logging_in_message.author = "";
			logging_in_message.message = "Joining chat...";
			this.chatMessages.push(logging_in_message);
            this.mysock.emit('auth', {'username':'test@test.com', 'password':'loltest', 'room':'stream1'});
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
    }
    
    ngOnDestroy() {
        this.mysock.close(true);
    }
}