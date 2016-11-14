import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { routing } from './app.routes';

@NgModule({
  imports: [
		BrowserModule,
		routing
	],
  declarations: [
		AppComponent,
		SigninComponent,
		SignupComponent,
		HomeComponent
	],
  bootstrap: [
		AppComponent
	]
})
export class AppModule {
    
}
