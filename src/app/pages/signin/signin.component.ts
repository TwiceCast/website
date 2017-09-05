// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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
    
    private timeoutRedir: any;
    
    constructor(private logg:Logger, public sm:SessionManager, private router: Router) {}
    
    ngOnInit() {
        $("#signin_button").click(e => { e.preventDefault(); });
    }
    
    TryLogin() {
        this.connectionState = "trying";
        this.sm.Login(this.inputEmailSignin, this.inputPasswordSignin).then(response => {
            if (response == true) {
                this.connectionState = "success";
                this.timeoutRedir = setTimeout(function() {this.router.navigate(['/home']); }.bind(this), 3000);
            }
            else
                this.connectionState = "error";
            this.logg.log(response);
        });
        this.logg.log("Trying to login");
    }
    
    ngOnDestroy() {
        if (this.timeoutRedir) {
            clearTimeout(this.timeoutRedir);
        }
    }
}
