import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SystemRoutingModule } from './system-routing.module';
import { HttplogListComponent } from './httplog/httplog-list.component';
import { ExceptioListComponent } from './exceptio/exceptio-list.component';
import { OrgunitComponent } from './orgunit/orgunit.component';
import { MenuComponent } from './menu/menu.component';
import { MenuPermissionViewComponent } from './menu/permission-view/menu-permission-view.component';
import { SelectitemComponent } from './selectitem/selectitem.component';

const COMPONENTS = [
  ExceptioListComponent,
  HttplogListComponent,
  OrgunitComponent,
  MenuComponent,
  SelectitemComponent
];

const COMPONENTS_NOROUNT = [
  MenuPermissionViewComponent,
];

@NgModule({
  imports: [SharedModule, SystemRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SystemModule {
}
