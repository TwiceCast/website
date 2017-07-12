// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';

import { APILinker } from '../../services/APILinker.service';
import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';

import * as $ from 'jquery';

@Component({
  selector: 'component-SignInLayout',
  templateUrl: './signin.html',
  styleUrls: ['./signin.css', '../../app.component.css'],
})
// Component class
export class SigninComponent implements OnInit, OnDestroy {
    
    public inputEmailSignin: string;
    public inputPasswordSignin: string;
    public connectionState: string;
    
    constructor(private api:APILinker, private logg:Logger, private sm:SessionManager) {
        //api.getUsers().then(response => this.users = response);
        
    }
    
    ngOnInit() {
        //$('alert').hide();
        $("#signin_button").click(e => { e.preventDefault(); });
    }
    
    TryLogin() {
        this.connectionState = "trying";
        this.sm.Login(this.inputEmailSignin, this.inputPasswordSignin).then(response => {
            if (response == true)
                this.connectionState = "success";
            else
                this.connectionState = "error";
            this.logg.log(response);
        });
        this.logg.log("Trying to login");
    }
    
    ngOnDestroy() {
    }
}
