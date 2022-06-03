import { _isNumberValue } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { Solicitud } from 'src/shared/models/solicitud.model';
import { CatalogosService } from '../services/catalogo.service';
import { HttpClient } from '@angular/common/http';
import { Concepto } from 'src/shared/models/concepto.model';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ModeloArchivo } from 'src/shared/models/archivo.model';

@Component({
  selector: 'app-nueva',
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.scss']
})
export class NuevaComponent implements OnInit {

  //Subir archivos--------------------
  fileName = '';

  @Input()
  requiredFileType:string;
  uploadProgress:number;
  uploadSub: Subscription;
  //-----------------------------------
  nuevaEditar:string;
  public tipo:number;

  idRegistroGlobal:number;

  public solicitudModel: Solicitud;

  private suscripciones: Subscription[];
  public formNuevaSolicitud: UntypedFormGroup;

  public partidaExtraordinariaSeleccionada: string = 'Compra general';
  public tipoPartidaExtraordinaria:string[]=['Compra general', 'Gastos a comprobar', 'Reembolso', 'Gastos de viajes'];

  public faltanteDetallar:number;
  public sumaMontosPorConcepto:number;

  public CostoActualLocal:number;

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  //archivos
  filePdf:ModeloArchivo [] = [];
  //-----

  constructor(private _fb: UntypedFormBuilder,
  public route: ActivatedRoute,
  private _catalogosService: CatalogosService,
  private router: Router,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  ) {

  this.suscripciones = [];

    //formGroups ----------------------------------------------------
    this.formNuevaSolicitud = this._fb.group({
      Descripcion: [
        '',
        [
          Validators.required
        ]
      ],
      Proveedor: [
        '',
        [
          Validators.required
        ]
      ],
      Justificacion: [
        '',
        [
          Validators.required
        ]
      ],
      CostoActual: [
        '',
        [
          Validators.pattern('[0-9]*'),
          Validators.required
        ]
      ],
      EquipoComputo:[
        false,
        []
      ],

      documentoNombre: [null, Validators.required],

      documentoNombre_nombreOriginal: [null, Validators.required],

      detalleConceptos: this._fb.array([
        this._fb.group({
          IdRegistro: [0],
          ConceptoPorDetalle: [null],
          Monto: []
        })
      ])
    });


     //---------------------------------------------------------------

    const observadorValidadorFormularioCompraGeneral$ =
    this.formNuevaSolicitud.valueChanges.subscribe(
      (datos) => {
        this.dcfCompraGeneral(datos);
      }
    );

    this.suscripciones.push(observadorValidadorFormularioCompraGeneral$);

    this.dcfCompraGeneral();

  }



  get detalles() {
    return this.formNuevaSolicitud.get('detalleConceptos') as UntypedFormArray;
  }

  addDetalleConcepto() {
    this.detalles.push(
      this._fb.group({
        IdRegistro: [0],
        ConceptoPorDetalle: [null],
        Monto: []
      })
    );
  }

  addDetalleConceptoConDatos(conceptos:Concepto[]){
    if(conceptos.length>0)
    {
      this.detalles.clear();
      conceptos.forEach(element => {
        if(element.borrado==0)//Se van a visualizar solo los que NO estan borrados.

        this.detalles.push(
          this._fb.group({
            IdRegistro: [element.idRegistro],
            ConceptoPorDetalle: [element.concepto],
            Monto: [parseFloat(element.monto.toString())]
          })
        )
      });
    }
  }

  deleteDetalleConcepto(i){
    if(this.detalles.length>1){
    this.detalles.removeAt(i)
    }
    this.onKeyUp();
  }

  agregarPartidaExtraordinaria(){
    //agregar
    this.detalles.clear();
    this.addDetalleConcepto();
    this.formNuevaSolicitud.reset(
      {     }
    );
  }

