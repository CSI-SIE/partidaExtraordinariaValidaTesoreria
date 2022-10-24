import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Periodo } from 'src/shared/models/periodo.model';
import { ValidaRechazaService } from '../services/validaRechaza.service';

@Component({
  selector: 'valida-rector-administrativo',
  templateUrl: './valida-rector-administrativo.component.html',
  styleUrls: ['./valida-rector-administrativo.component.scss']
})
export class ValidaRectorAdministrativoComponent implements OnInit {

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
  sinResultados1 = false;
  sinResultados2 = false;
  sinResultados3 = false;
  //Tabla---------------
  resultadosPartidasExtraordinarias1:any[] = [];
  resultadosPartidasExtraordinarias2:any[] = [];
  resultadosPartidasExtraordinarias3:any[] = [];

  pageSizeOptions = [10, 20, 30, 40];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";
  //-------------------
  //
  //catalogos
  public catalogoPeriodo: Periodo[];
  public resultadosValidaRectorAdmin:any[];

  opcionPorDefault = 0;

  idPerson = 0;

  //TABLA---------------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta

  public displayedColumnsGrupo1 = {
    columnas: {
      descripcion: ['DESCRIPCION'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      nombrePartida: ['TIPO SOLICITUD'],

      validaRectorDirAdmin: ['ESTATUS RECTOR / DIR. ADMINISTRATIVO'],


      verRector: [''],
      paraMostrar: ['descripcion','fechaSolicitud','nombrePartida','validaRectorDirAdmin','verRector']
    }
  };
  //--------------------------------------------

  public displayedColumnsGrupo2 = {
    columnas: {
      descripcion: ['DESCRIPCION'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      nombrePartida: ['TIPO SOLICITUD'],
      validaDirectorVicerrector: ['ESTATUS DIR. / VICERRECTOR'],
      fechaAutorizacion: ['FECHA DIR. / VICERRECTOR'], //fechaAutorizacionDirector
      validaRectorDirAdmin: ['ESTATUS RECTOR / DIR. ADMINISTRATIVO'],
      fechaAutorizacionRec: ['FECHA RECTOR / DIR. ADMINISTRATIVO'],
      validaDTI: ['ESTATUS DTI'],
      fechaAutorizacionDTI2: ['FECHA REVISION DTI'],
      verRector: [''],
      paraMostrar: ['descripcion','fechaSolicitud','nombrePartida','validaDirectorVicerrector','fechaAutorizacion','validaRectorDirAdmin','fechaAutorizacionRec','validaDTI','fechaAutorizacionDTI2','verRector']
    }
  };
  //--------------------------------------------
  public displayedColumnsGrupo3 = {
    columnas: {
      descripcion: ['DESCRIPCION'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      nombrePartida: ['TIPO SOLICITUD'],
      validaDirectorVicerrector: ['ESTATUS DIR. / VICERRECTOR'],
      fechaAutorizacion: ['FECHA AUTORIZACION DIR.'],
      verRector: [''],
      paraMostrar: ['descripcion','fechaSolicitud','nombrePartida','validaDirectorVicerrector','fechaAutorizacion','verRector']
    }
  };
  //--------------------------------------------
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

      const observableValidadorFormulario$ =
      this.formularioValidaciones.valueChanges.subscribe(
        (datos) => {
          this.dcfValidaRectorAdmin(datos);
        }
      );

      this.suscripciones.push(observableValidadorFormulario$);
      this.dcfValidaRectorAdmin();

      //Catálogos
      this.catalogoPeriodo = [];
      this.resultadosValidaRectorAdmin = [];
    }

  disteClick(){
    this.clickBusqueda = true;
  }

  reiniciarFiltros(){

    this.filtro = '';
    //console.log("Filtro reiniciado");
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
    this.filtro ='';
    this.showSpinner = true;
    this.resultadosPartidasExtraordinarias1 = [];
    this.resultadosPartidasExtraordinarias2 = [];
    this.resultadosPartidasExtraordinarias3 = [];
    //console.log(this.formularioValidaciones.value['Descripcion']);
    //------------------------------------------------------------------------------------------
    const buscaForm$ = this._validaRechazaService.recuperaValidaRectorAdmin(
      this.formularioValidaciones.value['Descripcion'],
      this.idPerson
      ).subscribe(
      {
        next: (data) =>{
          data.forEach(element => {
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
          this.resultadosPartidasExtraordinarias1 = data;
          ////console.log(this.resultadosPartidasExtraordinarias1);
          if(this.resultadosPartidasExtraordinarias1.length<=0)
          {this.sinResultados1 = true;}
          else{this.sinResultados1 = false;}
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
    //------------------------------------------------------------------------------------------
    const buscaForm2$ = this._validaRechazaService.recuperaValidaRectorAdmin2(
      this.formularioValidaciones.value['Descripcion'],
      this.idPerson
      ).subscribe(
      {
        next: (data) =>{
          data.forEach(element => {
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
          data = data.filter((item)=> item.validaDirectorVicerrector==1);
          this.resultadosPartidasExtraordinarias2 = data;
          //console.log(this.resultadosPartidasExtraordinarias2);
          if(this.resultadosPartidasExtraordinarias2.length<=0)
          {this.sinResultados2 = true;}
          else{this.sinResultados2 = false;}
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
    //------------------------------------------------------------------------------------------
    const buscaForm3$ = this._validaRechazaService.recuperaValidaRectorAdmin2(
      this.formularioValidaciones.value['Descripcion'],
      this.idPerson
      ).subscribe(
      {
        next: (data) =>{
          data.forEach(element => {
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
          data = data.filter((item)=> item.validaDirectorVicerrector==0);
          this.resultadosPartidasExtraordinarias3 = data;
          ////console.log(this.resultadosPartidasExtraordinarias3);
          if(this.resultadosPartidasExtraordinarias3.length<=0)
          {this.sinResultados3 = true;}
          else{this.sinResultados3 = false;}
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
    this.suscripciones.push(buscaForm2$);
    this.suscripciones.push(buscaForm3$);


  }

  ngOnDestroy() {
    console.info(this.suscripciones.length + 'suscripciones serán destruidas');
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    })
  }

  //ef = errores - formulario
  public efValidaRectorAdmin: any = {
    Descripcion: ''
   };

   //mvf - mensajes de validación del formulario
   public mvfValidaRectorAdmin: any = {
     Descripcion: {
       required: 'Rellena este campo obligatorio'
     }
   };

  //dcf = detecta - cambios - formulario
  private dcfValidaRectorAdmin(datos?: any): void{
    if(!this.formularioValidaciones)
    {return;}
    const formulario = this.formularioValidaciones;

    for(const campo in this.efValidaRectorAdmin){

      if(this.efValidaRectorAdmin.hasOwnProperty(campo)){
        //Limpia mensajes de error previos de existir.
        this.efValidaRectorAdmin[campo] = '';
        const control = formulario.get(campo);

        if(control && control.dirty && control.valid){
          const mensajes = this.mvfValidaRectorAdmin[campo];

          for(const clave in control.errors){
            if(control.errors.hasOwnProperty(clave)){
              this.efValidaRectorAdmin[campo] += mensajes[clave] + ' ';
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


  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    //console.log('tabChangeEvent => ', tabChangeEvent);
    ////console.log('index => ', tabChangeEvent.index);

    if(tabChangeEvent.index ==0){
      //console.log('Pestaña Pendientes seleccionada');
      this.filtro='';
    }
    if(tabChangeEvent.index ==2){
      //console.log('Pestaña Partidas pendientes por jefe seleccionada');
      this.filtro='';
    }
  }

}
