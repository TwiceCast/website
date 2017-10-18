// Imports
import { Component, OnInit, OnDestroy, HostBinding, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Stream } from '../../models/stream.model';
import { Tag } from '../../models/tag.model';
import { User } from '../../models/user.model';
import { APILinker } from '../../services/APILinker.service';
import { Logger } from '../../services/Logger.service';

@Component({
  selector: 'component-streamList',
  templateUrl: 'streamList.html',
  styleUrls: ['./streamList.css', '../../app.component.css'],
})

// Component class
export class StreamListComponent implements OnInit, OnDestroy {
    private streams: Stream[];
    public tags: Tag[];
    private clicked: number;
    private sub: any;
    
    public displayedStreams: Stream[];
    
    public TagsPressed: Object = {};
    
    constructor(private api:APILinker, private logg:Logger, private route: ActivatedRoute, private router: Router) {
    }

    
    private hasProperties(object: Object): boolean {
        for (let prop in object) {
            if (object.hasOwnProperty(prop))
                return true;
        }
        return false;
    }
    
    public UpdateStreams(id: number) {
        if (id in this.TagsPressed)
            delete this.TagsPressed[id];
        else
            this.TagsPressed[id] = true;
        console.log(this.TagsPressed);

        if (this.hasProperties(this.TagsPressed)) {
            this.sortStreams();
        } else {
            this.displayedStreams = this.streams;
        }
    }
    
    public sortStreams() {
        this.displayedStreams = [];
        
        for (let stream in this.streams) {
            console.log(stream);
            let showStream = true;
            for (let tag in this.TagsPressed) {
                if (this.streams[stream].tags.find(x => x.id == +tag) == null) {
                    showStream = false;
                }
            }
            if (showStream) {
                this.displayedStreams.push(this.streams[stream]);
            }
        }
    }
    
    public isLive(id: number): boolean {
        for (let stream in this.streams) {
            if (this.streams[stream].owner.id == id) {
                return true;
            }
        }
        return false;
    }
        
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => { this.clicked = params['clicked'] });
        this.api.getStreams().then((response) => {
            this.streams = response; console.log(response); this.displayedStreams = this.streams;
            this.api.getTags().then((response) => { this.tags = response; this.UpdatePreCheck(); });
        });
    }

    private UpdatePreCheck()
    {
        if (this.clicked != undefined)
        {
            this.UpdateStreams(this.clicked);
        }
    }
    
    ngOnDestroy()
    {
        
    }
    
    public encodeURL(val: string): string {
        return encodeURI(val);
    }
}