  clickCambiaronTipoSeleccion(event:any){
    /*console.log(this.detalles.controls);
    this.detalles.controls['ConceptoPorDetalle'].setValidators([Validators.required]);
    this.detalles.updateValueAndValidity();
    console.log(this.detalles.controls);
    */

    console.log(event.value);
    if(event.value != 'Compra general'){
      this.detalles.clear();
      this.addDetalleConcepto();
      this.detalles.controls[0].get('ConceptoPorDetalle').setValidators([Validators.required]);
      this.detalles.controls[0].get('Monto').setValidators([Validators.required]);

      this.detalles.controls[0].get('ConceptoPorDetalle').updateValueAndValidity;
      this.detalles.controls[0].get('Monto').updateValueAndValidity;
    }
    else
    {
      //this.detalles.clear();
      /*this.addDetalleConcepto();
      this.detalles.controls[0].get('ConceptoPorDetalle').clearValidators();
      this.detalles.controls[0].get('Monto').clearValidators();

      this.detalles.controls[0].get('ConceptoPorDetalle').updateValueAndValidity;
      this.detalles.controls[0].get('Monto').updateValueAndValidity;
      */
    }
    //console.log(this.detalles);
    //console.log(this.detalles.controls[0].get('ConceptoPorDetalle').setValidators([Validators.required]));

  }

  convertirTipoSeleccionada(){
    switch(this.partidaExtraordinariaSeleccionada){
      case 'Compra general':
        this.tipo = 1;
        break;
      case 'Gastos a comprobar':
        this.tipo = 2;
        break;
      case 'Reembolso':
        this.tipo = 3;
        break;
      case 'Gastos de viajes':
        this.tipo = 4;
        break;
      default:
        this.tipo = 0;
        break;
    }
  }

  convertirTipoSeleccionadaNumToText(_tipo:number){
    switch(_tipo){
      case 1:
        this.partidaExtraordinariaSeleccionada = 'Compra general';
        break;
      case 2:
        this.partidaExtraordinariaSeleccionada = 'Gastos a comprobar';
        break;
      case 3:
        this.partidaExtraordinariaSeleccionada = 'Reembolso';
        break;
      case 4:
        this.partidaExtraordinariaSeleccionada = 'Gastos de viajes';
        break;
      default:
        this.partidaExtraordinariaSeleccionada = '';
        break;
    }
  }

  onSubmit(){

    if(this.faltanteDetallar == 0 || this.partidaExtraordinariaSeleccionada == 'Compra general'){
        let conceptosyMontos='';
        let conceptosCorrectos:boolean = true;
        for(let elem of this.detalles.controls)
        {
          console.log(elem.value['ConceptoPorDetalle']);
          if(elem.value['ConceptoPorDetalle'] != null)
          {
            if(elem.value['ConceptoPorDetalle'].length>0)
            {
              conceptosyMontos+= elem.value['ConceptoPorDetalle'] + '|' + elem.value['Monto'] + '$';
            }
            else
            {
              conceptosCorrectos = false;
              this.openSnackBar('No puede haber conceptos vacios.');
              break;
            }
          }
          else
          { conceptosCorrectos = false; }
        }

        if(conceptosCorrectos || this.partidaExtraordinariaSeleccionada == 'Compra general')
        {
          this.convertirTipoSeleccionada();//Lo convierte en tipo numerico dependiendo del Tipo Seleccionado.

          let equipoComputoNumerico:number = 0;
          if(this.formNuevaSolicitud.value['EquipoComputo']==true)
          { equipoComputoNumerico =1 }

          //Limpio la variable quitandole el último carácter
          console.log(conceptosyMontos.substring(0,conceptosyMontos.length-1));


          if(this.idRegistroGlobal>0){//editar
            const editar$ = this._catalogosService.ModificarSolicitudPartidaExtraordinaria(
              this.tipo,
              this.formNuevaSolicitud.value['Descripcion'],
              this.formNuevaSolicitud.value['Proveedor'],
              this.formNuevaSolicitud.value['Justificacion'],
              this.formNuevaSolicitud.value['CostoActual'],
              equipoComputoNumerico,
              conceptosyMontos.substring(0,conceptosyMontos.length-1),
              this.idRegistroGlobal
            ).subscribe(
              {
                next: () =>{
                  alert('Se he modificado correctamente');
                },
                error: (errores) =>{
                  console.error(errores);
                },
                complete: () => {
                  this.router.navigateByUrl('/inicio');
                }
              }
            );
            this.suscripciones.push(editar$);
          }
          else//agregar
          {
            const guardar$ = this._catalogosService.guardarNuevaSolicitudPartidaExtraordinaria(
              this.tipo,
              this.formNuevaSolicitud.value['Descripcion'],
              this.formNuevaSolicitud.value['Proveedor'],
              this.formNuevaSolicitud.value['Justificacion'],
              this.formNuevaSolicitud.value['CostoActual'],
              equipoComputoNumerico,
              conceptosyMontos.substring(0,conceptosyMontos.length-1)
            ).subscribe(
              {
                next: () => {
                  alert('Se ha guardado correctamente');

                  //La respuesta es idPartida
                },
                error: (errores) =>{
                  console.error(errores);
                },
                complete: () => {
                  this.router.navigateByUrl('/inicio');
                }
              }
            );

            this.suscripciones.push(guardar$);
          }
        }
    }
    else
    {
      this.openSnackBar('Falta detallar los montos respecto al costo total.');
    }


  }

