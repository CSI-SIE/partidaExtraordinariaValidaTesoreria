import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AprobarRechazarComponent } from '../aprobar-rechazar/aprobar-rechazar.component';
import { Router } from '@angular/router';
import { CatalogosService } from '../services/catalogo.service';
import { EliminarSolicitudComponent } from '../eliminar-solicitud/eliminar-solicitud.component';
import { Subscription } from 'rxjs';
import { DetallePartidaComponent } from '../detalle-partida/detalle-partida.component';
import { Solicitud } from 'src/shared/models/solicitud.model';

@Component({
  selector: 'tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss']
})
export class TablaDinamicaComponent implements OnInit {

  private suscripciones: Subscription[];

  @Input() tipoTabla:number=0;
  @Input() resultadosPartidasExtraordinarias:any;
  @Input() tamanoTabla: string = '';
  @Input() pageSizeOptions= [];
  @Input() public displayedColumns;
  @Input() filtro:string;
  @Input() idPerson:number;

  //tabla variables
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('paginador', {static: false}) paginator: MatPaginator ;
  dataSource = new MatTableDataSource<any[]>();
  mostrarPaginador:boolean = false;

  constructor(public cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public router: Router,
    private _catalogosService: CatalogosService
    ) {
      this.suscripciones = [];
    }

  ngOnInit(): void {

  }

  reiniciar(){
    this.resultadosPartidasExtraordinarias = [];
  }

  editar(valor){
    this.router.navigateByUrl('/editar/' + valor['idRegistro']);
    //console.log('editar');
    //console.log(valor['idRegistro']);
  }

  eliminar(valor){
    let motivo: string = '';

    const dialogRef$ = this.dialog.open(EliminarSolicitudComponent, {
      width: '30%',
      disableClose: true,
      autoFocus: true,
      data: {motivo: ''},
    });

    dialogRef$.afterClosed().subscribe(result => {

      if(result == undefined)
      {
        //console.log('Se canceló la eliminación');
      }
      else
      {
        motivo = result;

        //console.log('Se va a eliminar el id: ' + valor['idRegistro']);

        const eliminarSolicitud$ = this._catalogosService.eliminarPartidaExtraOrdinaria(valor['idRegistro'], this.idPerson).subscribe(
          {
            next: () => {
              //Entra al servicio de catalogos y en recargarTabla le envía un 1
              //con este le estamos diciendo que recargue la tabla.
              this._catalogosService.recargarTabla.next(1);

              //this.addData();
            },
            error: (errores) => {
              console.error(errores);
            },
            complete: ()  => {

            }

          }
        );
        this.suscripciones.push(eliminarSolicitud$);
      }
    });
  }

  verDetalle(valor){
    let dialogRef = this.dialog.open(DetallePartidaComponent,{
      width: '80%',
      height: '70%',
      disableClose: true,
      autoFocus: true,

      data: {valor}
    });

  }

  desplegarDialogo(valor){
    let dialogRef = this.dialog.open(AprobarRechazarComponent, {
      width: '50%',
      height: '95%',
      disableClose: true,
      autoFocus: true,

      data: {valor, modulo:'vicerrector'}
    });

    //para saber que el botón fue seleccionado
    dialogRef.afterClosed().subscribe(result =>{
      //console.log(`Resultado: ${result}`);
    })
  }

  desplegarDialogoDTI(valor){
    let dialogRef = this.dialog.open(AprobarRechazarComponent, {
      width: '50%',
      height: '95%',
      disableClose: true,
      autoFocus: true,

      data: {valor, modulo:'DTI'}
    });

    //para saber que el botón fue seleccionado
    dialogRef.afterClosed().subscribe(result =>{
      //console.log(`Resultado: ${result}`);
    })
  }

  desplegarDialogRector(valor){
    let dialogRef = this.dialog.open(AprobarRechazarComponent, {
      width: '50%',
      height: '95%',
      disableClose: true,
      autoFocus: true,

      data: {valor, modulo:'rector'}
    });
    //para saber que el botón fue seleccionado
    dialogRef.afterClosed().subscribe(result =>{
      //console.log(`Resultado: ${result}`);
    })
  }

  desplegarDialogCompras(valor){
    let dialogRef = this.dialog.open(AprobarRechazarComponent, {
      width: '50%',
      height: '95%',
      disableClose: true,
      autoFocus: true,

      data: {valor, modulo:'compras'}
    });
    //para saber que el botón fue seleccionado
    dialogRef.afterClosed().subscribe(result =>{
      //console.log(`Resultado: ${result}`);
    })
  }


  aplicarFiltro(filterValue){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

  addData() {
    this.cdRef.detectChanges();
    //seteo los datos de la tabla despues de cargarse la vista y detecto los cambios
    ////console.log(this.resultadosPartidasExtraordinarias);
    //this.dataSource.data = this.resultadosPartidasExtraordinarias;
    this.dataSource = new MatTableDataSource<Solicitud[]>(this.resultadosPartidasExtraordinarias);
    this.cdRef.detectChanges();

    //luego renderiso la tabla para motrar el valor nuevo
    this.table.renderRows();
    //Despues de eso actualiza el paginador
    this.dataSource.paginator = this.paginator;
    this.cdRef.detectChanges();
  }

ngAfterViewInit(): void {
  this.addData();
}

ngOnChanges(changes: SimpleChanges) {
  //2022-05-20 para ver que al cargar por primera vez la tabla se recargue para mostrar los resultados.
  try {
    let change = changes['resultadosPartidasExtraordinarias'];
    if(!change.firstChange){
    this.addData();
  }
  } catch (error) {

  }


  for(let propName in changes){
    let change = changes[propName];
    if(changes['filtro'])
    {
      this.dataSource.filter = change.currentValue;
    }
    //let curVal  = JSON.stringify(change.currentValue);
    //let prevVal = JSON.stringify(change.previousValue);

          /*//console.log(curVal);
          //console.log('-------------------------------------');
          //console.log(prevVal);*/
  }



/*
  let fil = changes['filtro'];
  //console.log(fil);
  if(!fil.firstChange){
    this.aplicarFiltro(fil);
  }*/


  /*for (let propName in changes) {
    let change = changes[propName];
    let curVal  = JSON.stringify(change.currentValue);
    let prevVal = JSON.stringify(change.previousValue);

          //console.log(curVal);
          //console.log(prevVal);
       }*/

  ////console.log(changes);
}

}
