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
  resultadosPartidasExtraordinarias:any[] = [];
  pageSizeOptions = [5, 10, 20, 30, 40];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";
  //-------------------

  constructor(private router: Router) {


  }

  //TABLA-------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    valoresQuejaSugerencia: {
      descripcion: ['DESCRIPCION'],
      costo: ['COSTO'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      tipoSolicitud: ['TIPO SOLICITUD'],
      directorVicerrector: ['DIRECTOR / VICERRECTOR'],
      rector: ['RECTOR / DIR. ADMINISTRATIVO'],
      statusDTI: ['STATUS DTI'],
      statusCompras: ['STATUS COMPRAS'],
      ver: ['Ver'],
      paraMostrar: ['descripcion','costo','fechaSolicitud','tipoSolicitud', 'directorVicerrector','rector','statusDTI', 'statusCompras',  'ver']
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
