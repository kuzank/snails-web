import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonListComponent } from './list/person-list.component';
import { PersonDetailComponent } from './detail/person-detail.component';
import { OnlineComponent } from './online/online.component';
import { LoginListComponent } from './login-list/login-list.component';

const routes: Routes = [
  { path: 'list', component: PersonListComponent },
  { path: 'detail', component: PersonDetailComponent },
  { path: 'online', component: OnlineComponent },
  { path: 'login-list', component: LoginListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonRoutingModule {
}
