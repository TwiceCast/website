import { User } from './user.model';
import { Tag } from './tag.model';

export class Stream implements Serializable<Stream> {
    id: number;
    title: string;
    description: string;
    owner: User;
    tags: Tag[];

    deserialize(input) {
        this.id = input.id;
        this.title = input.title;
        this.description = input.short_description;
        this.owner = new User().deserialize(input.owner);

        return this;
    }
}
