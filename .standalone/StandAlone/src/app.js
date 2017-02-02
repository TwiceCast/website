"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
require('codemirror/mode/javascript/javascript');
var sampleCode = "function my_putchar(c)\n{\n  console.log(\"TwiceCast FTW !\");\n  alert(c);\n}";
var App = (function () {
    function App() {
        this.config = {
            lineNumbers: true,
            mode: {
                name: 'javascript',
                json: true
            }
        };
        this.code = sampleCode;
    }
    App.prototype.logCode = function () {
        console.log(this.code);
    };
    App = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "<div>\n    <h1>Test de Codemirror seul pour TwiceCast</h1>\n\n    <codemirror [(ngModel)]=\"code\" [config]=\"config\"></codemirror>\n    <button (click)='logCode()'>Console.log du code</button>\n  </div>",
        }), 
        __metadata('design:paramtypes', [])
    ], App);
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map