// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APILinker } from '../../services/APILinker.service';

import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';

import * as $ from 'jquery';

@Component({
  selector: 'component-Reset',
  templateUrl: './reset.html',
  styleUrls: ['./reset.css', '../../app.component.css'],
})
// Component class
export class ResetComponent implements OnInit, OnDestroy {
    public token:string;
    private sub: any;
    public error:string;
    public inputPasswordOne: string;
    public inputPasswordTwo: string;
    
    public password: string;
    
    constructor(private linker:APILinker, private logg:Logger, public sm:SessionManager, private router: Router, private route: ActivatedRoute) {
        this.password = "";
        this.error = "";
    }
    
    ngOnInit() {
        $("#reset_button").click(e => { e.preventDefault(); });
        // Get Reset Token
        this.sub = this.route.params.subscribe(params => { this.token = params['token'] })
    }
    
    TryReset() {
        if (this.inputPasswordOne != this.inputPasswordTwo)
        {
            this.password = "";
            this.error = "Passwords Mismatched";
        }
        else
        {
            this.error = "";
            this.password = this.inputPasswordOne;
            this.linker.reset(this.token, this.password);
        }
    }
    
    ngOnDestroy() {
    }
}
