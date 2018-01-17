import { Country } from './country.model';
import { Rank } from './rank.model';

export class User implements Serializable<User> {
    id: number;
    pseudo: string;
    email: string;
    gender: string;
    country: Country;
    bio: any;
    birthdate: any;
    github: string;
    linkedin: string;
    rank: Rank;
    registerDate: any;
    lastVisitDate: any;
    
    deserialize(input) {
        this.id = +input.id;
        this.pseudo = input.name;
        this.email = input.email;
        this.gender = input.gender;
        this.bio = input.biography;
        this.birthdate = input.birthdate;
        this.github = input.github;
        this.linkedin = input.linkdin;
        //this.rank = new Rank().deserialize(input.rank);
        this.registerDate = input.registerDate;
        //this.lastVisitDate = input.lastVisitDate;
        
        return this;
    }
}
