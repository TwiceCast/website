import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { HttpModule }    from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { ProfilListComponent } from './pages/profil/profilList.component';
import { ProfilDetailComponent } from './pages/profil/profilDetail.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { StreamComponent } from './pages/stream/stream.component';
import { LiveComponent } from './pages/live/live.component'
import { routing } from './app.routes';

import { Logger } from './services/Logger.service';
import { APILinker } from './services/APILinker.service';
import { SessionManager } from './services/SessionManager.service';
import { FileSystemLinker } from './services/FileSystemLinker.service';
import { ChatService } from './services/ChatService.service';

import { AceEditorModule } from 'ng2-ace-editor';

import 'brace';

import { TreeModule } from 'angular-tree-component';

import { AlertModule } from 'ngx-bootstrap/alert';


@NgModule({
  imports: [
		BrowserModule,
        HttpModule,
        FormsModule,
		routing,
        AceEditorModule,
        TreeModule,
        AlertModule.forRoot()
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
        StreamComponent,
        LiveComponent
	],
  providers:[
        Logger,
        APILinker,
		SessionManager,
        FileSystemLinker,
        ChatService
    ],
  bootstrap: [
		AppComponent
	]
})
export class AppModule {
    
}
