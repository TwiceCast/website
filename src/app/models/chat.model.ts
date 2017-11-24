export class ChatMessage implements Serializable<ChatMessage> {
    id: number;
    author: string;
    displayName: string;
    rank: number;
    message: string;
    
    deserialize(input) {
        this.id = input.id;
        this.author = input.user;
        this.displayName = input.displayName;
        this.rank = +input.rank;
        this.message = input.content;

        return this;
    }
}
