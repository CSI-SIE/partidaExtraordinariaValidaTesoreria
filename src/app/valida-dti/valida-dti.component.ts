import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Periodo } from 'src/shared/models/periodo.model';
import { ValidaRechazaService } from '../services/validaRechaza.service';

@Component({
  selector: 'valida-dti',
  templateUrl: './valida-dti.component.html',
  styleUrls: ['./valida-dti.component.scss']
})
export class ValidaDTIComponent implements OnInit {

  public filtro: string = '';
  public tipoPartidaExtraordinaria:any[]=[
    {titulo: 'Todas', valor: ''},
    {titulo: 'Pendientes', valor: 'SIN VALIDAR'},
    {titulo: 'Aprobadas', valor: 'VALIDADA'},
    {titulo: 'Rechazadas', valor: 'RECHAZADA'}
  ];

  private finalizaSubscripcionrecargarTabla: Subscription = null;
  private suscripciones: Subscription[];
  public formularioValidaciones: UntypedFormGroup;
  showSpinner = false;
  clickBusqueda = false;
  sinResultados = false;
  //Tabla---------------
  resultadosPartidasExtraordinarias:any[] = [];

  pageSizeOptions = [10, 20, 30, 40];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";
  //-------------------
  //
  //catalogos
  public catalogoPeriodo: Periodo[];
  public resultadosValidaDTI:any[];

  //TABLA-------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      descripcion: ['DESCRIPCION'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      tipoPartida: ['TIPO SOLICITUD'],
      validaDTI: ['ESTATUS DTI'],
      fechaAutorizacionDTI: ['FECHA REVISION DTI'],
      validaRectorDirAdmin: ['ESTATUS RECTOR / DIR. ADMINISTRAIVO'],
      verDTI: [''],
      paraMostrar: ['descripcion','fechaSolicitud','tipoPartida', 'validaDTI','fechaAutorizacionDTI', 'validaRectorDirAdmin',  'verDTI']
    }

    };
  //------------------------------------

  constructor(private _fb: UntypedFormBuilder,
    private _validaRechazaService: ValidaRechazaService,
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
          this.dcfValidaDTI(datos);
        }
      );

      this.suscripciones.push(observadorValidadorFormulario$);
      this.dcfValidaDTI();


      //Catálogos
      this.catalogoPeriodo = [];
      this.resultadosValidaDTI = [];

    }

  disteClick(){
    this.clickBusqueda = true;
  }

  ngOnInit(): void {
    //Recarga la tabla siempre y cuando la respuesta en el servicio this._catalogoSevice
    //sea igual a 1, que se envía desde el detalle de la solicitud.
    this.finalizaSubscripcionrecargarTabla = this._validaRechazaService.recargarTabla$.subscribe((resp)=>{
      if(resp == 1){this.onSubmit();} });

      //======================================
      //Aquí va a ir el catálogo de Periodos
      //======================================

      //Se agrega aquí para después matar estas suscripciones
    this.suscripciones.push(this.finalizaSubscripcionrecargarTabla);
  }

  onSubmit(){
    this.showSpinner = true;
    this.resultadosPartidasExtraordinarias = [];
    var nuevoArray = [];
    const buscaForm$ = this._validaRechazaService.recuperaValidaDTI('','').subscribe(
      {
        next: (data) => {

          //Limpio data para que solo aparezcan los que fueron validados por el
          data = data.filter((item)=>item.validaDirectorVicerrector==1)
          //data = data.filter((item)=>item.validaRectorDirAdmin==1);
         data.forEach(element => {

            if(element['validaDirectorVicerrector']== 2 || element['validaRectorDirAdmin'] == 2)
            {
              console.log('Aquí');
            }
            /*switch(element['tipoPartida']){
              case 1:
                element['tipoPartida'] = 'Compra general';
                break;
              case 2:
                element['tipoPartida'] = 'Gastos a comprobar';
                break;
              case 3:
                element['tipoPartida'] = 'Reembolso';
                break;
              case 4:
                element['tipoPartida'] = 'Gastos de viajes';
                break;
              default:
                element['tipoPartida'] = '';
                break;
            }*/

            switch(element['validaDTI2']){
                case 0:
                  element['validaDTI2'] = 'SIN VALIDAR';
                 break;
                case 1:
                  element['validaDTI2'] = 'VALIDADA';
                  break;
                case 2:
                  element['validaDTI2'] = 'RECHAZADA';
                  break;
                default:
                 element['validaDTI2'] = '';
                  break;
            }

          });
          this.resultadosPartidasExtraordinarias = data;
          console.log(this.resultadosPartidasExtraordinarias);
          if(this.resultadosPartidasExtraordinarias.length<=0)
          {this.sinResultados = true;}
          else
          {this.sinResultados = false;}
        },
        error: (errores) =>{
          console.error(errores);
          this.showSpinner = false;
        },
        complete: () =>{
          this.showSpinner = false;
        }

      }
    );
    this.suscripciones.push(buscaForm$);
  }


  ngOnDestroy() {
    console.info(this.suscripciones.length + 'suscripciones serán destruidas');
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    })
  }

  //ef = errores - formulario
  public efValidaDTI: any = {
    Descripcion: ''
   };

   //mvf - mensajes de validación del formulario
   public mvfValidaDTI: any = {
     Descripcion: {
       required: 'Rellena este campo obligatorio'
     }
   };

  //dcf = detecta - cambios - formulario
  private dcfValidaDTI(datos?: any): void{
    if(!this.formularioValidaciones)
    {return;}
    const formulario = this.formularioValidaciones;

    for(const campo in this.efValidaDTI){

      if(this.efValidaDTI.hasOwnProperty(campo)){
        //Limpia mensajes de error previos de existir.
        this.efValidaDTI[campo] = '';
        const control = formulario.get(campo);

        if(control && control.dirty && control.valid){
          const mensajes = this.mvfValidaDTI[campo];

          for(const clave in control.errors){
            if(control.errors.hasOwnProperty(clave)){
              this.efValidaDTI[campo] += mensajes[clave] + ' ';
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
