// Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
    public inputGender: string;
    public inputBio: string;
    public inputBirth: string;
    public inputGitHub: string;
    public inputLinkedIn: string;
    
    user: User;
    
    constructor(private route: ActivatedRoute, private api:APILinker, private logg:Logger, private sm:SessionManager, private router: Router) {
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
        this.isEditing = true;
    }
    
    endEditing()
    {
        this.isEditing = false;
        let infos = {"gender": this.inputGender,"biography": this.inputBio,"birthdate": this.inputBirth, "github": this.inputGitHub, "linkdin": this.inputLinkedIn};
        this.api.patchUser(this.sm.getApiKey(), this.sm.getId(), infos);
    }
    
    removeUser()
    {
        if (confirm("The action you are about to take is going to DELETE PERMANENTLY your TwiceCast Account, Are you sure you want to do that ?"))
        {
            if (confirm("Are you definitely sure ? There is no going back after this time. Your informations are going to be deleted forever."))
            {
                this.api.removeUser(this.sm.getApiKey(), this.sm.getId());
                this.sm.Logout();
                this.router.navigate(['/home'])
            }
        }
    }
    
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.api.getUser(this.id).then(response => {
                this.user = response;
                this.inputBio = this.user.bio;
                this.inputBirth = this.user.birthdate;
                this.inputGender = this.user.gender;
                this.inputGitHub = this.user.github;
                this.inputLinkedIn = this.user.linkedin;
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