  ngOnInit(): void {

    this.route.paramMap.pipe(
      map(params => Number(params.get('idRegistro')))
    ).subscribe(idRegistro =>{



      //Valida si tiene id, el id es el que se obtiene desde la ruta, el id es el que se envió desde la partida seleccionada desde la tabla y dieron editar.
      if(idRegistro>0){
       this.nuevaEditar = 'Editar'
      this.idRegistroGlobal = idRegistro;
   //   this.formNuevaSolicitud.disable();//Deshabilita TODOS los controles si tiene determinado valor
      const obtenerConceptos$ = this._catalogosService.obtenerListadoConceptosById(
        idRegistro).subscribe(
        {
          next:(conceptos)=>{
            //this.detalles.removeAt(0);
            this.addDetalleConceptoConDatos(conceptos);

            console.log(conceptos);
           },
          error: (errores) => {
            console.error(errores);
          },
          complete:() =>{
            this.onKeyUp();
          }
        }
      );
      this.suscripciones.push(obtenerConceptos$);
      //-------------------------------------------------------------------------------------------------
      const obtenerSolicitud$ = this._catalogosService.obtenerSolicitudById(
        idRegistro).subscribe(
        {
          next:(data) => {
            this.solicitudModel = data;
            console.log(this.solicitudModel);
            if(this.solicitudModel[0].borrado == 1 ||
              this.solicitudModel[0].validaDirectorVicerrector > 0 ||
              this.solicitudModel[0].validaRectorDirAdmin > 0 ||
              this.solicitudModel[0].validaDTI > 0 ||
              this.solicitudModel[0].aplicada > 0)
            {
              //alert('Este registro ya fue borrado o revisado anteriormente, por lo tanto no es posible su edición, a continuación será redirigido a la pantalla principal');
              this.router.navigateByUrl('/inicio');

            }

            this.convertirTipoSeleccionadaNumToText(this.solicitudModel[0].tipoPartida);

            let fijarDatos = { //Establesco los datos que vienen desde la DB
              Descripcion:  this.solicitudModel[0].descripcion,
              Justificacion: this.solicitudModel[0].justificacion,
              Proveedor: this.solicitudModel[0].proveedor,
              CostoActual: parseFloat( this.solicitudModel[0].costo),
              EquipoComputo: this.solicitudModel[0].equipoComputo
            }
            this.formNuevaSolicitud.patchValue(fijarDatos); //Seteo los datos obtenidos en cada control del formulario.

          },
          error: (errores) => {
            console.error(errores);
          },
          complete:() =>{}
        }
      );
        console.log("idRegistro: ",idRegistro );
        this.suscripciones.push(obtenerSolicitud$);
      }
      else{
        this.nuevaEditar = 'Nueva'
      }

    });

  //Se va a utilizar----------------------------------------------------------------------


    //Se va a ocupar cuando en un futuro :3
    /*const contact = localStorage.getItem('');
    if(contact){
      const contactJSON = JSON.parse(contact);
      this.detalles.clear();
      for(let i=0; i< contactJSON.phones.length; i++){
        this.addDetalleConcepto();
      }
      this.formNuevaSolicitud.setValue(JSON.parse(contact));
    }*/
  }



