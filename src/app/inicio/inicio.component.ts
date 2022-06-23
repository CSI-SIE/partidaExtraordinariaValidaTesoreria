import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/shared/models/solicitud.model';
import { CatalogosService } from '../services/catalogo.service';
import { ValidaRechazaService } from '../services/validaRechaza.service';
import { Periodo } from 'src/shared/models/periodo.model';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  private suscripciones: Subscription[];
  private finalizaSubscripcionrecargarTabla: Subscription = null;
  public catalogoPeriodo: Periodo[];
  public formularioValidaciones: UntypedFormGroup;
  public filtro: string = '';
  //public tipoPartidaExtraordinaria:string[]=['Compra general', 'Gastos a comprobar', 'Reembolso', 'Gastos de viajes'];
  public tipoPartidaExtraordinaria:any[]=[
    {titulo: 'Todas', valor: ''},
    {titulo: 'Compra general', valor: 'Compra general'},
    {titulo: 'Gastos a comprobar', valor: 'Gastos a comprobar'},
    {titulo: 'Reembolso', valor: 'Reembolso'},
    {titulo: 'Gastos de viajes', valor: 'Gastos de viajes'}
  ];
  showSpinner = false;
  clickBusqueda = false;
  sinResultados = false;

  opcionPorDefault = 0;
  idPerson = 0;
  //Tabla---------------
  /*resultadosPartidasExtraordinarias:any[] = [
    {
      id: 1,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 2,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 3,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 4,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    },
    {
      id: 22,
      descripcion: 'Esto es una descripción',
      costo: '$5000',
      fechaSolicitud: '2022-05-03',
      tipoSolicitud: 'Compra general',
      directorVicerrector: 'Aprobado',
      rector: 'Aprobado',
      statusDTI: 'Aprobado',
      statusCompras: 'Aprobado'
    }
  ];*/

  pageSizeOptions = [10, 20, 30, 40];
  tamanoTabla = "w-sm-90 w-lg-70 w-xl-50";
  resultadosPartidasExtraordinarias:Solicitud[] = [];
  //-------------------

  constructor(
    private _fb: UntypedFormBuilder,
    private router: Router,
    private _catalogosService: CatalogosService,
    public dialog: MatDialog,
    private _validaRechazaService: ValidaRechazaService,
    private _router:Router
    ) {
    this.resultadosPartidasExtraordinarias = [];
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
          this.dcf(datos);
        }
      );

      this.suscripciones.push(observableValidadorFormulario$);
      this.dcf();
    //Catálogos
    this.catalogoPeriodo = [];
  }

  //TABLA-------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      idRegistro: ['id'],
      descripcion: ['DESCRIPCION'],
      costo: ['COSTO'],
      fechaSolicitud: ['FECHA SOLICITUD'],//<<<<<<<<
      tipoPartida: ['TIPO SOLICITUD'], //<<<<<<<<
      validaDirectorVicerrector: ['ESTATUS DIR. / VICERRECTOR'], //<<<<<<<<
      validaRectorDirAdmin: ['ESTATUS RECTOR / DIR. ADMINISTRATIVO'], //<<<<<<<<
      validaDTI: ['ESTATUS DTI'], //<<<<<<<<
      aplicada: ['ESTATUS COMPRAS'],//<<<<<<<<
      editar: [''],
      paraMostrar: ['descripcion','costo','fechaSolicitud','tipoPartida', 'validaDirectorVicerrector','validaRectorDirAdmin','validaDTI', 'aplicada',  'editar']
    }
  };
