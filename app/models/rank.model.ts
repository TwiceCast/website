export class Rank implements Serializable<Rank> {
    id: number;
    title: string;
    
    deserialize(input) {
        this.id = input.ID;
        this.title = input.title;

        return this;
    }
}
