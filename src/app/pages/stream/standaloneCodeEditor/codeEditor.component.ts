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
    public code:String;
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

    onChangeCodeInsideEditor(code)
    {
        this.code = code;
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
            this.receivedFiles[content.name].deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        } else {
            this.receivedFiles[content.name] = new File().deserialize(content);
            if (this.receivedFiles[content.name].isComplete()) {
                this.fileCompleted(content.name);
            }
        }
    }

    public fileSelected($event) {
        let clicked = $event.node.data;
        if (clicked.type == 'file') {
            let file_ref = this.receivedFiles[clicked.id];
            console.log(file_ref.isComplete());
            console.log(file_ref.content);
            this.code = file_ref.content;
        }
    }

    private createSubFolders(path: any) {

    }

    public rootNode: any = {name: '/', type: 'folder', children:[]};
    private fileCompleted(fileName: string) {
        let fileNode: any = {};
        fileNode.id = fileName;
        let fileNameSplit = fileName.split('/');
        fileNode.name = fileNameSplit[fileNameSplit.length - 1];
        fileNode.type = 'file';
        fileNode.children = [];
        this.rootNode.children.push(fileNode);
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
