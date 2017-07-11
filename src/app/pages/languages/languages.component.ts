// Imports
import { Component } from '@angular/core';

@Component({
  templateUrl: './languages.html',
  styleUrls: ['./languages.css', '../../app.component.css'],
})

// Component class
export class LanguagesComponent {
    public languages:Array<any>;
    public tags:Array<any>;
    
    constructor()
    {
        this.languages = [
            {name: 'Unity 3D', image: 'https://www.hyperlinkinfosystem.com/assets/blogimages/Unity%205%20image%202(1).png'},
            {name: 'Unreal Engine 4', image: 'https://www.popcornfx.com/wp-content/uploads/2016/04/ue_logo2_200.png'},
            {name: 'iOS', image: 'http://cvbj.biz/wp-content/uploads/2014/09/Apple-logo-icon-Aluminum.png'},
            {name: 'Javascript', image: 'http://www.devictio.fr/wp-content/uploads/logo_javascript.png'},
            {name: 'Android', image: 'https://crackberry.com/sites/crackberry.com/files/styles/large/public/topic_images/2013/ANDROID.png?itok=xhm7jaxS'},
            {name: 'Ionic', image: 'https://www.redfroggy.fr/wp-content/uploads/2016/03/2.png'},
            {name: 'macOS', image: 'https://upload.wikimedia.org/wikipedia/fr/0/00/Finder.png'},
            {name: 'Ruby', image: 'https://cdn.codementor.io/assets/topic/category_header/ruby-on-rails-bc9ab2af8d92eb4e7eb3211d548a09ad.png'},
            {name: 'Python', image: 'http://www.icone-png.com/png/53/53385.png'},
            {name: 'C#', image: 'http://jeroendj.be/assets/img/Icons/c.ico'},
            {name: 'Php', image: 'http://www.icone-png.com/png/26/26451.png'},
            {name: 'PhoneGap', image: 'http://plainicon.com/dboard/userprod/2800_a1826/prod_thumb/plainicon.com-50297-256px-c0b.png'},
            {name: 'C++', image: 'http://www.hashin.in/hash/_layout/images/expertise/cpp.png'},
            {name: 'Django', image: 'http://www.unixstickers.com/image/cache/data/buttons/png/django-600x600.png'},
            {name: 'Cordova', image: 'https://cordova.apache.org/static/img/cordova_bot.png'},
            {name: 'Rails', image: 'https://www.codeur.com/system/images/files/000/000/071/original/logo_ruby_on_rails.png?1411054278'},
            {name: 'Windows', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Windows_logo_-_2012.svg/2000px-Windows_logo_-_2012.svg.png'},
            {name: 'C', image: 'http://www.pskills.org/image/c.png'},
            {name: 'Windows Phone', image: 'http://dolphinradio.org/wp-content/uploads/2014/07/windows-phone-7-logo.png'},
            {name: 'Shell Script', image: 'http://www.icone-png.com/png/27/27039.png'},
            {name: 'Perl', image: 'http://www.aliencoders.org/wp-content/uploads/2016/09/perl-logo.png'}
        ];
        this.tags = [
            {name: 'Graphics', icon:'', class: 'tag'},
            {name: 'Web', icon:'', class: 'tag'},
            {name: 'Mobile', icon:'', class: 'tag'},
            {name: 'Scripting', icon:'', class: 'tag'},
            {name: 'Framework', icon:'', class: 'tag'},
            {name: 'Mobile', icon:'', class: 'tag'},
            {name: 'GameDev', icon:'', class: 'tag'},
            {name: 'Scripting', icon:'', class: 'tag'},
            {name: 'Graphics', icon:'', class: 'tag'},
            {name: 'Framework', icon:'', class: 'tag'},
            {name: 'Web', icon:'', class: 'tag'},
            {name: 'GameDev', icon:'', class: 'tag'}
        ]
    }

    toggleTag(tag)
    {
        if (tag.icon == '')
        {
            tag.icon = 'glyphicon-ok';
            tag.class = 'tag_active';
        }
        else
        {
            tag.icon = '';
            tag.class = 'tag';
        }
    }
}