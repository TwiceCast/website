export class ChatMessage implements Serializable<ChatMessage> {
    id: number;
    author: string;
    message: string;
    
    deserialize(input) {
        this.id = input.ID;
        this.author = input.user;
        this.message = input.content;

        return this;
    }
}
