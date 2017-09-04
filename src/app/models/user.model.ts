import { Country } from './country.model';
import { Rank } from './rank.model';

export class User implements Serializable<User> {
    id: number;
    pseudo: string;
    email: string;
    country: Country;
    birthdate: any;
    rank: Rank;
    registerDate: any;
    lastVisitDate: any;
    
    deserialize(input) {
        console.log(input);
        this.id = +input.id;
        this.pseudo = input.name;
        this.email = input.email;
        //this.birthdate = input.birthdate;
        //this.rank = new Rank().deserialize(input.rank);
        this.registerDate = input.registerDate;
        //this.lastVisitDate = input.lastVisitDate;
        
        return this;
    }
}
