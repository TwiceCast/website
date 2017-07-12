// Imports
import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';

@Component({
  templateUrl: './signup.html',
  styleUrls: ['./signup.css', '../../app.component.css'],
})

// Component class
export class SignupComponent implements OnInit {

    ngOnInit() {
        $('alert').hide();
    }
}
