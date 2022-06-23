import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

import { ServicioBase } from './servicio-base.service';

//----------------------------------
@Injectable({
  providedIn: 'root'
})

export class CatalogosService extends ServicioBase {
  constructor(
    private _sb:HttpClient
  ) {
    super(_sb);
  }

  public recargarTabla = new BehaviorSubject<number>(0);
  public recargarTabla$ = this.recargarTabla.asObservable();

  //Agregar nueva solicitud--------
  public guardarNuevaSolicitudPartidaExtraordinaria(_tipo:number, _descripcion:string, _proveedor:string, _justificacion: string, _costo: number,  _equipo: number, _detalle: string, _idPeriodo:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      servicio: 'administrativo',
      accion: 'registroPartidaExtraordinaria',
      idAccion: 1, //1) Guarda Nueva Partida - 2) Listado de solicitudes por persona - 3) Obtiene información de una partida - 4) Obtiene listado de los conceptos - 5) Edita la partida - 6) Elimina Partida
      idPartida: 0,
      idUnidad: 0,
      idUnidadArea: 0,
      idPersonCaptura: _idPersonCaptura,
      tipo: _tipo,
      descripcion: _descripcion,
      proveedor: _proveedor,
      costo: _costo,
      justificacion: _justificacion,
      detalle: _detalle,
      periodo: _idPeriodo,
      equipo: _equipo,

      tipoRespuesta: 'json'

    };
    return this.consulta(parametros);
  }
  //Concepto1|5$Concepto2|6
  //Concepto1|50$Concepto2|100$Concepto3|350
  //exec  Pre_Captura_PartidaExtraordinaria 1, 0, 0, 0, 'descripcion', 'proveedor', 1, 'Justificacion', 1, 23269, '|', 96, 0
  //exec  Pre_Captura_PartidaExtraordinaria 1, 0, 0, 0, 'Descripcion', 'Proveedor', 500, 'Justificacion', 1, 23269, '|', 96, 0

  public obtenerListadoSolicitudesPorPersona(_idPeriodo:number, _idPersonCaptura:number):Observable<any>{
    const parametros = {
      servicio: 'administrativo',
      accion: 'registroPartidaExtraordinaria',
      idAccion: 2, // 2) Listado de solicitudes por persona
      idPartida: 0,
      idUnidad: 0,
      idUnidadArea: 0,
      idPersonCaptura: _idPersonCaptura,
      tipo: 1, //tipoPartida
      descripcion: '',
      proveedor: '',
      costo: 500,
      justificacion: '',
      detalle: '',
      periodo: _idPeriodo,
      equipo: 0,

      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public obtenerSolicitudById(_id:number, _idPersonCaptura:number):Observable<any>{
    const parametros = {
      servicio: 'administrativo',
      accion: 'registroPartidaExtraordinaria',
      idAccion: 3, // 3) Obtiene información de una partida
      idPartida: _id,
      idUnidad: 0,
      idUnidadArea: 0,
      idPersonCaptura: _idPersonCaptura,
      tipo: 1,
      descripcion: '',
      proveedor: '',
      costo: 500,
      justificacion: '',
      detalle: '',
      periodo: 0,
      equipo: 0,

      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public obtenerConceptosById(_id:number):Observable<any>{

    const parametros = {
      servicio: 'administrativo',
      accion: 'registroPartidaExtraordinaria',
      idAccion: 4, //4) Obtiene listado de los conceptos
      idPartida: _id,
      idUnidad: 0,
      idUnidadArea: 0,
      idPersonCaptura:0,
      tipo: 0,
      descripcion: '',
      proveedor: '',
      costo: 0,
      justificacion: '',
      detalle: '',
      periodo: 0,
      equipo: 0,

      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

  public ModificarSolicitudPartidaExtraordinaria(_tipo:number, _descripcion:string, _proveedor:string, _justificacion: string, _costo: number,  _equipo: number, _detalle: string,_idPeriodo:number, _idPartida:number, _idPersonCaptura:number): Observable<any>{
    const parametros = {
      servicio: 'administrativo',
      accion: 'registroPartidaExtraordinaria',
      idAccion: 5, //1) Guarda Nueva Partida - 2) Listado de solicitudes por persona - 3) Obtiene información de una partida - 4) Obtiene listado de los conceptos - 5) Edita la partida - 6) Elimina Partida
      idPartida: _idPartida,
      idUnidad: 0,
      idUnidadArea: 0,
      idPersonCaptura: _idPersonCaptura,
      tipo: _tipo,
      descripcion: _descripcion,
      proveedor: _proveedor,
      costo: _costo,
      justificacion: _justificacion,
      detalle: _detalle,
      periodo: _idPeriodo,
      equipo: _equipo,

      tipoRespuesta: 'json'

    };
    return this.consulta(parametros);
  }

  public eliminarPartidaExtraOrdinaria(_id:number, _idPersonCaptura:number):Observable<any>{
    const parametros = {
      servicio: 'administrativo',
      accion: 'registroPartidaExtraordinaria',
      idAccion: 6, // 6) Eliminar partida
      idPartida: _id,
      idUnidad: 0,
      idUnidadArea: 0,
      idPersonCaptura: _idPersonCaptura,
      tipo: 0, //tipoPartida
      descripcion: '',
      proveedor: '',
      costo: 0,
      justificacion: '',
      detalle: '',
      periodo: 0,
      equipo: 0,

      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }
  //-----------------------------------------------------------------------------------------------------------------------------------------






}
