import { Component, Inject, Input, OnInit, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CatalogosService } from '../services/catalogo.service';

@Component({
  selector: 'app-detalle-partida',
  templateUrl: './detalle-partida.component.html',
  styleUrls: ['./detalle-partida.component.scss']
})
export class DetallePartidaComponent implements OnInit {

  private suscripciones: Subscription[];
  public conceptosDyMontos = [];
  //@Input() detallePartidaExtraordinaria:any;

  constructor(
    private _catalogosService: CatalogosService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog
    ) {
      this.suscripciones=[];
    }

  ngOnInit(): void {
   const idRegistro = this.data.valor.idRegistro;
   const obtenerConceptosDetalle$  = this._catalogosService.obtenerListadoConceptosById(
    idRegistro).subscribe(
     {
        next: (conceptos)=>{
         conceptos.forEach(element => {
           if(element.monto)
           {
            const formatterPeso = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2
             })
            element.monto = formatterPeso.format(element.monto);
           }

         });
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
   // console.log(this.data.valor.idRegistro);
  }

  onClick(): void {
    //this.data.motivo = 'noElimnar';
    this.dialogRef.close();
  }

  ngOnChanges(changes: SimpleChange){
    console.log(changes);
  }

}
