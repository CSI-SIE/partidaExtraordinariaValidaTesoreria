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

  public obtieneSesion(): Observable<any>{
    const parametros = {
      servicio: 'administrativo',
      accion: 'Obtiene_IdIEST',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public recuperaPeriodos(): Observable<any>{
    const parametros = {
      servicio: 'administrativo',
      accion: 'obtenerPeriodos',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public recargarTabla = new BehaviorSubject<number>(0);
  public recargarTabla$ = this.recargarTabla.asObservable();
  //----DirectorVicerrector------------------------------------------------------
  public guardarValidacionVicerrector(_id: number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDepartamento',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 1,
      periodo: 0,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public recuperarValidaDirectorVicerrector(_Periodo:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDepartamento',
      servicio: 'administrativo',
      idAccion: 1,
      idPartida: '',
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: '',
      periodo: _Periodo,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public motivoRechazoVicerrector(_id: number, _motivo:string, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDepartamento',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 2,
      periodo: 0,//96 idPeriodo
      comentario: _motivo,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  //----DTI-----------------------------------------------------------------------
  public recuperaValidaDTI(_Periodo:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDTI',
      servicio: 'administrativo',
      idAccion: 1,
      idPartida: '',
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: '',
      periodo: _Periodo,//96 idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public guardarValidacionDTI(_id: number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDTI',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 1,
      periodo: 0,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public motivoRechazoDTI(_id: number, _motivo:string, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoSolicitudesDTI',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 2,
      periodo: 0,//idPeriodo
      comentario: _motivo,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  //-----Rector / Administrativo-----------------------------------------------------
  public recuperaValidaRectorAdmin(_Periodo:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoPartidasFaltantesRectorAdmin',
      servicio: 'administrativo',
      idAccion: 1,
      idPartida: '',
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: '',
      periodo: _Periodo,//96 idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  //pestaña Partidas Pendientes por Jefe
  public recuperaValidaRectorAdmin2(_Periodo:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoPartidasFaltantesRectorAdmin',
      servicio: 'administrativo',
      idAccion: 3,
      idPartida: '',
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: '',
      periodo: _Periodo,//96 idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public guardarValidacionRectorAdmin(_id: number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoPartidasFaltantesRectorAdmin',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 1,
      periodo: 0,//idPeriodo
      comentario: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public motivoRechazoRectorAdmin(_id: number, _motivo:string, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoPartidasFaltantesRectorAdmin',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 2,
      periodo: 0,//idPeriodo
      comentario: _motivo,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  //-----Tesorería------------------------------------------------------------------
  public recuperaValidaTesoreria(_Periodo:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoPartidasTesoreria',
      servicio: 'administrativo',
      idAccion: 1,
      idPartida: '',
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: '',
      periodo: _Periodo,//96 idPeriodo
      costo: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public ValidaTesoreriaEnProceso(_id:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoPartidasTesoreria',
      servicio: 'administrativo',
      idAccion: 2,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 2,
      periodo: 0,
      costo: '',
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public ValidaTesoreriaCerrarProceso(_costof:number, _id:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      accion: 'listadoPartidasTesoreria',
      servicio: 'administrativo',
      idAccion: 3,
      idPartida: _id,
      idPersonCaptura: _idPersonCaptura,
      aceptoRehazo: 1,
      periodo: 0,
      costo: _costof,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }


}
