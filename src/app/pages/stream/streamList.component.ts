// Imports
import { Component, HostBinding, Input, Output } from '@angular/core';

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
export class StreamListComponent {
    private streams: Stream[];
    public tags: Tag[];
    
    public TagsPressed: Object = {};
    
    constructor(private api:APILinker, private logg:Logger) {
        api.getStreams().then(response => this.streams = response);
        api.getTags().then(response => this.tags = response);
    }
    
    public UpdateStreams(id: number) {
        if (id in this.TagsPressed)
            this.TagsPressed[id] = !this.TagsPressed[id];
        else
            this.TagsPressed[id] = true;
        console.log(this.TagsPressed);
    }
    
    public isLive(id: number): boolean {
        for (let stream in this.streams) {
            if (this.streams[stream].owner.id == id) {
                return true;
            }
        }
        return false;
    }
    
    public encodeURL(val: string): string {
        return encodeURI(val);
    }
}
