export class Tag implements Serializable<Tag> {
    id: number;
    name: string;
    description: string;
    descriptionFull: string;

    deserialize(input) {
        this.id = input.id;
        this.name = input.name;
        this.description = input.short_description;
        this.descriptionFull = input.long_description;

        return this;
    }
}
