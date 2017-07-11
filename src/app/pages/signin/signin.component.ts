// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

import { APILinker } from '../../services/APILinker.service';
import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';


@Component({
  selector: 'component-SignInLayout',
  templateUrl: './signin.html',
  styleUrls: ['./signin.css', '../../app.component.css'],
})
// Component class
export class SigninComponent implements OnInit, OnDestroy {
    
    constructor(private api:APILinker, private logg:Logger, private sm:SessionManager) {
        //api.getUsers().then(response => this.users = response);
    }
    
    ngOnInit() {
        this.sm.Login("test@test.com", "loltest").then(response => {
            this.logg.log(response);
        });
    }
    
    ngOnDestroy() {
    }
}
