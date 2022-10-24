import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ServicioArchivos } from './servicio-archivos.service';

@Injectable({
  providedIn: 'root'
})
export class UploadDownloadService extends ServicioArchivos {

  constructor(
    private _sb:HttpClient
  ) { super(_sb); }

  public subirArchivo(_idRegistro: number, _fileDialog:File){
    ////console.log(_fileDialog);
    const parametros = {
      idPartida: _idRegistro,
      file: _fileDialog,
      documento: 'PartidasExtraordinarias',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }


}
