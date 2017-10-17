// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { StreamComponent }      from './stream.component';
import { StreamListComponent }  from './streamList.component';

// Route Configuration
export const streamRoutes: Routes = [
    { path: 'stream/:id', component: StreamComponent },
    { path: 'streams', component: StreamListComponent },
    { path: 'streams/:clicked', component: StreamListComponent }
];
