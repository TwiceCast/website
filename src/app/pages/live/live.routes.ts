// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { LiveComponent }    from './live.component';

// Route Configuration
export const liveRoutes: Routes = [
  { path: 'live/:id', component: LiveComponent }
];
