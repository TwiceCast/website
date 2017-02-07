import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { HttpModule }    from '@angular/http';

import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { ProfilListComponent } from './pages/profil/profilList.component';
import { ProfilDetailComponent } from './pages/profil/profilDetail.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { StreamComponent } from './pages/stream/stream.component';
import { routing } from './app.routes';

import { Logger } from './services/Logger.service';
import { APILinker } from './services/APILinker.service';

//import { CodemirrorModule } from 'ng2-codemirror';

@NgModule({
  imports: [
		BrowserModule,
        HttpModule,
		routing
	],
  declarations: [
		AppComponent,
		SigninComponent,
		SignupComponent,
		HomeComponent,
		ProfilComponent,
		ProfilListComponent,
        ProfilDetailComponent,
        LanguagesComponent,
        StreamComponent
	],
  providers:[
        Logger,
        APILinker
    ],
  bootstrap: [
		AppComponent
	]
})
export class AppModule {
    
}
