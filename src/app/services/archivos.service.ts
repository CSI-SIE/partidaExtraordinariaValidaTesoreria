import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicioBase } from './servicio-base.service';


@Injectable({providedIn: 'root'})

export class ServicioArchivo extends ServicioBase {
  constructor(
    private _sb:HttpClient
  ) {
    super(_sb);
  }

  /*public subirArchivo(_idRegistro: number, _fileDialog:File){
    const parametros = {
      servicio: 'administrativo',
      secureuri: false,
      accion: 'subirArchivoV2',
      data: _idRegistro,
      fileElementId: _fileDialog,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }*/

  public listaArchivosCotizacion(_id: number){
    const parametros = {
      servicio: 'administrativo',
      accion: 'PRE_Partidas_Registra_Documento_Listar',
      idPartida: _id,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public eliminarArchivo(_idArchivo:number){
    const parametros = {
      servicio: 'administrativo',
      accion: 'PRE_Partidas_Registra_Documento_Eliminar',
      idArchivo: _idArchivo,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

}
