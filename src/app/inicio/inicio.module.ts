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

import { ValidaDirectorVicerrectorComponent } from '../valida-director-vicerrector/valida-director-vicerrector.component';
import { AprobarRechazarComponent } from '../aprobar-rechazar/aprobar-rechazar.component';
import { RechazarComponent } from '../rechazar/rechazar.component';
import { EliminarSolicitudComponent } from '../eliminar-solicitud/eliminar-solicitud.component';
import { DetallePartidaComponent } from '../detalle-partida/detalle-partida.component';
import { SubirArchivoComponent } from '../subir-archivo/subir-archivo.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ValidaDTIComponent } from '../valida-dti/valida-dti.component';
import { ValidaRectorAdministrativoComponent } from '../valida-rector-administrativo/valida-rector-administrativo.component';
import { ValidaTesoreriaComponent } from '../valida-tesoreria/valida-tesoreria.component';
import { CostoFinalComponent } from '../costo-final/costo-final.component';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
  declarations: [
    InicioComponent,
    NuevaComponent,
    TablaDinamicaComponent,
    ValidaDirectorVicerrectorComponent,
    AprobarRechazarComponent,
    RechazarComponent,
    EliminarSolicitudComponent,
    DetallePartidaComponent,
    SubirArchivoComponent,
    ProgressBarComponent,
    ValidaDTIComponent,
    ValidaRectorAdministrativoComponent,
    ValidaTesoreriaComponent,
    CostoFinalComponent

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
