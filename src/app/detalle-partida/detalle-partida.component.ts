import { Component, Inject, OnInit, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ModeloArchivo } from 'src/shared/models/archivo.model';
import { ServicioArchivo } from '../services/archivos.service';
import { CatalogosService } from '../services/catalogo.service';

@Component({
  selector: 'app-detalle-partida',
  templateUrl: './detalle-partida.component.html',
  styleUrls: ['./detalle-partida.component.scss']
})
export class DetallePartidaComponent implements OnInit {

  private suscripciones: Subscription[];
  public conceptosDyMontos = [];
  public modeloArchivo: ModeloArchivo[];
  //@Input() detallePartidaExtraordinaria:any;

  constructor(
    private _catalogosService: CatalogosService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog,
    private _subirArchivosService: ServicioArchivo,
    ) {
      this.suscripciones=[];
      //Catalogo/Interfaz
      this.modeloArchivo=[];
    }

  ngOnInit(): void {
   const idRegistro = this.data.valor.idRegistro;
   const obtenerConceptosDetalle$  = this._catalogosService.obtenerConceptosById(
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
   // //console.log(this.data.valor.idRegistro);

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

  onClick(): void {
    //this.data.motivo = 'noElimnar';
    this.dialogRef.close();
  }

  ngOnChanges(changes: SimpleChange){
    //console.log(changes);
  }

  descargarArchivo(llave){
    //href="{{'https://sie.iest.edu.mx/descargaExterna/descargaPartidas/?arch='+archivo.llave+'&data=false'}}
    //windows.location.href="";

  }

}
