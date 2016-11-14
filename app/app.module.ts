import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { SigninComponent }      from './pages/signin/signin.component';
import { HomeComponent }      from './pages/home/home.component';
import { routing } from './app.routes';

@NgModule({
  imports: [
		BrowserModule,
		routing
	],
  declarations: [
		AppComponent,
		SigninComponent,
		HomeComponent
	],
  bootstrap: [
		AppComponent
	]
})
export class AppModule {
    
}
