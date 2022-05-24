import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-solicitud',
  templateUrl: './eliminar-solicitud.component.html',
  styleUrls: ['./eliminar-solicitud.component.scss']
})
export class EliminarSolicitudComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EliminarSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  public activo = false;

  onClick(): void {
    //this.data.motivo = 'noElimnar';
    this.dialogRef.close();
  }
}
