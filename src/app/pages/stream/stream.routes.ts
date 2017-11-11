// Imports
// Deprecated import
// import { RouterConfig } from '@angular/router';
import { Routes } from '@angular/router';

import { StreamComponent }      from './stream.component';
import { ChatComponent }      from './standaloneChat/chat.component';
import { CodeEditorComponent }      from './standaloneCodeEditor/codeEditor.component';
import { PlayerComponent }      from './standalonePlayer/player.component';
import { StreamListComponent }  from './streamList.component';

// Route Configuration
export const streamRoutes: Routes = [
    { path: 'stream/:id/chat', component: ChatComponent },
    { path: 'stream/:id/code', component: CodeEditorComponent },
    { path: 'stream/:id/player', component: PlayerComponent },
    { path: 'stream/:id', component: StreamComponent },
    { path: 'streams', component: StreamListComponent },
    { path: 'streams/:clicked', component: StreamListComponent }
];
