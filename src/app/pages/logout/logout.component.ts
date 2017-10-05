// Imports
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';

@Component({
    templateUrl: './logout.html',
    styleUrls: ['./logout.css', '../../app.component.css']
})

// Component class
export class LogoutComponent implements OnInit {

    constructor(private logg: Logger, public sm: SessionManager, private _location: Location) {this.sm.Logout();}

    ngOnInit() {
    }

    ngAfterViewInit() {
        this._location.back();
    }
}
