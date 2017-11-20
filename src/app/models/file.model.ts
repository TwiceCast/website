export class File implements Serializable<File> {
    maxPart: number;
    receivedPart: number = 0;
    name: string;
    realName: string;
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
        this.realName = input.name;
        let splitName = this.realName.split('/');
        this.name = splitName[splitName.length - 1];
        this.fileLocked = false;

        if (input.name == '/.gitignore')
            console.log(input);
        console.log(input);
        this.splittedContent[+input.part] = input.content;
        this.receivedPart++;

        this.originalContent = '';
        if (this.receivedPart >= this.maxPart) {
            for (let i = 1; i <= this.maxPart; i++) {
                this.originalContent += atob(this.splittedContent[i]);
            }
			this.originalContent = this.originalContent;
            if (!this.fileLocked) {
                this.content = this.originalContent;
            }
            this.receivedPart = this.maxPart;
        }

        return this;
    }
}
