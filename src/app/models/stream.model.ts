import { User } from './user.model';

export class Stream implements Serializable<Stream> {
    id: number;
    title: string;
    owner: User;
    
    deserialize(input) {
        this.id = input.ID;
        this.title = input.title;
        this.owner = new User().deserialize(input.owner);

        return this;
    }
}
