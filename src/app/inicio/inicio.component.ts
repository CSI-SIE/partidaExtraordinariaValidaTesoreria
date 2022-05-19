import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/shared/models/solicitud.model';
import { EliminarSolicitudComponent } from '../eliminar-solicitud/eliminar-solicitud.component';
import { CatalogosService } from '../services/catalogo.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  private suscripciones: Subscription[];

  //Subir archivo----------------

  //-----------------------------
  //Tabla---------------
  resultadosPartidasExtraordinarias:any[] = [];

  //Tabla---------------
  /*resultadosPartidasExtraordinarias:any[] = [
    {
      id: 1,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 2,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 3,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 4,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 22,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    }
  ];*/

  pageSizeOptions = [5, 10, 20, 30, 40];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";
  //-------------------

  constructor(private router: Router,private _catalogosService: CatalogosService,
    public dialog: MatDialog) {
    this.resultadosPartidasExtraordinarias = [];

  }

  //TABLA-------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      idRegistro: ['id'],
      descripcion: ['DESCRIPCION'],
      costo: ['COSTO'],
      fechaSolicitud: ['FECHA SOLICITUD'],//<<<<<<<<
      tipoPartida: ['TIPO SOLICITUD'], //<<<<<<<<
      validaDirectorVicerrector: ['DIRECTOR / VICERRECTOR'], //<<<<<<<<
      validaRectorDirAdmin: ['RECTOR / DIR. ADMINISTRATIVO'], //<<<<<<<<
      validaDTI: ['STATUS DTI'], //<<<<<<<<
      statusCompras: ['STATUS COMPRAS'],//<<<<<<<<
      editar: [''],
      paraMostrar: ['idRegistro','descripcion','costo','fechaSolicitud','tipoPartida', 'validaDirectorVicerrector','validaRectorDirAdmin','validaDTI', 'statusCompras',  'editar']
    }

  };
//------------------------------------
  ngOnInit(): void {

    this.resultadosPartidasExtraordinarias = [];

    const obtenerResultados$ = this._catalogosService.obtenerListadoSolicitudesPorPersona().subscribe(
      {
        next:(data) => {
          this.resultadosPartidasExtraordinarias = data;

          console.log(this.resultadosPartidasExtraordinarias);
        },
        error: (errores) => {
          console.error(errores);
        },
        complete:() => {}
      }
    );
      this.suscripciones.push(obtenerResultados$);
  }

  btnClick() {
    this.router.navigateByUrl('/nuevo');
    console.log("di click");
  }




}
