import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';

import { ServicioBase } from './servicio-base.service';
//import { TipoAyuda } from '../shared/models/tipo-ayuda.model';
//import { QuejaSugerencia } from '../shared/models/queja-sujerencia.model';
//import { CatalogoAnioSolicitudes } from '../shared/models/catalogo-anio.model';
//import { CorreoNuevoSeguimiento } from '../shared/models/correo-nuevo-seguimiento.model';
//import { Carrera } from '../shared/models/carrera.model';

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
  public guardarFormulario(_Nombre: string, _Apellido: string, _CorreoElectronico: string,
    _IdIEST: number, _Licenciatura: number, _TipoAyuda: number, _Comentarios: string ): Observable<any>{
    const parametros = {
      servicio: 'catalogo',
      accion: 'DEF_Defensoria_Registrar',
      acciones: 1,
      nombre: _Nombre.trim(),
      apellidos: _Apellido.trim(),
      correo: _CorreoElectronico.trim(),
      idIEST: _IdIEST,
      idTronco: _Licenciatura,
      idTipoAyuda: _TipoAyuda,
      comentarios: _Comentarios.trim(),

      tipoRespuesta: 'json'

    };
    return this.consulta(parametros);
  }
  //--------

  public recuperarQuejasSugerencias(_idTipoAyuda: number, _anio: number, _idEstatus:number): Observable<any[]>{
    const parametros = {
      accion: 'DEF_Defensoria_ListadoAyuda',
      servicio: 'catalogo',
      acciones: 1,
      idTipoAyuda: _idTipoAyuda,
      anio: _anio,
      idestatus: _idEstatus,
      tipoRespuesta: 'json'
    };
    return this.consulta(parametros);
  }

}
