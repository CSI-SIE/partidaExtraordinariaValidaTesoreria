import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  //Subir archivo----------------

  //-----------------------------
  //Tabla---------------
  //resultadosPartidasExtraordinarias:any[] = [];

  //Tabla---------------
  resultadosPartidasExtraordinarias:any[] = [
    {
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
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    }
];

  pageSizeOptions = [5, 10, 20, 30, 40];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";
  //-------------------

  constructor(private router: Router) {


  }

  //TABLA-------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      descripcion: ['DESCRIPCION'],
      costo: ['COSTO'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      tipoSolicitud: ['TIPO SOLICITUD'],
      directorVicerrector: ['DIRECTOR / VICERRECTOR'],
      rector: ['RECTOR / DIR. ADMINISTRATIVO'],
      statusDTI: ['STATUS DTI'],
      statusCompras: ['STATUS COMPRAS'],
      editar: [''],
      paraMostrar: ['descripcion','costo','fechaSolicitud','tipoSolicitud', 'directorVicerrector','rector','statusDTI', 'statusCompras',  'editar']
    }

  };
//------------------------------------
  ngOnInit(): void {

  }

  btnClick() {
    this.router.navigateByUrl('/nuevo');
    console.log("di click");
  }


}
