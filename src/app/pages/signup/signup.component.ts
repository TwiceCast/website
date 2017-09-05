// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';

import * as $ from 'jquery';

@Component({
  templateUrl: './signup.html',
  styleUrls: ['./signup.css', '../../app.component.css'],
})

// Component class
export class SignupComponent implements OnInit, OnDestroy {

    public inputNicknameSignup: string;
    public inputEmailSignup: string;
    public inputPasswordSignup: string;
    public inputRePasswordSignup: string;

    public registerState: string;
    
    private timeoutRedir: any;

    constructor(private logg:Logger, public sm:SessionManager, private router: Router) {}

    ngOnInit() {
        $("#signup_button").click(e => { e.preventDefault(); });
    }
    
    TryRegister() {
        if (this.inputRePasswordSignup != this.inputPasswordSignup)
            this.registerState = "passwordMismatch";
        else
        {
            this.registerState = "trying";
            this.sm.Register(this.inputEmailSignup, this.inputPasswordSignup, this.inputNicknameSignup).then(response => {
                if (response == true) {
                    this.registerState = "success";
                    this.sm.Login(this.inputEmailSignup, this.inputPasswordSignup);
                    this.timeoutRedir = setTimeout(function() {this.router.navigate(['/home']); }.bind(this), 3000);
                }
                else
                    this.registerState = "error";
                this.logg.log(response);
            });
            this.logg.log("Trying to register");
        }
    }
    
    ngOnDestroy() {
        if (this.timeoutRedir) {
            clearTimeout(this.timeoutRedir);
        }
    }
}
