import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {FormsModule} from '@angular/forms';
import {App} from './app';

import {CodemirrorModule} from 'ng2-codemirror';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    CodemirrorModule
  ],
  declarations: [
    App,
  ],
  bootstrap: [App]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);