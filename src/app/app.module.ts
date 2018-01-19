import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { HttpModule }    from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { SafeHtmlPipe } from './pipes/safeHtml.pipe';

import { SigninComponent } from './pages/signin/signin.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { ResetComponent } from './pages/reset/reset.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { ProfilListComponent } from './pages/profil/profilList.component';
import { ProfilDetailComponent } from './pages/profil/profilDetail.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { StreamComponent } from './pages/stream/stream.component';
import { ChatComponent } from './pages/stream/standaloneChat/chat.component';
import { CodeEditorComponent } from './pages/stream/standaloneCodeEditor/codeEditor.component';
import { PlayerComponent } from './pages/stream/standalonePlayer/player.component';
import { StreamListComponent } from './pages/stream/streamList.component';
import { LiveComponent } from './pages/live/live.component';
import { routing } from './app.routes';
import { PremiumComponent } from './pages/premium/premium.component';

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
        ForgotComponent,
        ResetComponent,
		SignupComponent,
        LogoutComponent,
		HomeComponent,
		ProfilComponent,
		ProfilListComponent,
        ProfilDetailComponent,
        LanguagesComponent,
        StreamComponent,
        ChatComponent,
        CodeEditorComponent,
        PlayerComponent,
        StreamListComponent,
        LiveComponent,
        PremiumComponent,

        SafeHtmlPipe
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
