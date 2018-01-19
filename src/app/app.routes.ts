// Imports
// Deprecated import
// import { provideRouter, RouterConfig } from '@angular/router';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { signinRoutes }    from './pages/signin/signin.routes';
import { forgotRoutes }    from './pages/forgot/forgot.routes';
import { resetRoutes }    from './pages/reset/reset.routes';
import { signupRoutes }    from './pages/signup/signup.routes';
import { logoutRoutes }    from './pages/logout/logout.routes';
import { homeRoutes }    from './pages/home/home.routes';
import { profilRoutes }    from './pages/profil/profil.routes';
import { languagesRoutes }    from './pages/languages/languages.routes'
import { streamRoutes }     from './pages/stream/stream.routes';
import { liveRoutes }       from './pages/live/live.routes';
import { premiumRoutes }     from './pages/premium/premium.routes';

// Route Configuration
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
    // Add routes from all files
  ...signinRoutes,
  ...forgotRoutes,
  ...resetRoutes,
  ...signupRoutes,
  ...logoutRoutes,
  ...homeRoutes,
  ...profilRoutes,
  ...languagesRoutes,
  ...streamRoutes,
  ...liveRoutes,
  ...premiumRoutes,
  // Redirection all unknow routes to home page
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
