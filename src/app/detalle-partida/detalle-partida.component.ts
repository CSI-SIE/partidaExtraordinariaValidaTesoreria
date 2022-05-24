import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-partida',
  templateUrl: './detalle-partida.component.html',
  styleUrls: ['./detalle-partida.component.scss']
})
export class DetallePartidaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetallePartidaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

   // console.log(this.data.valor.idRegistro);


  }

  onClick(): void {
    //this.data.motivo = 'noElimnar';
    this.dialogRef.close();
  }

}
