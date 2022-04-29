import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Periodo } from 'src/shared/models/periodo.model';
import { CatalogosService } from '../services/catalogo.service';

@Component({
  selector: 'app-valida-director-vicerrector',
  templateUrl: './valida-director-vicerrector.component.html',
  styleUrls: ['./valida-director-vicerrector.component.scss']
})
export class ValidaDirectorVicerrectorComponent implements OnInit {

    private finalizaSubscripcionrecargarTabla: Subscription = null;

    private suscripciones: Subscription[];

    public formularioValidaciones: FormGroup;

    showSpinner = false;
    clickBusqueda = false;
    sinResultados = false;
    //Tabla---------------
    resultadosPartidasExtraordinarias:any[] = [];
    pageSizeOptions = [5, 10, 20, 30, 40];
    tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";
    //-------------------

    //catalogos
    public catalogoPeriodo: Periodo[];

  constructor(private _fb: FormBuilder,
    private _catalogosService: CatalogosService,
    public _dialog: MatDialog) {

      this.suscripciones = [];
      this.formularioValidaciones = this._fb.group({
        Descripcion: [
          null,
          [
            Validators.required
          ]
        ]
      });

      const observadorValidadorFormulario$ =
      this.formularioValidaciones.valueChanges.subscribe(
        (datos) =>{
          this.dcfValidarDirectorVicerrector(datos);
        }
      );

      this.suscripciones.push(observadorValidadorFormulario$);
      this.dcfValidarDirectorVicerrector();

      //Catálogos
      this.catalogoPeriodo = [];

     }

     disteClick(){
       this.clickBusqueda = true;
     }

    //TABLA-------------------------------
    //Estos nombres cambian respecto a como lo mandan de la consulta
    public displayedColumnsGrupo = {
      valoresQuejaSugerencia: {
        descripcion: ['DESCRIPCION'],
        fechaSolicitud: ['FECHA SOLICITUD'],
        tipoSolicitud: ['TIPO SOLICITUD'],
        status: ['STATUS'],
        fechaAutorizacion: ['FECHA AUTORIZACIÓN'],
        recDirAdmin: ['RECTOR / DIRECTOR ADMINISTRATIVO'],
        statusDTI: ['STATUS DTI'],
        ver: ['Ver'],
        paraMostrar: ['descripcion','fechaSolicitud','tipoSolicitud', 'status','fechaAutorizacion','recDirAdmin', 'statusDTI',  'ver']
      }

    };
  //------------------------------------

  ngOnInit(): void {
    //Recarga la tabla siempre y cuando la respuesta en el servicio this._catalogoSevice
    //sea igual a 1, que se envía desde el detalle de la solicitud.
    this.finalizaSubscripcionrecargarTabla = this._catalogosService.recargarTabla$.subscribe((resp)=>{
      if(resp == 1){this.onSubmit();} });

    //Para el catalogo de Periodos
    const recuperarPeriodos$ = this._catalogosService.recuperaPeriodos().subscribe(
      {
        next: (result) =>{
          this.catalogoPeriodo = result;
        },
        error: (errores) =>{
          console.error(errores);
        },
        complete: () =>{
          //No hay código
        }
      }
    );

    //Se agrega aquí para después matar estas suscripciones
    this.suscripciones.push(this.finalizaSubscripcionrecargarTabla);
    this.suscripciones.push(recuperarPeriodos$);
  }

  onSubmit(){
    this.showSpinner = true;

    this.resultadosPartidasExtraordinarias = []; //Limpio el resultado

    const buscaForm$ = this._catalogosService.guardarValidacion(
      //this.formularioValidaciones.value['Descripcion']
    ).subscribe(
      {
        next: (data) =>{
          this.catalogoPeriodo = data;

          let i_posicion: number = 1;
          for(let item of this.catalogoPeriodo)
          {
            if(item.descripcion == '' || item.descripcion == null)
            {item.descripcion = 'Abierto'}
       //>>>Me hace falta conocer los tipos de estatus<<<<
            this.resultadosPartidasExtraordinarias.push({
              //posicion: i_posicion,
                /*id:item.id,
                nombre: item.nombre,
                apellidos: item.apellidos,
                correo: item.correo,
                idIEST: item.idIEST,
                relacion: item.relacion,
                ayuda: item.ayuda,
                comentarios: item.comentarios,
                estatus: item.estatus*/
            })
            i_posicion++;
          }
          if(this.resultadosPartidasExtraordinarias.length<=0)
          {this.sinResultados = true;}
          else
          {this.sinResultados=false;}

        },
        error: (errores) => {
          console.error(errores);
          this.showSpinner = false;
        },
        complete:() =>{
          this.showSpinner = false;
        }
      }
    )
  }

  ngOnDestroy() {
    console.info(this.suscripciones.length + 'suscripciones serán destruidas');
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    })
  }

  //ef = errores - formulario
  public efValidarDirectorVicerrector: any = {
    Descripcion: ''
   };

   //mvf - mensajes de validación del formulario
   public mvfValidarDirectorVicerrector: any = {
     Descripcion: {
       required: 'Rellena este campo obligatorio'
     }
   };

  //dcf = detecta - cambios - formulario
  private dcfValidarDirectorVicerrector(datos?: any): void{
    if(!this.formularioValidaciones)
    {return;}
    const formulario = this.formularioValidaciones;

    for(const campo in this.efValidarDirectorVicerrector){

      if(this.efValidarDirectorVicerrector.hasOwnProperty(campo)){
        //Limpia mensajes de error previos de existir.
        this.efValidarDirectorVicerrector[campo] = '';
        const control = formulario.get(campo);

        if(control && control.dirty && control.valid){
          const mensajes = this.mvfValidarDirectorVicerrector[campo];

          for(const clave in control.errors){
            if(control.errors.hasOwnProperty(clave)){
              this.efValidarDirectorVicerrector[campo] += mensajes[clave] + ' ';
            }
          }

        }

      }

    }
  }

  public esRequerido(campo:string): boolean{
    const campoFormulario = this.formularioValidaciones.get(campo);
    let validator: any;
    if(campoFormulario){
      validator = (campoFormulario.validator ? campoFormulario.validator({} as AbstractControl) : false);
      if(validator && validator.required){
        return true;
      }
    }
    return false;
  }


}
