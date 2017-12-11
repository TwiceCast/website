// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';

import * as $ from 'jquery';

@Component({
  selector: 'component-Forgot',
  templateUrl: './forgot.html',
  styleUrls: ['./forgot.css', '../../app.component.css'],
})
// Component class
export class ForgotComponent implements OnInit, OnDestroy {
    
    public inputEmailForgot: string;
    
    public mailSent: string;
    
    constructor(private logg:Logger, public sm:SessionManager, private router: Router) {
        this.mailSent = "";
    }
    
    ngOnInit() {
        $("#forgot_button").click(e => { e.preventDefault(); });
    }
    
    TryForgot() {
        this.mailSent = this.inputEmailForgot;
        console.log(this.mailSent);
    }
    
    ngOnDestroy() {
    }
}
