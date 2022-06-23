import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SesionSieComponent } from './sesion-sie.component';

const routes: Routes = [
  {
    path: '', component: SesionSieComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SesionSIERoutingModule { }
