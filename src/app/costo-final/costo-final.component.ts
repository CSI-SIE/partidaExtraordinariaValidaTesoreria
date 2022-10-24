import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ValidaRechazaService } from '../services/validaRechaza.service';

@Component({
  selector: 'costo-final',
  templateUrl: './costo-final.component.html',
  styleUrls: ['./costo-final.component.scss']
})
export class CostoFinalComponent implements OnInit {

  private suscripciones: Subscription[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  public formCostoFinal: UntypedFormGroup;

  idPerson = 0;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _validaRechazaService: ValidaRechazaService,
    private _snackBar: MatSnackBar,
    private _router:Router
    ) {

      this.suscripciones = [];

      this.formCostoFinal = this._fb.group({
        CostoReal: [
          '',
          [
            Validators.required
          ]
        ]
      });


    }

  ngOnInit(): void {


    /*//console.log(this.data.monto);
    //console.log("Entró a Costo final");*/

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
  }

  onSubmit(){
    //this.data.costoReal = this.formCostoFinal.value['CostoReal'];
    const terminarSolicitud$ = this._validaRechazaService.ValidaTesoreriaCerrarProceso(
      this.formCostoFinal.value['CostoReal'],
      this.data.idReg,
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
          this.openSnackBar('Partida extraordinaria concluida.');
          this.dialogRef.close();
        }
      }
    );
    this.suscripciones.push(terminarSolicitud$);
  }

  openSnackBar(mensjae:string) {
    this._snackBar.open(mensjae, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }



}
