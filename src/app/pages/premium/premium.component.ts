// Imports
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery';

import { SessionManager } from '../../services/SessionManager.service';
import { APILinker } from '../../services/APILinker.service';

@Component({
  selector: 'component-premium',
  templateUrl: './premium.html',
  styleUrls: ['./premium.css', '../../app.component.css'],
})
export class PremiumComponent implements OnInit {

    constructor(private sm:SessionManager, private route: ActivatedRoute, private router: Router, private linker:APILinker) { }

    ngOnInit() {
        setTimeout(() => { this.addPremium(); }, 3000);
    }

    private addPremium() {
        console.log('salut');
        if (this.sm.isLogged()) {
            this.linker.addUserPremium(this.sm.getId(), 31, this.sm.getApiKey()).then(() => {
                this.router.navigate(['/home']);
            });
        } else {
            this.router.navigate(['/home']);
        }
    }
}
