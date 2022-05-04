import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CatalogosService } from '../services/catalogo.service';

@Component({
  selector: 'app-rechazar',
  templateUrl: './rechazar.component.html',
  styleUrls: ['./rechazar.component.scss']
})
export class RechazarComponent implements OnInit {

  private suscripciones: Subscription[];

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _catalogosService: CatalogosService,
    public dialog: MatDialog) {
      this.suscripciones = [];
    }

  ngOnInit(): void {
  }

  public activo = false;

  validacionTextArea(){
    console.log(this.data.motivo);
    if(this.data.motivo.length <=0)
    {
      this.activo = false;
    }
    else
    {
      this.activo = true;
    }
  }

  onClick(): void {
    this.dialogRef.close();
  }

}
