import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { RechazarComponent } from '../rechazar/rechazar.component';
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

  constructor(
    private _catalogosService: CatalogosService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _validaRechazaService: ValidaRechazaService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    ) {
      this.suscripciones = [];
    }


  ngOnInit(): void {

    const idRegistro = this.data.valor.idRegistro;

    /*const formatterPeso = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
     })
     this.data.valor.costo = formatterPeso.format(this.data.valor.costo);*/
     //------------------------------------------------------------------
     const obtenerConceptosDetalle$  = this._catalogosService.obtenerListadoConceptosById(
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
  }

  guardar(id:number){

    if(this.data.modulo == 'vicerrector'){
      const guardarAprobacionVicerrector$ = this._validaRechazaService.guardarValidacionVicerrector(id).subscribe(
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
      const guardarAprobacionDTI$ = this._validaRechazaService.guardarValidacionDTI (id).subscribe(
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


    }
    //-----------------------------------------------------------------------------------------
    if(this.data.modulo == 'compras'){

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
        console.log('Se canceló el Rechazo');
      }
      else
      {
        motivo = result;

        console.log('Se va a rechazar la partida con el id: ' + id);


        //-----------------------------------------------------------------------------------------
        if(this.data.modulo == 'vicerrector'){
          const motivoRechazoVicerrector$ = this._validaRechazaService.motivoRechazoVicerrector(id, motivo).subscribe(
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
          const motivoRechazoDTI$ = this._validaRechazaService.motivoRechazoDTI(id, motivo).subscribe(
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

        }
        //-----------------------------------------------------------------------------------------
        if(this.data.modulo == 'compras'){

        }


      }
    });
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
