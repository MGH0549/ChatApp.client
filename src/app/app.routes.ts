import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Messages } from './messages/messages';
import { AdminPanel } from './Admin/admin-panel/admin-panel';
import { AuthGuard } from './_guards/auth.guard';
import { AdminGuard } from './_guards/admin.guard';
import { List } from './list/list';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { MembersList } from './Members/members-list/members-list';
import { MemberEdit } from './Members/member-edit/member-edit';
import { MemberDatail } from './Members/member-datail/member-datail';
import { MemberDetailedResolver } from './_resolvers/member-detailed.resolver';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home',component:Home},
    {path:'',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children:[
        {path: 'admin', component: AdminPanel, canActivate: [AdminGuard]},
        {path: 'messages', component: Messages},
        {path:'lists',component:List},
        {path: 'members', component: MembersList},
        {path: 'members/:username', component: MemberDatail, resolve: {member: MemberDetailedResolver}},
        {path: 'member/edit', component: MemberEdit, canDeactivate: [PreventUnsavedChangesGuard]},

        ]
    },
    {path: 'errors', component: TestErrorComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: '**', component: NotFoundComponent, pathMatch: 'full'},

];
