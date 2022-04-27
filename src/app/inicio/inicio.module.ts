import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio.component';
import { InicioRoutingModule } from './inicio-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatNativeDateModule } from '@angular/material/core';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MaterialModule } from 'src/shared/material/material.module';
import { MatDividerModule } from '@angular/material/divider';
import { NuevaComponent } from '../nueva/nueva.component';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { UploadComponent } from '../subirArchivos/upload/upload.component';
import { DownloadComponent } from '../subirArchivos/download/download.component';
import { FileManagerComponent } from '../subirArchivos/file-manager/file-manager.component';
import { UploadDownloadService } from '../services/upload-download.service';



@NgModule({
  declarations: [
    InicioComponent,
    NuevaComponent,
    TablaDinamicaComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    InicioRoutingModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    FlexLayoutModule,
    MatDividerModule

  ],
  providers: [],
  bootstrap: []
})
export class InicioModule { }
