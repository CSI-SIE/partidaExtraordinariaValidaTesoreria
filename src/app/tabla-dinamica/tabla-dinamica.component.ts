import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { resultadosValidaDirectorVicerrector } from 'src/shared/models/tabla.model';
import { AprobarRechazarComponent } from '../aprobar-rechazar/aprobar-rechazar.component';

@Component({
  selector: 'tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss']
})
export class TablaDinamicaComponent implements OnInit {

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

  constructor(public cdRef: ChangeDetectorRef, public dialog: MatDialog) { }

  ngOnInit(): void {

  }

  reiniciar(){
    this.resultadosPartidasExtraordinarias = [];
  }

  editar(valor: resultadosValidaDirectorVicerrector[]){
    console.log('Editar listo');
  }

  ver(valor: resultadosValidaDirectorVicerrector[]){
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
