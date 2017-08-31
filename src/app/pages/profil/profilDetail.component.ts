// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/user.model';
import { APILinker } from '../../services/APILinker.service';
import { Logger } from '../../services/Logger.service';

@Component({
  selector: 'component-profilDetail',
  templateUrl: './profilDetail.html',
  styleUrls: ['./profilDetail.css', '../../app.component.css'],
})

// Component class
export class ProfilDetailComponent implements OnInit, OnDestroy {
    private id: number;
    private sub: any;
    
    user: User;
    
    constructor(private route: ActivatedRoute, private api:APILinker, private logg:Logger) {
    }
    
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.api.getUser(this.id).then(response => this.user = response);
        });
        console.log(this.user);
    }
    
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
