// Imports
import { Component, OnInit } from '@angular/core';

import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';

import * as $ from 'jquery';

@Component({
  templateUrl: './signup.html',
  styleUrls: ['./signup.css', '../../app.component.css'],
})

// Component class
export class SignupComponent implements OnInit {

    public inputNicknameSignup: string;
    public inputEmailSignup: string;
    public inputPasswordSignup: string;
    public inputRePasswordSignup: string;

    public registerState: string;

    constructor(private logg:Logger, public sm:SessionManager) {}

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
                }
                else
                    this.registerState = "error";
                this.logg.log(response);
            });
            this.logg.log("Trying to register");
        }
    }
}
