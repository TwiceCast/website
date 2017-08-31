// Imports
import { Component, OnInit } from '@angular/core';

import { Stream } from '../../models/stream.model';

import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';
import { APILinker } from '../../services/APILinker.service';

@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.css', '../../app.component.css'],
})

// Component class
export class HomeComponent {

    private all_stream: Stream[];
    public popular_streams: Stream[];
    public random_streams: Stream[];

    constructor(private logg:Logger, public linker:APILinker, public sm:SessionManager) {}

    ngOnInit() {
        this.linker.getStreams()
            .then((response) => {
                this.all_stream = response;
                this.SelectRandomStreams();
                this.SelectPopularStreams();
            })
            .catch(() => {this.logg.error('(home component) couldn\'t retrieve streams');});
    }
    
    private SelectRandomStreams(): void {
        if (this.all_stream.length < 6 && this.all_stream.length > 0) {
            this.random_streams = this.all_stream;
        } else if (this.all_stream.length > 0) {
            for (let i = 0; i < 6; i++) {
                let index = Math.floor(Math.random() * (this.all_stream.length));
                if (this.random_streams.find(x => x == this.all_stream[index]) == null) {
                    this.random_streams.push(this.all_stream[index]);
                }
            }
        }
    }
    
    private SelectPopularStreams(): void {
        if (this.all_stream.length < 6 && this.all_stream.length > 0) {
            this.popular_streams = this.all_stream;
        } else if (this.all_stream.length > 0) {
            for (let i = 0; i < 6; i++) {
                let index = Math.floor(Math.random() * (this.all_stream.length));
                if (this.popular_streams.find(x => x == this.all_stream[index]) == null) {
                    this.popular_streams.push(this.all_stream[index]);
                }
            }
        }
    }
}
