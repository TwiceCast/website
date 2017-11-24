import * as Rx from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import * as $ from 'jquery';

import { ChatMessage } from '../models/chat.model';
import { User } from '../models/user.model';

import { SessionManager } from './SessionManager.service';

import 'rxjs/add/operator/toPromise';

export enum Rank {
    ADMIN = 1,
    MOD = 2,
    VIP = 3,
    USER = 4
}

@Injectable()
export class ChatService {

    public chatMessages: ChatMessage[];
    
    private mysock: any;
    private displayErrorConnect: boolean;
    private id: number;
    
    private rank: Rank;

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
    
    public sendMute(user: string) {
        if (user == '')
            return;
        console.log('Muting..' + user + ' (60 sec)');
        this.mysock.emit('mute', {username: user, duration: 60});
    }

    public sendBan(user: string) {
        if (user == '')
            return;
        console.log('Banning..' + user);
        this.mysock.emit('ban', {username: user});
    }

    public sendDeleteMessage(msgId: number) {
        if (msgId < 0)
            return;
        console.log('removing message ' + msgId);
        this.mysock.emit('deleteMessage', {id: msgId});
    }

    public getRank(): Rank { return this.rank; }

    public Init(room_id: number) {
        console.log("init chat");
        // CHAT
        this.rank = Rank.USER;
        this.id = room_id;
        this.chatMessages = [];
        this.mysock = io('http://chat.twicecast.ovh:3008');
//        this.mysock = io('http://localhost:3006');
        
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
        this.mysock.on('deleteMessage', this.delete_message.bind(this));
        this.mysock.on('auth', this.auth.bind(this));
        this.mysock.on('cerror', this.cerror.bind(this));
		this.mysock.on('connect_error', this.connect_error.bind(this));
		this.mysock.on('disconnect', this.disconnect.bind(this));
        this.mysock.on('mute', this.mute.bind(this));
        this.mysock.on('ban', this.ban.bind(this));
    }

    public InitKey() {
        $("#newChatMessage").keyup(function(event){
            if(event.keyCode == 13){
                $("#sendChat").click();
            }
        });
    }
    
    public ScrollDownContainer() {
        var d = $("#MessagesContainer");
        d.scrollTop(d.prop("scrollHeight"));
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
            this.InitKey();
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
        console.log(data);
        this.chatMessages.push(new ChatMessage().deserialize(data));
        this.ScrollDownContainer();
    }
    
    private auth(data: any)
    {
        console.log('CHAT LOG (' + data.code + '): ' + data.message + '[' + data.accessLevel + ']');
        if (data.code == 200) {
            switch (+data.accessLevel) {
                case 0:
                    this.rank = Rank.ADMIN;
                    break;
                case 1:
                    this.rank = Rank.MOD;
                    break;
                case 2:
                    this.rank = Rank.VIP;
                    break;
                case 3:
                    this.rank = Rank.USER;
                    break;
                default:
                    this.rank = Rank.USER;
                    break;
            }
            console.log(this.rank);
            let logged_in_message = new ChatMessage();
            logged_in_message.id = -1;
            logged_in_message.author = "";
            logged_in_message.message = "Logged in !";
            this.chatMessages.push(logged_in_message);
        }
    }
    
    private cerror(error: any)
    {
        console.error('CHAT ERROR (' + error.code + '): ' + error.message);
    }
    
    private mute(data: any) {
        if (data.duration) {
            console.log('(CHAT MUTE)' + data.duration);
            let mute_message = new ChatMessage();
            mute_message.id = -1;
            mute_message.author = "";
            mute_message.message = 'You are mute for ' + data.duration + ' seconds!';
            this.chatMessages.push(mute_message);
        } else if (data.message && data.message == 'Success') {
            console.log('(CHAT MUTE)' + data.reason);
            let mute_message = new ChatMessage();
            mute_message.id = -1;
            mute_message.author = "";
            mute_message.message = data.reason;
            this.chatMessages.push(mute_message);
        }
    }

    private ban(data: any) {
        if (data.message && data.message == 'Disconnected') {
            console.log('(CHAT BAN)');
            let ban_message = new ChatMessage();
            ban_message.id = -1;
            ban_message.author = "";
            ban_message.message = 'You have been banned!';
            this.chatMessages.push(ban_message);
        } else if (data.message && data.message == 'Success') {
            console.log('(CHAT BAN)' + data.reason);
            let ban_message = new ChatMessage();
            ban_message.id = -1;
            ban_message.author = "";
            ban_message.message = data.reason;
            this.chatMessages.push(ban_message);
        }
    }

    private delete_message(data: any) {
        console.log('(DELETE MESSAGE) ' + data);
        let to_rem = this.chatMessages.find(x => (x.id == data.id));
        console.log(to_rem);
        if (to_rem) {
            let index_to_rem = this.chatMessages.indexOf(to_rem);
            if (index_to_rem >= 0) {
                to_rem.id = -1;
                to_rem.author = "";
                to_rem.message = "This message has been deleted !";
            }
        }
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
