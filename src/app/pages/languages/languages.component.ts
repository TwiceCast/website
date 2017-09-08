// Imports
import { Component } from '@angular/core';
import { APILinker } from '../../services/APILinker.service';

import { Tag } from '../../models/tag.model';

@Component({
  templateUrl: './languages.html',
  styleUrls: ['./languages.css', '../../app.component.css'],
})

// Component class
export class LanguagesComponent {
    public languages: Tag[];
    public tags:Array<any>;
    
    constructor(private linker:APILinker)
    {
        linker.getTags().then((response) => {
            this.languages = response;
        });
        
        this.languages = [];
        this.tags = [
            {name: 'Graphics', icon:'', class: 'tag'},
            {name: 'Web', icon:'', class: 'tag'},
            {name: 'Mobile', icon:'', class: 'tag'},
            {name: 'Scripting', icon:'', class: 'tag'},
            {name: 'Framework', icon:'', class: 'tag'},
            {name: 'Mobile', icon:'', class: 'tag'},
            {name: 'GameDev', icon:'', class: 'tag'},
            {name: 'Scripting', icon:'', class: 'tag'},
            {name: 'Graphics', icon:'', class: 'tag'},
            {name: 'Framework', icon:'', class: 'tag'},
            {name: 'Web', icon:'', class: 'tag'},
            {name: 'GameDev', icon:'', class: 'tag'}
        ]
    }
    
    urlencode(url: string): string {
        return encodeURIComponent(url);
    }
    
    toggleTag(tag)
    {
        if (tag.icon === '')
        {
            tag.icon = 'glyphicon-ok';
            tag.class = 'tag_active';
        }
        else
        {
            tag.icon = '';
            tag.class = 'tag';
        }
    }
}