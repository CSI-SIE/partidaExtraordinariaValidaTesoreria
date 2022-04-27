import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';

import { ServicioBase } from './servicio-base.service';

@Injectable({
  providedIn: 'root'
})
export class UploadDownloadService extends ServicioBase{

  constructor(
    private _sb:HttpClient
  ) {
    super(_sb);
  }

  //


   //Agregar nueva solicitud--------
   public downloadFile(file: string): Observable<any>{
    const parametros = {
      servicio: 'subir',
      accion: 'AD_Descargar_archivo',
      acciones: 1,

      tipoRespuesta: 'json'

    };
    return this.consulta(parametros);
  }
  //--------
}
