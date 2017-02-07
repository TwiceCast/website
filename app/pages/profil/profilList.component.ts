// Imports
import { Component } from '@angular/core';

import { User } from '../../models/user.model';
import { APILinker } from '../../services/APILinker.service';
import { Logger } from '../../services/Logger.service';

@Component({
  selector: 'component-profilList',
  templateUrl: 'app/pages/profil/profilList.html',
})

// Component class
export class ProfilListComponent {
    private users: User[];

    constructor(private api:APILinker, private logg:Logger) {
        api.getUsers().then(response => this.users = response);
    }

}
