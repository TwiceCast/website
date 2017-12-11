// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { ResetComponent }    from './reset.component';

// Route Configuration
export const resetRoutes: Routes = [
  { path: 'reset/:token', component: ResetComponent }
];