  onKeyUp() {

    this.CostoActualLocal = parseFloat(this.formNuevaSolicitud.value['CostoActual']);
    this.sumaMontosPorConcepto = 0; //reseteo la suma cada que escriban un numero y lo vuelvo a calcular abajo

     for(let detalle of this.detalles.controls)
     {
       if(_isNumberValue(parseFloat(detalle.value['Monto'])) && parseFloat(detalle.value['Monto'])!=undefined)
       this.sumaMontosPorConcepto+=parseFloat(detalle.value['Monto']);
     }

    this.faltanteDetallar = this.CostoActualLocal - this.sumaMontosPorConcepto;

  }



  //ef = errores - formulario--------------------------------------
  public efCompraGeneral: any = {
    Descripcion: '',
    Proveedor: '',
    Justificacion: '',
    CostoActual: ''
  }
  //---------------------------------------------------------------

  //mvf = mensajes - validación - formulario-----------------------
  public mvfCompraGeneral: any = {
    Descripcion: {
      required: 'Rellena este campo obligatorio.'
    },
    Proveedor: {
      required: 'Rellena este campo obligatorio.'
    },
    Justificacion: {
      required: 'Rellena este campo obligatorio.'
    },
    CostoActual: {
      required: 'Rellena este campo obligatorio.'
    }
  }
  //---------------------------------------------------------------.

  //dfc = detecta - cambios - formulario
  private dcfCompraGeneral(datos?: any) : void {
    if(!this.formNuevaSolicitud){return;}
    const formulario = this.formNuevaSolicitud;
    for(const campo in this.efCompraGeneral){
      if(this.efCompraGeneral.hasOwnProperty(campo)){
        //Limpia mensjaes de error precios de existir.
        this.efCompraGeneral[campo] = '';
        const control = formulario.get(campo);
        if(control && control.dirty && !control.valid){
          const mensajes = this.mvfCompraGeneral[campo];
          for (const clave in control.errors){
            if(control.errors.hasOwnProperty(clave)){
              this.efCompraGeneral[campo] += mensajes[clave] + ' ';
            }
          }
        }
      }
    }
  }
  //---------------------------------------------------------------

  //Requeridos------------------------------------------------------
  public esRequeridoCompraGeneral(campo: string): boolean {
    const campoFormulario = this.formNuevaSolicitud.get(campo);
    let validator: any;
    if (campoFormulario) {
      validator = (campoFormulario.validator ? campoFormulario.validator({} as AbstractControl) : false);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }
  //---------------------------------------------------------------


  //FileUploads-------------------
  /*onFileSelected(event) {
    const file:File = event.target.files[0];

    if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("thumbnail", file);

        const upload$ = this.http.post("/api/thumbnail-upload", formData, {
            reportProgress: true,
            observe: 'events'
        })
        .pipe(finalize(() => this.reset())
        );

        this.uploadSub = upload$.subscribe(event => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          }
        })
    }
  }*/

  openSnackBar(mensjae:string) {
    this._snackBar.open(mensjae, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000
    });
  }
  //-------------------------------

  getFile($event){
    this.filePdf = $event;

    this.filePdf.forEach(element => {

      //console.log(element);
      this.formNuevaSolicitud.value['documentoNombre_nombreOriginal'].setValue(element.documentoNombre_nombreOriginal);

      this.formNuevaSolicitud.value['documentoNombre_nombreOriginal'].updateValueAndValidity();

      this.formNuevaSolicitud.value['documentoNombre'].setValue(element.documentoNombre_nombreOriginal);

      this.formNuevaSolicitud.value['documentoNombre'].updateValueAndValidity();

      /*this.formulario.documentoNombre_nombreOriginal.setValue(element.documentoNombre_nombreOriginal);
      this.formulario.documentoNombre_nombreOriginal.updateValueAndValidity();

      this.formulario.documentoNombre.setValue(element.documentoNombre);
      this.formulario.documentoNombre.updateValueAndValidity();*/
    });
  }

  //get formulario() { return this.formNuevaSolicitud.controls}

  //

}
