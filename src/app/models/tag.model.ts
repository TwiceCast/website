export class Tag implements Serializable<Tag> {
    id: number;
    name: string;
    description: string;
    descriptionFull: User;
    
    deserialize(input) {
        this.id = input.id;
        this.name = input.name;
        this.description = input.short_description;
        this.owner = new User().deserialize(input.owner);

        return this;
    }
}
