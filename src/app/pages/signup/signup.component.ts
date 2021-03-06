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

    public signupErrorMessage: string = "Sign Up Error!";

    public passwordRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';

    constructor(private logg:Logger, public sm:SessionManager, private router: Router) {}

    ngOnInit() {
        $("#signup_button").click(e => { e.preventDefault(); });
    }
    
    TryRegister() {
        let regxp = new RegExp(this.passwordRegex);
        if (!regxp.test(this.inputPasswordSignup) || !regxp.test(this.inputRePasswordSignup))
            this.registerState = "passwordRegexError";
        else if (this.inputRePasswordSignup != this.inputPasswordSignup)
            this.registerState = "passwordMismatch";
        else
        {
            this.registerState = "trying";
            this.sm.Register(this.inputEmailSignup, this.inputPasswordSignup, this.inputNicknameSignup).then(response => {
                if (response[0] == true) {
                    this.registerState = "success";
                    this.sm.Login(this.inputEmailSignup, this.inputPasswordSignup);
                    this.timeoutRedir = setTimeout(function() {this.router.navigate(['/home']); }.bind(this), 3000);
                }
                else {
                    this.registerState = "error";
                    this.signupErrorMessage = "Sign Up Error! " + response[1];
                }
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
