import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { resultadosValidaDirectorVicerrector } from 'src/shared/models/tabla.model';
import { AprobarRechazarComponent } from '../aprobar-rechazar/aprobar-rechazar.component';
import { Router } from '@angular/router';
import { CatalogosService } from '../services/catalogo.service';
import { EliminarSolicitudComponent } from '../eliminar-solicitud/eliminar-solicitud.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss']
})
export class TablaDinamicaComponent implements OnInit {

  private suscripciones: Subscription[];

  @Input() tipoTabla:number=0;
  @Input() resultadosPartidasExtraordinarias:any [] =[];
  @Input() tamanoTabla: string = '';
  @Input() pageSizeOptions= [];
  @Input() public displayedColumns;

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
    console.log('editar');
    console.log(valor['idRegistro']);
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
        console.log('Se canceló la eliminación');
      }
      else
      {
        motivo = result;

        console.log('Se va a eliminar el id: ' + valor['idRegistro']);

        const eliminarSolicitud$ = this._catalogosService.eliminarPartidaExtraOrdinaria(valor['idRegistro']).subscribe(
          {
            next: () => {
              //Entra al servicio de catalogos y en recargarTabla le envía un 1
              //con este le estamos diciendo que recargue la tabla.
              this._catalogosService.recargarTabla.next(1);
            },
            error: (errores) => {
              console.error(errores);
            },
            complete: ()  => {
              //No hago nada aún aquí
            }

          }
        );
        this.suscripciones.push(eliminarSolicitud$);
      }
    });
  }

  ver(valor){
    console.log('Ver listo');
  }

  desplegarDialogo(valor: resultadosValidaDirectorVicerrector[]){
    let dialogRef = this.dialog.open(AprobarRechazarComponent, {
      width: '50%',
      height: '95%',
      disableClose: true,
      autoFocus: true,

      data: {valor}
    });

    //para saber que el botón fue seleccionado
    dialogRef.afterClosed().subscribe(result =>{
      console.log(`Resultado: ${result}`);

    })
  }

  aplicarFiltro(filterValue){
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

  addData() {
    this.cdRef.detectChanges();
    //seteo los datos de la tabla despues de cargarse la vista y detecto los cambios
    this.dataSource = new MatTableDataSource<any[]>(this.resultadosPartidasExtraordinarias);
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

}
