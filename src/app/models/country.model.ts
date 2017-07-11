export class Country implements Serializable<Country> {
    id: number;
    code: string;
    name: string;
    
    deserialize(input) {
        this.id = input.ID;
        this.code = input.code;
        this.name = input.name;

        return this;
    }
}
