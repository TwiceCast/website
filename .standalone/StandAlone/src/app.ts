import {Component} from '@angular/core';
import 'codemirror/mode/javascript/javascript';

var sampleCode = `function my_putchar(c)
{
  console.log("TwiceCast FTW !");
  alert(c);
}`;

@Component({
  selector: 'my-app',
  template: `<div>
    <h1>Test de Codemirror seul pour TwiceCast</h1>

    <codemirror [(ngModel)]="code" [config]="config"></codemirror>
    <button (click)='logCode()'>Console.log du code</button>
  </div>`,
})
export class App {
  constructor() {
    
    this.config = {
      lineNumbers: true,
      mode: {
        name: 'javascript',
        json: true
      }
    };

    this.code = sampleCode;
  }
    
    logCode()
    {
        console.log(this.code);
    }
}