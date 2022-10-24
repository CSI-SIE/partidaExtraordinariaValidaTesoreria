import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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

  opcionPorDefault = 0;

  idPerson = 0;

  //TABLA-------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      descripcion: ['DESCRIPCION'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      tipoPartida: ['TIPO SOLICITUD'],
      validaDTI: ['ESTATUS DTI'],
      fechaAutorizacion: ['FECHA REVISION DTI'],
      validaRectorDirAdmin: ['ESTATUS RECTOR / DIR. ADMINISTRAIVO'],
      verDTI: [''],
      paraMostrar: ['descripcion','fechaSolicitud','tipoPartida', 'validaDTI','fechaAutorizacion', 'validaRectorDirAdmin',  'verDTI']
    }

    };
  //------------------------------------

  constructor(private _fb: UntypedFormBuilder,
    private _validaRechazaService: ValidaRechazaService,
    public _dialog: MatDialog,
    private _router:Router
    ) {

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

    //Busca una sesión======================
    const sesion$ = this._validaRechazaService.obtieneSesion().subscribe(
      {
        next:(data: any) =>{
          //si no hay sesión dentro de "data" va a traer "success"
          //y redirijo a modulo que que se encarga que inicie sesión en el SIE
          if(data.hasOwnProperty('success')){
            this._router.navigate(['/debe-iniciar-sesion-SIE']);
          }
          else{
            this.idPerson = data.idPerson;
          }
      },
        error: (errores) =>{
          console.error(errores);
        }
      }
    );
    this.suscripciones.push(sesion$);
    //======================================

    //Recarga la tabla siempre y cuando la respuesta en el servicio this._catalogoSevice
    //sea igual a 1, que se envía desde el detalle de la solicitud.
    this.finalizaSubscripcionrecargarTabla = this._validaRechazaService.recargarTabla$.subscribe((resp)=>{
      if(resp == 1){this.onSubmit();} });

      //======================================
      const periodos$ = this._validaRechazaService.recuperaPeriodos().subscribe(
        {
          next:(data) =>{
            this.catalogoPeriodo = data;
            this.catalogoPeriodo.forEach(element => {
              if(element.actual){
                this.opcionPorDefault = element.idPeriodo;
              }
            });
            ////console.log(data);
          },
          error: (errores) =>{
            console.error(errores);
          }
        }
      );
      //======================================

      //Se agrega aquí para después matar estas suscripciones
    this.suscripciones.push(this.finalizaSubscripcionrecargarTabla);
    this.suscripciones.push(periodos$);
  }

  onSubmit(){
    this.filtro = '';
    this.showSpinner = true;
    this.resultadosPartidasExtraordinarias = [];

    const buscaForm$ = this._validaRechazaService.recuperaValidaDTI(
      this.formularioValidaciones.value['Descripcion'],
      this.idPerson).subscribe(
      {
        next: (data) => {

          //Limpio data para que solo aparezcan los que fueron validados por el
          data = data.filter((item)=>item.validaDirectorVicerrector==1)
          //data = data.filter((item)=>item.validaRectorDirAdmin==1);
         data.forEach(element => {

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
          //console.log(this.resultadosPartidasExtraordinarias);
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
    console.info(this.suscripciones.length + ' suscripciones serán destruidas');
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
