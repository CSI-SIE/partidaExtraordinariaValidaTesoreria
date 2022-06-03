import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServicioBase } from './servicio-base.service';

@Injectable({
  providedIn: 'root'
})


export class ValidaRechazaService extends ServicioBase {
  constructor(
    private _sb: HttpClient
  ) { super(_sb);
  }

  public recuperaPeriodos(): Observable<any>{
    const parametros = {
      servicio: 'catalogo',
      accion: 'NOMBRE DE LA API',
      acciones: 1,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public recargarTabla = new BehaviorSubject<number>(0);
  public recargarTabla$ = this.recargarTabla.asObservable();
  //----DirectorVicerrector------------------------------------------------------
  public guardarValidacionVicerrector(_id: number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDepartamento',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: 23269,
      aceptoRehazo: 1,
      periodo: 96,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public recuperarValidaDirectorVicerrector(_Periodo:string, _comentario:string): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDepartamento',
      servicio: 'administrativo',
      idAccion: 1,
      idPartida: '',
      idPersonCaptura: 23269,
      aceptoRehazo: '',
      periodo: 96,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public motivoRechazoVicerrector(_id: number, _motivo:string): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDepartamento',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: 23269,
      aceptoRehazo: 2,
      periodo: 96,//idPeriodo
      comentario: _motivo,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  //----DTI-----------------------------------------------------------------------
  public recuperaValidaDTI(_Periodo:string, _comentario:string): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDTI',
      servicio: 'administrativo',
      idAccion: 1,
      idPartida: '',
      idPersonCaptura: 23269,
      aceptoRehazo: '',
      periodo: 96,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public guardarValidacionDTI(_id: number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDTI',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: 23269,
      aceptoRehazo: 1,
      periodo: 96,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public motivoRechazoDTI(_id: number, _motivo:string): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDTI',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: 23269,
      aceptoRehazo: 2,
      periodo: 96,//idPeriodo
      comentario: _motivo,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

}
