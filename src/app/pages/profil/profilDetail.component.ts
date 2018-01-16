// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/user.model';
import { APILinker } from '../../services/APILinker.service';
import { Logger } from '../../services/Logger.service';
import { SessionManager } from '../../services/SessionManager.service';

import * as $ from 'jquery';

@Component({
  selector: 'component-profilDetail',
  templateUrl: './profilDetail.html',
  styleUrls: ['./profilDetail.css', '../../app.component.css'],
})

// Component class
export class ProfilDetailComponent implements OnInit, OnDestroy {
    public id: number;
    public isCurrentUser: boolean = false;
    public isEditing : boolean = false;
    private sub: any;
    public inputPasswordChanger: string;
    
    user: User;
    
    constructor(private route: ActivatedRoute, private api:APILinker, private logg:Logger, private sm:SessionManager) {
    }
    
    changePassword() {
        this.api.changePassword(this.sm.getApiKey(), this.sm.getId(), this.inputPasswordChanger);
        this.inputPasswordChanger = "";
    }
    
    public fileChangeEvent(fileInput: any){
        if (fileInput.target.files && fileInput.target.files[0]) {
            var reader = new FileReader();
    
            reader.onload = (e:any) => {
                var imageUrl = e.target.result;
                $('#picture').attr('src', imageUrl);
            }

            reader.readAsDataURL(fileInput.target.files[0]);
            this.api.changeAvatar(this.sm.getApiKey(), this.sm.getId(), fileInput.target.files[0]);
        }
    }

    startEditing()
    {
        // MAKING FORM AVAILABLE
        this.isEditing = true;
    }
    
    endEditing()
    {
        // SUBMIT FORM AND DISABLE INPUTS
        this.isEditing = false;
    }
    
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.api.getUser(this.id).then(response => {
                this.user = response;
                this.sm.RetrieveUser()
                if (this.sm.getUser().id == this.id)
                {
                    this.isCurrentUser = true;
                }
            });
        });            
    }
    
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
