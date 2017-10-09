export class File implements Serializable<File> {
    maxPart: number;
    receivedPart: number = 0;
    name: string;
    private splittedContent: string[] = [];

    content: string;

    isComplete(): boolean {
        return this.receivedPart == this.maxPart;
    }

    deserialize(input) {
        this.maxPart = input.maxPart;
        this.name = input.name;

        if (input.name == '/.gitignore')
            console.log(input);
        this.splittedContent[+input.part] = input.content;
        this.receivedPart++;

        this.content = '';
        if (this.receivedPart == this.maxPart) {
            for (let i = 1; i <= this.maxPart; i++) {
                this.content += atob(this.splittedContent[i]);
            }
        }

        return this;
    }
}
