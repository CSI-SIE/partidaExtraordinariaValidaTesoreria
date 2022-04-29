import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CatalogosService } from '../services/catalogo.service';

@Component({
  selector: 'app-aprobar-rechazar',
  templateUrl: './aprobar-rechazar.component.html',
  styleUrls: ['./aprobar-rechazar.component.scss']
})
export class AprobarRechazarComponent implements OnInit {

  estatusSeleccionado: string;
  private suscripciones: Subscription[];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _catalogosService: CatalogosService,
    public dialog: MatDialog
    ) {
      this.suscripciones = [];

    }


  ngOnInit(): void {
  }

  guardar(id:number){
    let validadoRechazado: string;
    const guardarSolicitud$ = this._catalogosService.guardarValidacionRechazo(id, validadoRechazado).subscribe(
      {
        next: ()=>{
          this._catalogosService.recargarTabla.next(1);
        },
        error:(errores) => {
          console.error(errores);
        },
        complete: () => {
          //No hago  nada aquí
        }
      }
    );
    this.suscripciones.push(guardarSolicitud$);
  }

  ngOnDestroy() {
    console.info(this.suscripciones.length + 'suscripciones serán destruidas');
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    })
  }

}
