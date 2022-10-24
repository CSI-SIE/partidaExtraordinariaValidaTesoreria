import { Component, Injectable, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Periodo } from 'src/shared/models/periodo.model';
import { resultadosValidaDirectorVicerrector } from 'src/shared/models/tabla.model';
import { ValidaRechazaService } from '../services/validaRechaza.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'valida-tesoreria',
  templateUrl: './valida-tesoreria.component.html',
  styleUrls: ['./valida-tesoreria.component.scss']
})
export class ValidaTesoreriaComponent implements OnInit {
  public filtro: string = '';
  public tipoPartidaExtraordinaria:any[]=[
    {titulo: 'Todas', valor: ''},
    {titulo: 'Pendientes', valor: 'NO ATENDIDO'},
    {titulo: 'Aprobadas', valor: 'APROBADA'},
    {titulo: 'Por concluir', valor: 'POR CERRAR'}
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
  public resultadosValidaDirectorVicerrector: resultadosValidaDirectorVicerrector[];

  opcionPorDefault = 0;

  idPerson = 0;

  //TABLA-------------------------------
  //Estos nombres cambian respecto a como lo mandan de la consulta
  public displayedColumnsGrupo = {
    columnas: {
      descripcion: ['DESCRIPCION'],
      fechaSolicitud: ['FECHA SOLICITUD'],
      fechaAutorizacionRec: ['FECHA AUTORIZACION RECTOR'],
      fechaAutorizacionDTI:['FECHA AUTORIZACION DTI'],
      validacionDTI: ['ESTATUS DTI'],
      fechaAtendida:['FECHA ATENCION COMPRAS'],
      aplicada: ['ESTATUS COMPRAS'],
      costo: ['IMPORTE CON IVA INCLUIDO'],
      montoReal: ['IMPORTE CON IVA INCLUIDO REAL'],
      verCompras: [''],
      paraMostrar: ['descripcion','fechaSolicitud','fechaAutorizacionRec','validacionDTI','fechaAutorizacionDTI','aplicada','fechaAtendida', 'costo','montoReal', 'verCompras']
    }

    };
  //------------------------------------

  rutaDelGeneradorDeReportes = "https://sie.iest.edu.mx/app/escolar/GeneraExcel2.php?";

  constructor(private _fb: UntypedFormBuilder,
    private _validaRechazaService: ValidaRechazaService,
    public _dialog: MatDialog,
    private _router:Router) {

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
          this.dcfValidarTesoreria(datos);
        }
      );

      this.suscripciones.push(observadorValidadorFormulario$);
      this.dcfValidarTesoreria();


      //Catálogos
      this.catalogoPeriodo = [];
      this.resultadosValidaDirectorVicerrector = [];
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

      this.resultadosPartidasExtraordinarias = []; //Limpio el resultado

      const buscaForm$ = this._validaRechazaService.recuperaValidaTesoreria(
        this.formularioValidaciones.value['Descripcion'], //periodo
        this.idPerson
        ).subscribe(
        {
          next: (data) =>{

              //data.filter((item)=> item.validaDirectorVicerrector==0)

              data.forEach(element => {
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
                  element['tipoPartida'] = '';
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
          error: (errores) => {
            console.error(errores);
            this.showSpinner = false;
          },
          complete:() =>{
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
    public efValidarTesoreria: any = {
      Descripcion: ''
     };

     //mvf - mensajes de validación del formulario
     public mvfValidarTesoreria: any = {
       Descripcion: {
         required: 'Rellena este campo obligatorio'
       }
     };

    //dcf = detecta - cambios - formulario
    private dcfValidarTesoreria(datos?: any): void{
      if(!this.formularioValidaciones)
      {return;}
      const formulario = this.formularioValidaciones;

      for(const campo in this.efValidarTesoreria){

        if(this.efValidarTesoreria.hasOwnProperty(campo)){
          //Limpia mensajes de error previos de existir.
          this.efValidarTesoreria[campo] = '';
          const control = formulario.get(campo);

          if(control && control.dirty && control.valid){
            const mensajes = this.mvfValidarTesoreria[campo];

            for(const clave in control.errors){
              if(control.errors.hasOwnProperty(clave)){
                this.efValidarTesoreria[campo] += mensajes[clave] + ' ';
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

    //Exportar a Excel -------------------
  public exportarExcel(){
    //--------------------------------------------------------------------------------------

    var param = "query=exec iest.dbo.Pre_Listado_PartidasExtraordinariasTesoreria '"+
    4 + "', '" + 0 + "', '" + 0 + "', '" + 97 + "', '" + 0 + "', '" + 0 +"'";

    document.location.href = this.rutaDelGeneradorDeReportes + param;
    //"exec Pre_Listado_PartidasExtraordinariasTesoreria '".$idAccion."', '".$idPartida."', '".$idPersonCaptura."', '".$periodo."', '".$aceptoRehazo."', '".$costo."'";

    //var param = "query=exec iest.dbo.NOM_ConcentradoMaestrosListadoHoras '"+
    //periodo+"','" + mes+"'";

    //this.openSnackBar();


//--------------------------------------------------------------------------------------
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {



      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const workbook: XLSX.WorkBook = { Sheets: { 'Hoja1': worksheet },
      SheetNames: ['Hoja1'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() +
       EXCEL_EXTENSION);
  }
    //------------------------------------

    private tratarJson(json:any[]){
      var arreglado = json.map( item => {
        // lo guardas temporalmente
        var temporal = item.idRegistro;
        // eliminas el valor que ya no quieres
        delete item.idRegistro;
        // creas el valor nuevo.
        item.idREGISTRO = temporal;
        return item;
      });
    }

}