//------------------------------------

  ngOnInit(): void {
  //Recarga la tabla siempre y cuando la respuesta en el servicio this._catalogoSevice
    //sea igual a 1, que se envía desde el detalle de la solicitud.
    this.finalizaSubscripcionrecargarTabla = this._validaRechazaService.recargarTabla$.subscribe((resp)=>{
      if(resp == 1){this.onSubmit();} });

      const sesion$ = this._validaRechazaService.obtieneSesion().subscribe(
        {
          next:(data: any) =>{
            if(data.hasOwnProperty('success')){
              this._router.navigate(['/debe-iniciar-sesion-SIE']);
            }
            else{
              console.log(data);
              this.idPerson = data.idPerson;
              console.log(this.idPerson);
            //Si no obtiene un idPerson lo redirige a que inicie sesión.
            if(this.idPerson<=0){
              this._router.navigate(['/debe-iniciar-sesion-SIE']);
            }
            else
            {
                //======================================
                const periodos$ = this._validaRechazaService.recuperaPeriodos().subscribe(
                  {
                    next:(data: any) =>{

                      this.catalogoPeriodo = data;

                      //console.log(data);
                      this.catalogoPeriodo.forEach(element => {
                        if(element.actual){
                          this.opcionPorDefault = element.idPeriodo;
                          this.formularioValidaciones.value['Descripcion'] = this.opcionPorDefault;
                          this.onSubmit();
                        }
                      });



                    },
                    error: (errores) =>{
                      console.error(errores);
                    },
                    complete:()=>{

                    }

                  }
                );
                this.suscripciones.push(periodos$);
                }
          }
        },
          error: (errores) =>{
            console.error(errores);
          }
        }
      );
      this.suscripciones.push(sesion$);



      //======================================

      //Se agrega aquí para después matar estas suscripciones
    this.suscripciones.push(this.finalizaSubscripcionrecargarTabla);


  }

  aplicarFiltro(param){
    this.filtro = param;
  }

  onSubmit(){
    this.filtro='';
    this.showSpinner = true;
    this.resultadosPartidasExtraordinarias = [];

    const obtenerResultados$ = this._catalogosService.obtenerListadoSolicitudesPorPersona(
      this.formularioValidaciones.value['Descripcion'],
      this.idPerson
      ).subscribe(
      {
        next:(data) => {

          data.forEach(element => {
            //------------------------------------------------
            switch(element['tipoPartida']){
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
                element['tipoPartida'] = ''
                break;
            }
            //------------------------------------------------
            /*if(element['costo']){

              const formatterPeso = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              })
              element['costo'] = formatterPeso.format(element['costo']);
            }*/


          });
          console.log(data);
          this.resultadosPartidasExtraordinarias = data;
          if(this.resultadosPartidasExtraordinarias.length<=0)
          {this.sinResultados = true;}
          else
          {this.sinResultados = false;}

        },
        error: (errores) => {
          console.error(errores);
          this.showSpinner = false;
        },
        complete:() => {
          this.showSpinner = false;
        }
      }
    );
    this.suscripciones.push(obtenerResultados$);
  }

  disteClick(){
    this.clickBusqueda = true;
  }

  recargarTabla(){
    //Recarga la tabla siempre y cuando la respuesta en el servicio this._catalogosService
    //sea igual a 1, que se envía desde el detalle de la solicitud.

    this.finalizaSubscripcionrecargarTabla = this._catalogosService.recargarTabla$.subscribe((resp)=>{
    if(resp == 1){ this.onSubmit(); } });

    this.suscripciones.push(this.finalizaSubscripcionrecargarTabla);
  }

  btnClick() {
    this.router.navigateByUrl('/nuevo');
    console.log("di click");
  }

  ngOnDestroy() {
    console.info(this.suscripciones.length + ' suscripciones serán destruidas');
    this.suscripciones.forEach((suscripcion) => {
      suscripcion.unsubscribe();
    })
  }

  //ef = errores - formulario
  public ef: any = {
    Descripcion: ''
   };

   //mvf - mensajes de validación del formulario
   public mvf: any = {
     Descripcion: {
       required: 'Rellena este campo obligatorio'
     }
   };

  //dcf = detecta - cambios - formulario
  private dcf(datos?: any): void{
    if(!this.formularioValidaciones)
    {return;}
    const formulario = this.formularioValidaciones;

    for(const campo in this.ef){

      if(this.ef.hasOwnProperty(campo)){
        //Limpia mensajes de error previos de existir.
        this.ef[campo] = '';
        const control = formulario.get(campo);

        if(control && control.dirty && control.valid){
          const mensajes = this.mvf[campo];

          for(const clave in control.errors){
            if(control.errors.hasOwnProperty(clave)){
              this.ef[campo] += mensajes[clave] + ' ';
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
