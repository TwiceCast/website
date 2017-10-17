// Imports
import { Component } from '@angular/core';
import { APILinker } from '../../services/APILinker.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Tag } from '../../models/tag.model';

@Component({
  templateUrl: './languages.html',
  styleUrls: ['./languages.css', '../../app.component.css'],
})

// Component class
export class LanguagesComponent {
    public languages: Tag[];
    public tags:Array<any>;
    
    constructor(private linker:APILinker, private router: Router)
    {
        linker.getTags().then((response) => {
            this.languages = response;
        });
    }
    
    urlencode(url: string): string {
        return encodeURIComponent(url);
    }
}