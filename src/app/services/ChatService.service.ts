import * as Rx from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import * as $ from 'jquery';

import { ChatMessage } from '../models/chat.model';
import { User } from '../models/user.model';

import { SessionManager } from './SessionManager.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChatService {

    public chatMessages: ChatMessage[];
    
    private mysock: any;
    private displayErrorConnect: boolean;
    private id: number;
    
    // html ids
    private chatInput: string;
    private buttonSend: string;
    
    public sendChatMessage(content: string) {
		if (content == "")
			return;
        $(this.chatInput).val('');
        console.log(content);
        this.mysock.emit('message', {'content': content});
    }
    
    public Init(room_id: number) {
        console.log("init chat");
        // CHAT
        this.id = room_id;
        this.chatMessages = [];
        this.mysock = io('http://chat.twicecast.ovh:3008');
        
		this.displayErrorConnect = true;
		
		var connecting_message = new ChatMessage();
		connecting_message.id = -1;
		connecting_message.author = "";
		connecting_message.message = "Joining chat...";
		this.chatMessages.push(connecting_message);
		
        /*
        ** Binding chat functions
        */
        this.mysock.on('connect', this.connect.bind(this));
        this.mysock.on('message', this.message.bind(this));
        this.mysock.on('auth', this.auth.bind(this));
        this.mysock.on('cerror', this.cerror.bind(this));
		this.mysock.on('connect_error', this.connect_error.bind(this));
		this.mysock.on('disconnect', this.disconnect.bind(this));
        
        $("#newChatMessage").keyup(function(event){
            if(event.keyCode == 13){
                $("#sendChat").click();
            }
        });
    }
    
    public Destroy() {
        this.mysock.close(true);
    }
    
    constructor(chatInput: string, buttonSend: string, private sm:SessionManager)
    {
        this.chatInput = chatInput;
        this.buttonSend = buttonSend;
        console.log("bonjour chat");
    }
    
    /*
    ** Chat functions
    */
    
    private connect(data: any)
    {
        this.displayErrorConnect = true;
		var logging_in_message = new ChatMessage();
		logging_in_message.id = -1;
		logging_in_message.author = "";
        if (this.sm.isLogged())
        {
            logging_in_message.message = "Logging in...";
            this.chatMessages.push(logging_in_message);
            this.mysock.emit('auth', {'username': this.sm.getLogin(), 'password':this.sm.getPassword(), 'room':this.id});
        }
        else
        {
            logging_in_message.message = "Please log in to use the chat service !";
            this.chatMessages.push(logging_in_message);
        }
    }
    
    private message(data: any)
    {
        console.log('(CHAT MESSAGE): ' + data.user + ': ' + data.content);
        this.chatMessages.push(new ChatMessage().deserialize(data));
    }
    
    private auth(data: any)
    {
        console.log('CHAT LOG (' + data.code + '): ' + data.message);
        var logged_in_message = new ChatMessage();
		logged_in_message.id = -1;
		logged_in_message.author = "";
		logged_in_message.message = "Logged in !";
		this.chatMessages.push(logged_in_message);
    }
    
    private cerror(error: any)
    {
        console.error('CHAT ERROR (' + error.code + '): ' + error.message);
    }
    
    private connect_error(error: any)
    {
        if (this.displayErrorConnect == true) {
            var error_connect_message = new ChatMessage();
			error_connect_message.id = -1;
			error_connect_message.author = "";
			error_connect_message.message = "Couldn't connect ! Waiting to reconnect...";
			this.chatMessages.push(error_connect_message);
			this.displayErrorConnect = false;
        }
    }
    
    private disconnect(reason: any)
    {
        var disconnect_message = new ChatMessage();
        disconnect_message.id = -1;
		disconnect_message.author = "";
		disconnect_message.message = "You got disconnected !";
		this.chatMessages.push(disconnect_message);
    }
}
