import { Component } from '@angular/core';

import { SessionManager } from './services/SessionManager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TwiceCast';
  
  constructor(public sm:SessionManager) { }
}
