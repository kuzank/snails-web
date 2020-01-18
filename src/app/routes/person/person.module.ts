import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PersonRoutingModule } from './person-routing.module';
import { PersonListComponent } from './list/person-list.component';
import { PersonDetailComponent } from './detail/person-detail.component';
import { OnlineComponent } from './online/online.component';
import { LoginListComponent } from './login-list/login-list.component';

const COMPONENTS = [
  PersonListComponent,
  PersonDetailComponent,
  OnlineComponent,
  LoginListComponent,
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, PersonRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class PersonModule {
}
