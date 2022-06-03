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

  public subirArchivo(){
    const parametros = {
      servicio: 'administrativo',
      accion: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public listaArchivosCotizacion(_id: number){
    const parametros = {
      servicio: 'administrativo',
      accion: 'listaArchivosCotizacion',
      idPartida: _id,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public eliminaAdjuntoCotizacion(_id: number){
    const parametros = {
      servicio: 'administrativo',
      accion: 'eliminaAdjuntoCotizacion',
      idMaterial: _id,
      tipoRespuesta: 'json'
    };
  }

}
