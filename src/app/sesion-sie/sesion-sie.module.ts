import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/shared/material/material.module';
import { SesionSIERoutingModule } from './sesion-sie-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SesionSIERoutingModule,
    FlexLayoutModule,
    MaterialModule
  ]
})
export class SesionSieModule { }
