// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';

enum LayeringMode {
    OneTwo = 1,
    OneOneOne,
    TwoOne
}

var sampleCode = `<html>
<head>
</head>
<body>
<div class="container">
BÒNJOUR
</div>
</body>
</html>`;

@Component({
  selector: 'component-streamLayout',
  templateUrl: 'app/pages/stream/stream.html',
})

// Component class
export class StreamComponent implements OnInit, OnDestroy {
    private layeringMode: LayeringMode = LayeringMode.OneTwo;
    
    private mysock: any;
    private code: String;
    private config: any;

    logCode()
    {
        console.log(this.code);
    }
    
    ngOnInit() {
        // CHAT
        this.mysock = io('http://localhost:3005');
        
        this.mysock.on('connect', function(data:any){
            this.mysock.emit('message', {'content':'Salut!'});
            this.mysock.emit('auth', {'username':'Chocoderme', 'password':'edr4475rer!', 'room':'stream1'});
        }.bind(this));
        
        this.mysock.on('message', function(data:any){
            console.log('(CHAT MESSAGE)' + data.user + ': ' + data.content);
        }.bind(this));
        
        this.mysock.on('auth', function(data:any){
            console.log('CHAT LOG (' + data.code + '): ' + data.message);
            this.mysock.emit('message', {'content':'Bonjour!'});
        }.bind(this));
        
        this.mysock.on('cerror', function(data:any){
            console.error('CHAT ERROR (' + data.code + '): ' + data.message);
        }.bind(this));
        
        //CODEMIRROR CONFIG
        this.config = {
            lineNumbers: true,
            mode: {
                name: 'htmlmixed', //CHANGER NAME ICI PAR CODE LANGAGE
                json: true
            },
        };
        
        //CODEMIRROR sampleCode
        this.code = sampleCode;
    }
    
    ngOnDestroy() {
        this.mysock.close(true);
    }
}
