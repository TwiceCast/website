// Imports
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'brace';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/mode/c_cpp';
import 'brace/mode/yaml';
import 'brace/mode/css';
import 'brace/mode/html';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/json';

import * as $ from 'jquery';

import { Stream } from '../../../models/stream.model';
import { File } from '../../../models/file.model';

import { TreeModule, TreeComponent, TreeNode } from 'angular-tree-component';

import { SessionManager } from '../../../services/SessionManager.service';
import { FileSystemLinker } from '../../../services/FileSystemLinker.service';
import { APILinker } from '../../../services/APILinker.service';

@Component({
  selector: 'component-streamLayout',
  templateUrl: './codeEditor.html',
  styleUrls: ['./codeEditor.css', '../../../app.component.css'],
})
export class CodeEditorComponent implements OnInit, OnDestroy {
    @ViewChild('editor') editor;
    public codeEditorOptions:any;
    public code:string;
    private id: number;
    private sub: any;

    public stream: Stream;

    public showLanguage = true;
    public language = "C/C++";
    public Languages = [
        {'title': 'C/C++', 'file': 'c_cpp'},
        {'title': 'YAML', 'file': 'yaml'},
        {'title': 'CSS', 'file': 'css'},
        {'title': 'HTML', 'file': 'html'},
        {'title': 'JavaScript', 'file': 'javascript'},
        {'title': 'JSON', 'file': 'json'},
        {'title': 'Java', 'file': 'java'}
    ];

    // reference to the element itself, we use this to access events and methods
    private _elementRef: ElementRef;

    constructor(private sm:SessionManager, private fl:FileSystemLinker, private route: ActivatedRoute, private router: Router, private linker:APILinker) { }

    private receivedFiles: File[] = [];

    @ViewChild(TreeComponent)
    private tree: TreeComponent;
    public nodes = [];

    public openedFiles: File[] = [];
    public _selectedFile: File = null;

    onChangeCodeInsideEditor(code)
    {
        this.code = code;
        if (this._selectedFile != null) {
            this._selectedFile.lockFile(true);
            this._selectedFile.content = this.code;
        }
    }

    ngAfterViewInit(){
        this.editor.setTheme("tomorrow_night_eighties");
        this.editor.setMode("c_cpp");
        this.editor.setOptions({minLines: 45, maxLines: 45});
    }

    logCode()
    {
        console.log(this.code);
    }

    ngOnInit() {
        this.fl.AuthStateChanged.subscribe(this.fl.getFiles.bind(this.fl));
        this.fl.ReceivedFile.subscribe(this.receivedFile.bind(this));

        // Get Stream ID
        this.sub = this.route.params.subscribe(params => { this.id = params['id'] });

        this.codeEditorOptions = {
            maxLines: 10,
            printMargin: true
        };

        ///
        /// Init file system
        ///
        this.linker.getStream(this.id).then((resp_stream) => {
            console.log(resp_stream);
            this.stream = resp_stream;
            this.sm.checkToken().then((token_valid) => {
                this.linker.getRepository(this.sm.getApiKey(), this.id).then((response) => {
                    console.log(response);
                    let rep_info = JSON.parse(response['_body']);
                    this.fl.connect(rep_info.url).then((resp) => {
                        if (resp) {
                            this.fl.auth(rep_info.token, this.sm.getUser().pseudo, this.stream.owner.pseudo, this.stream.title);
                        }
                    });
                });
            });
        });
        this.nodes.push(this.rootNode);
        this.tree.treeModel.update();
    }

    private receivedFile(content: any) {
        if (content.name in this.receivedFiles) {
            let wasComplete = this.receivedFiles[content.name].isComplete();
            this.receivedFiles[content.name].deserialize(content);
            if (wasComplete) {
                this.fileUpdated(this.receivedFiles[content.name]);
            } else if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        } else {
            this.receivedFiles[content.name] = new File().deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        }
    }

    public closeOpenedFile(openedfile: File): void {
        let index = this.openedFiles.indexOf(openedfile);
        let selectNew = false;
        console.log("remove");
        if (index > -1) {
            if (this._selectedFile == this.openedFiles[index]) {
                console.log("select new");
                selectNew = true;
            }
            if (index == 0 || index == this.openedFiles.length - 1) {
                this.openedFiles.pop();
            } else {
                this.openedFiles.splice(index, 1);
            }
            if (selectNew) {
                if (index - 1 <= 0 && this.openedFiles.length > 0) {
                    console.log("s1");
                    this.SelectOpenedFile(this.openedFiles[0]);
                } else if (this.openedFiles.length >= index - 1 && this.openedFiles.length > 0) {
                    console.log("s2");
                    this.SelectOpenedFile(this.openedFiles[index - 1]);
                } else if (this.openedFiles.length > 0) {
                    console.log("s3");
                    this.SelectOpenedFile(this.openedFiles[this.openedFiles.length - 1]);
                } else {
                    console.log("s4");
                    this._selectedFile = null;
                    this.code = "";
                }
            }
        }
    }

    public SelectOpenedFile(openedfile: File): void {
        if (openedfile != null) {
            this._selectedFile = openedfile;
            this.code = openedfile.content;
        }
    }

    public reloadFile(openedfile: File): void {
        openedfile.content = openedfile.originalContent;
        openedfile.lockFile(false);
        this.SelectOpenedFile(openedfile);
    }

    public fileSelected($event) {
        let clicked = $event.node.data;
        if (clicked.type == 'file') {
            let file_ref = this.receivedFiles[clicked.id];
            if (this.openedFiles.indexOf(file_ref) < 0) {
                this.openedFiles.push(file_ref);
            }
            this.SelectOpenedFile(file_ref);
        }
    }

    private addFolder(rootNode: any, folder: string): any {
        let foundFolder = false;
        let result = rootNode;
        if (rootNode != null && rootNode.children != null) {
            for (let i = 0; i < rootNode.children.length; i++) {
                if (rootNode.children[i].name == folder) {
                    foundFolder = true;
                    result = rootNode.children[i];
                }
            }
        }

        if (!foundFolder) {
            result = {name: folder, type: 'folder', children:[]};
            rootNode.children.push(result);
        }

        return result;
    }

    private createSubFolders(path: string) {
        let divided = path.split('/');
        let folder = this.rootNode;
        if (divided.length > 2) {
            for (let i = 1; i < divided.length - 1; i++) {
                console.log(divided);
                if (divided[i] == '') {
                    divided[i] = '/';
                }
                folder = this.addFolder(folder, divided[i]);
            }
        }

        return folder;
    }

    private fileUpdated(file: File) {
        if (this._selectedFile == file && !file.isLocked()) {
            this.SelectOpenedFile(file);
        }
    }
    
    public rootNode: any = {name: '/', type: 'folder', children:[]};
    private fileCompleted(fileName: string) {
        let fileNode: any = {};
        fileNode.id = fileName;
        let fileNameSplit = fileName.split('/');
        fileNode.name = fileNameSplit[fileNameSplit.length - 1];
        fileNode.type = 'file';
        fileNode.children = [];
        let folder = this.createSubFolders(fileName);
        folder.children.push(fileNode);
        //this.nodes.push(fileNode);
        this.tree.treeModel.update();
    }

    private switchLanguage(lang:any) {
        console.log(lang);
        this.editor.setMode('' + lang.file);
        this.language = lang.title;
    }

    ngAfterViewChecked() {
        $('footer').remove();
        $('nav').remove();
    }

    ngOnDestroy() {
        this.fl.disconnect();
        this.sub.unsubscribe();
    }
}
