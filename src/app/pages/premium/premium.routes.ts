// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { PremiumComponent }      from './premium.component';

// Route Configuration
export const premiumRoutes: Routes = [
    { path: 'premium/success', component: PremiumComponent }
];
