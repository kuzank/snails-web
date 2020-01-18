import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExceptioListComponent } from './exceptio/exceptio-list.component';
import { HttplogListComponent } from './httplog/httplog-list.component';
import { OrgunitComponent } from './orgunit/orgunit.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: 'exceptio/list', component: ExceptioListComponent },
  { path: 'httplog/list', component: HttplogListComponent },
  { path: 'orgunit', component: OrgunitComponent },
  { path: 'menu', component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {
}
