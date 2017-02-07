// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { ProfilComponent }          from './profil.component';
import { ProfilListComponent }      from './profilList.component';
import { ProfilDetailComponent }    from './profilDetail.component';

// Route Configuration
export const profilRoutes: Routes = [
    { path: 'profil', component: ProfilComponent,
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: ProfilListComponent },
        { path: ':id', component: ProfilListComponent }
    ]}
];
