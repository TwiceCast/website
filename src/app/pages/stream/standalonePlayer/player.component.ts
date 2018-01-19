// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import * as $ from 'jquery';

declare function videojs(id: any, options: any, ready:any): any;

import { Stream } from '../../../models/stream.model';

import { SessionManager } from '../../../services/SessionManager.service';
import { APILinker } from '../../../services/APILinker.service';

@Component({
  selector: 'component-player',
  templateUrl: './player.html',
  styleUrls: ['./player.css', '../../../app.component.css'],
})
export class PlayerComponent implements OnInit, OnDestroy {
    @ViewChild('editor') editor;
	@ViewChild('chat') chat;
    public codeEditorOptions:any;
    public streamUrl:string = "";
    public code:String;
    private id: number;
    private sub: any;
	private disableScrollDown = false;

    public stream: Stream;

    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef;

    // declare player var
    private player: any;
    public streamPlaying = false;

    constructor(private sm:SessionManager, private route: ActivatedRoute, private router: Router, private linker:APILinker) { }

    ngAfterViewInit(){

        this.linker.getStreams().then(  response => {
            let foundStream = false;
            for (let stream of response)
            {
                if (this.id == stream.id)
                {
                    this.streamUrl = "https://stream.twicecast.ovh:444/hls/" + String(stream.owner.id) + "_";
                    this.initPlayer(true);
                    foundStream = true;
                }
            }
            if (!foundStream) {
                this.initPlayer(false);
            }
        });

        $('footer').remove();
        $('nav').remove();
    }

    ngOnInit() {
        this.player = false;

        // Get Stream ID
        this.sub = this.route.params.subscribe(params => { this.id = params['id'] });
    }

    private playerOptions = {
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

    private initPlayer(isOnline: boolean) {
        console.log('player init go');
        this.player = videojs(document.getElementById('stream_videojs'), this.playerOptions, function() {});
        var options = {
            id: 'stream_videojs',
            adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator='
        };

        this.player.ima(options);

        this.player.ready(function() {
            let myPlayer = this.player, id = myPlayer.id();
            myPlayer.poster('./assets/stream_offline.png');
            let aspectRatio = 9/16;
            function resizeVideoJS(){
                var width = $(document).width();//document.getElementById(id).parentElement.offsetWidth;
                let playerWidth = width;
                let playerHeight = playerWidth * aspectRatio;
                if (playerHeight > $(document).height()) {
                    playerHeight = $(document).height();
                    playerWidth = playerHeight * (16/9);
                }
                myPlayer.width(playerWidth);
                myPlayer.height(playerHeight);
            }
            resizeVideoJS();
            window.onresize = resizeVideoJS;
            if (isOnline) {
                console.log('stream is in BDD');
                myPlayer.src([{type:"application/x-mpegURL", src:this.streamUrl + "low/index.m3u8", label:"Low", selected:true},{type:"application/x-mpegURL", src:this.streamUrl + "medium/index.m3u8", label:"Medium"}, {type:"application/x-mpegURL", src:this.streamUrl + "high/index.m3u8", label:"High"}, {type:"application/x-mpegURL", src:"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", label:"Demo"}]);
                myPlayer.autoplay(true);
                myPlayer.play();
                this.player.on('playing', function() {
                    this.streamPlaying = true;
                }.bind(this));
            }
        }.bind(this));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        if (this.player) {
            this.player.dispose();
        }
        window.onresize = null;
    }
}
