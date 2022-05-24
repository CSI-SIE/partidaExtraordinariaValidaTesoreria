import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/shared/models/solicitud.model';
import { CatalogosService } from '../services/catalogo.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  private suscripciones: Subscription[];
  private finalizaSubscripcionrecargarTabla: Subscription = null;

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
  resultadosPartidasExtraordinarias:Solicitud[] = [];
  //-------------------

  constructor(private router: Router,private _catalogosService: CatalogosService,
    public dialog: MatDialog) {
    this.resultadosPartidasExtraordinarias = [];
    this.suscripciones = [];
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
      aplicada: ['STATUS COMPRAS'],//<<<<<<<<
      editar: [''],
      paraMostrar: ['idRegistro','descripcion','costo','fechaSolicitud','tipoPartida', 'validaDirectorVicerrector','validaRectorDirAdmin','validaDTI', 'aplicada',  'editar']
    }
  };
//------------------------------------

  ngOnInit(): void {
  this.recargarTabla();

  this.onSubmit();

  }

  operacionOnSub(): void{}

  onSubmit(){
    this.resultadosPartidasExtraordinarias = [];

    const obtenerResultados$ = this._catalogosService.obtenerListadoSolicitudesPorPersona().subscribe(
      {
        next:(data) => {

          data.forEach(element => {
            //------------------------------------------------
            switch(element['tipoPartida']){
              case 1:
              element['tipoPartida'] = 'Compra general';
              break;
              case 2:
                element['tipoPartida'] = 'Gastos a comprobar';
                break;
              case 3:
                element['tipoPartida'] = 'Reembolso';
                break;
              case 4:
                element['tipoPartida'] = 'Gastos de viajes';
                break;
              default:
                element['tipoPartida'] = 'Sin tipo solicitud'
                break;
            }
            //------------------------------------------------
            if(element['costo']){

              const formatterPeso = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              })
              element['costo'] = formatterPeso.format(element['costo']);
            }

            //console.log(element['idRegistro']);
          });

          this.resultadosPartidasExtraordinarias = data;


        },
        error: (errores) => {
          console.error(errores);
        },
        complete:() => { }
      }
    );
    this.suscripciones.push(obtenerResultados$);
  }

  recargarTabla(){
    //Recarga la tabla siempre y cuando la respuesta en el servicio this._catalogosService
    //sea igual a 1, que se envía desde el detalle de la solicitud.

    this.finalizaSubscripcionrecargarTabla = this._catalogosService.recargarTabla$.subscribe((resp)=>{
    if(resp == 1){ this.onSubmit(); } });

    this.suscripciones.push(this.finalizaSubscripcionrecargarTabla);
  }

  btnClick() {
    this.router.navigateByUrl('/nuevo');
    console.log("di click");
  }

  ngOnDestroy() {
    console.info(this.suscripciones.length + 'suscripciones serán destruidas');
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    })
  }




}
