import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModeloArchivo } from 'src/shared/models/archivo.model';
import { CostoFinalComponent } from '../costo-final/costo-final.component';
import { RechazarComponent } from '../rechazar/rechazar.component';
import { ServicioArchivo } from '../services/archivos.service';
import { CatalogosService } from '../services/catalogo.service';
import { ValidaRechazaService } from '../services/validaRechaza.service';

@Component({
  selector: 'app-aprobar-rechazar',
  templateUrl: './aprobar-rechazar.component.html',
  styleUrls: ['./aprobar-rechazar.component.scss']
})
export class AprobarRechazarComponent implements OnInit {

  estatusSeleccionado: string;
  private suscripciones: Subscription[];
  public conceptosDyMontos = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  public modeloArchivo: ModeloArchivo[];

  idPerson=0;

  constructor(
    private _catalogosService: CatalogosService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _validaRechazaService: ValidaRechazaService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _subirArchivosService: ServicioArchivo,
    private _router:Router
    ) {
      this.suscripciones = [];
      this.modeloArchivo=[];
    }


  ngOnInit(): void {

    //Busca una sesión======================
    const sesion$ = this._validaRechazaService.obtieneSesion().subscribe(
      {
        next:(data: any) =>{
          //si no hay sesión dentro de "data" va a traer "success"
          //y redirijo a modulo que que se encarga que inicie sesión en el SIE
          if(data.hasOwnProperty('success')){
            this._router.navigate(['/debe-iniciar-sesion-SIE']);
          }
          else{
            this.idPerson = data.idPerson;
          }
      },
        error: (errores) =>{
          console.error(errores);
        }
      }
    );
    this.suscripciones.push(sesion$);
    //======================================

    const idRegistro = this.data.valor.idRegistro;

    /*const formatterPeso = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
     })
     this.data.valor.costo = formatterPeso.format(this.data.valor.costo);*/
     //------------------------------------------------------------------
     const obtenerConceptosDetalle$  = this._catalogosService.obtenerConceptosById(
      idRegistro).subscribe(
       {
         next: (conceptos)=>{
           /*conceptos.forEach(element => {
             if(element.monto)
             {
              const formatterPeso = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
               })
              element.monto = formatterPeso.format(element.monto);
             }

           });*/
          this.conceptosDyMontos = conceptos;
         },
         error:(errores) =>{
           console.error(errores);
         },
         complete:() =>{

         }
       }
     );
     this.suscripciones.push(obtenerConceptosDetalle$);


     //Listar archivos-----------------
  const obtenerlistardearchivosdelasolicitud$ = this._subirArchivosService.listaArchivosCotizacion(
    idRegistro).subscribe(
    {
      next:(archivos)=>{
        //recorro y agrego la extensión del archivo a el modelo de archivos
        archivos.forEach(element => {
          if(element['nombreArchivo']){
            ////console.log(element['nombreArchivo']);
            ////console.log(element['nombreArchivo'].split(".").pop());
            element['extension'] = element['nombreArchivo'].split(".").pop();
          }
        });
        this.modeloArchivo = archivos;
        //console.log(archivos);
       },
      error: (errores) => {
        console.error(errores);
      },
      complete:() =>{

      }
    }
  );
  this.suscripciones.push(obtenerlistardearchivosdelasolicitud$);

  //--------------------------------

  }

