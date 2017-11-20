export class File implements Serializable<File> {
    maxPart: number;
    receivedPart: number = 0;
    name: string;
    private splittedContent: string[] = [];

    content: string;
    originalContent: string;
    private fileLocked: boolean;

    isComplete(): boolean {
        return this.receivedPart == this.maxPart;
    }

    isModified(): boolean {
        return this.content != this.originalContent;
    }

    lockFile(lock: boolean): void {
        this.fileLocked = lock;
    }

    deserialize(input) {
        this.maxPart = input.maxPart;
        this.name = input.name;
        this.fileLocked = false;

        if (input.name == '/.gitignore')
            console.log(input);
        this.splittedContent[+input.part] = input.content;
        this.receivedPart++;

        this.content = '';
        if (this.receivedPart >= this.maxPart) {
            for (let i = 1; i <= this.maxPart; i++) {
                this.content += this.splittedContent[i];
            }
			this.originalContent = atob(this.content);
            if (!this.fileLocked) {
                this.content = atob(this.content);
            }
            this.receivedPart = this.maxPart;
        }

        return this;
    }
}
