import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

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
  constructor(public cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
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
