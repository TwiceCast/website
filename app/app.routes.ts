// Imports
// Deprecated import
// import { provideRouter, RouterConfig } from '@angular/router';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { signinRoutes }    from './pages/signin/signin.routes';
import { signupRoutes }    from './pages/signup/signup.routes';
import { homeRoutes }    from './pages/home/home.routes';
import { profilRoutes }    from './pages/profil/profil.routes';

// Route Configuration
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
    // Add signin routes form a different file
  ...signinRoutes,
  ...signupRoutes,
  ...homeRoutes,
  ...profilRoutes
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
