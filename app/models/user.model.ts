import { Country } from './country.model';
import { Rank } from './rank.model';

export class User {
    id: number;
    pseudo: string;
    email: string;
    country: Country;
    birthdate: any;
    rank: Rank;
    registerDate: any;
    lastVisitDate: any;
}