  guardar(id:number){

    if(this.data.modulo == 'vicerrector'){
      const guardarAprobacionVicerrector$ = this._validaRechazaService.guardarValidacionVicerrector(
        id,
        this.idPerson
        ).subscribe(
        {
          next: ()=>{
            this._validaRechazaService.recargarTabla.next(1);
          },
          error:(errores) => {
            console.error(errores);
          },
          complete: () => {
            this.openSnackBar('Partida extraordinaria aprobada.');
          }
        }
      );
      this.suscripciones.push(guardarAprobacionVicerrector$);
    }
    //-----------------------------------------------------------------------------------------
    if(this.data.modulo == 'DTI'){
      const guardarAprobacionDTI$ = this._validaRechazaService.guardarValidacionDTI(
        id,
        this.idPerson
        ).subscribe(
        {
          next: ()=>{
            this._validaRechazaService.recargarTabla.next(1);
          },
          error:(errores) => {
            console.error(errores);
          },
          complete: () => {
            this.openSnackBar('Partida extraordinaria aprobada.');
          }
        }
      );
      this.suscripciones.push(guardarAprobacionDTI$);
    }
    //-----------------------------------------------------------------------------------------
    if(this.data.modulo == 'rector'){

      const guardarAprobacionRectorAdministrativo$ = this._validaRechazaService.guardarValidacionRectorAdmin(
        id,
        this.idPerson
        ).subscribe(
        {
          next: () =>{
            this._validaRechazaService.recargarTabla.next(1);
          },
          error:(errores)=>{
            console.error(errores);
          },
          complete: () =>{
            this.openSnackBar('Partida extraordinaria aprobada.');
          }
        }
      );
      this.suscripciones.push(guardarAprobacionRectorAdministrativo$);
      //Cuando no ha Validado el Vicerrector automaticamente lo Validamos aquí. ||||||||||||||||||
        if(this.data.valor.validaDirectorVicerrector==0){
          const aprobarVicerrectorAutomaticamente$ = this._validaRechazaService.guardarValidacionVicerrector(
            id,
            this.idPerson
            ).subscribe(
            {
              next: ()=>{
                this._validaRechazaService.recargarTabla.next(1);
              },
              error:(errores) => {
                console.error(errores);
              },
              complete: () => {
              }
            }
          );
          this.suscripciones.push(aprobarVicerrectorAutomaticamente$);
        }
      //|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    }
    //-----------------------------------------------------------------------------------------



  }

  validarCompras(id:number){
    if(this.data.modulo == 'compras'){
      const guardarValidacionEnProceso$ = this._validaRechazaService.ValidaTesoreriaEnProceso(
        id,
        this.idPerson
        ).subscribe(
        {
          next: ()=>{
            this._validaRechazaService.recargarTabla.next(1);
          },
          error:(errores) => {
            console.error(errores);
          },
          complete: () => {
            this.openSnackBar('Partida extraordinaria atendida y en proceso.');
          }
        }
      );
      this.suscripciones.push(guardarValidacionEnProceso$);
    }
  }



  rechazar(id:number){
    let motivo:string = '';

    const dialogRef$ = this.dialog.open(RechazarComponent,{
      width: '50%',
      disableClose: true,
      autoFocus: true,
      data: {motivo: ''},
    });

    dialogRef$.afterClosed().subscribe(result =>{
      if(result == undefined)
      {
        //console.log('Se canceló el Rechazo');
      }
      else
      {
        motivo = result;

        //console.log('Se va a rechazar la partida con el id: ' + id);


        //-----------------------------------------------------------------------------------------
        if(this.data.modulo == 'vicerrector'){
          const motivoRechazoVicerrector$ = this._validaRechazaService.motivoRechazoVicerrector(
            id,
            motivo,
            this.idPerson).subscribe(
            {
              next: () =>{
                //Entra al servicio de catalogos y en recargarTabla le envía un 1
                //con este le estamos diciendo qie recargue la tabla.
                this._validaRechazaService.recargarTabla.next(1);
              },
              error: (errores) =>{
                console.error(errores);
              },
              complete: () =>{
                this.openSnackBar('Partida extraordinaria rechazada.');
              }
            }
          );
            this.suscripciones.push(motivoRechazoVicerrector$);

        }
        //-----------------------------------------------------------------------------------------
        if(this.data.modulo == 'DTI'){
          const motivoRechazoDTI$ = this._validaRechazaService.motivoRechazoDTI(
            id,
            motivo,
            this.idPerson
            ).subscribe(
            {
              next: () =>{
                //Entra al servicio de catalogos y en recargarTabla le envía un 1
                //con este le estamos diciendo qie recargue la tabla.
                this._validaRechazaService.recargarTabla.next(1);
              },
              error: (errores) =>{
                console.error(errores);
              },
              complete: () =>{
                this.openSnackBar('Partida extraordinaria rechazada.');
              }
            }
          );
            this.suscripciones.push(motivoRechazoDTI$);
        }
        //-----------------------------------------------------------------------------------------
        if(this.data.modulo == 'rector'){
          const motivoRechazoRector$ = this._validaRechazaService.motivoRechazoRectorAdmin(
            id,
            motivo,
            this.idPerson
            ).subscribe(
            {
              next: () => {
                this._validaRechazaService.recargarTabla.next(1);
              },
              error: (errores) =>{
                console.error(errores);
              },
              complete: () =>{
                this.openSnackBar('Partida extraordinaria rechazada.');
              }
            }
          );
          this.suscripciones.push(motivoRechazoRector$);
          //Cuando no ha Validado el Vicerrector automaticamente lo Validamos aquí. ||||||||||||||||||
          if(this.data.valor.validaDirectorVicerrector==0){
            const motivoRechazoVicerrector$ = this._validaRechazaService.motivoRechazoVicerrector(
              id,
              motivo,
              this.idPerson).subscribe(
              {
                next: () =>{
                  this._validaRechazaService.recargarTabla.next(1);
                },
                error: (errores) =>{
                  console.error(errores);
                },
                complete: () =>{
                  this.openSnackBar('Partida extraordinaria rechazada.');
                }
              }
            );
            this.suscripciones.push(motivoRechazoVicerrector$);
          }
          //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

        }
        //-----------------------------------------------------------------------------------------
        if(this.data.modulo == 'compras'){

        }


      }
    });
  }

  montoFinal(){
    const monto = this.data.valor.costo;
    const idReg = this.data.valor.idRegistro;
    const dialogRef$ = this.dialog.open(CostoFinalComponent,{
      width: '30%',
      disableClose: true,
      autoFocus: true,
      data: {monto,idReg},
    });

    /*dialogRef$.afterClosed().subscribe(result =>{
      if(result == undefined)
      {
        //console.log('Se cerró la ventana sin guardar nada.');
      }
      else
      {
        //console.log("Aquí se va a ejecutar el Guardar con monto final.");
      }
    });*/
  }

  imprimirReporte(id:number){
    //Para abrir en una nueva pestaña
    window.open("http://reportes2016.iest.edu.mx/app/reportes/Convert/Default.aspx?prompt0="+ id + "&reporte=REP_PartidasExtraordinarias.rpt");

    //Para abrir en la misma página
    //document.location.href = "http://reportes2016.iest.edu.mx/app/reportes/Convert/Default.aspx?prompt0="+ id + "&reporte=REP_PartidasExtraordinarias.rpt";
  }


  ngOnDestroy() {
    console.info(this.suscripciones.length + 'suscripciones serán destruidas');
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    })
  }

  openSnackBar(mensjae:string) {
    this._snackBar.open(mensjae, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }

}
