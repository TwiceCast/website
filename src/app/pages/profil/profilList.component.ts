// Imports
import { Component } from '@angular/core';

import { Stream } from '../../models/stream.model';
import { User } from '../../models/user.model';
import { APILinker } from '../../services/APILinker.service';
import { Logger } from '../../services/Logger.service';

@Component({
  selector: 'component-profilList',
  templateUrl: 'profilList.html',
  styleUrls: ['./profilList.css', '../../app.component.css'],
})

// Component class
export class ProfilListComponent {
    private users: User[];
    private streams: Stream[];
    
    constructor(private api:APILinker, private logg:Logger) {
        api.getStreams().then(response => this.streams = response);
        api.getUsers().then(response => this.users = response);
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
