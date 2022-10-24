import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs/operators'
import { Solicitud } from 'src/shared/models/solicitud.model';
import { CatalogosService } from '../services/catalogo.service';
import { HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { Concepto } from 'src/shared/models/concepto.model';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ModeloArchivo } from 'src/shared/models/archivo.model';
import { ValidaRechazaService } from '../services/validaRechaza.service';
import { UploadDownloadService } from '../services/upload-download.service';
import { ServicioArchivo } from '../services/archivos.service';

@Component({
  selector: 'app-nueva',
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.scss']
})
export class NuevaComponent implements OnInit {

  @ViewChild('Archivo',{static:false})
  Archivo:ElementRef;

  @ViewChild('radioButtons',{static:false})
  radioButtons:ElementRef;

  public GuardadoCorrectamente:boolean = false;
  public activarSeleccionaArchivo: boolean = false;
  //Subir archivos--------------------
  NombreArchivo = '';

  @Input()
  requiredFileType:string;
  uploadProgress:number;
  uploadSub: Subscription;
  //-----------------------------------
  nuevaEditar:string;
  public tipo:number;
  private finalizaSubscripcionrecargarTabla: Subscription = null;
  idRegistroGlobal:number;

  public solicitudModel: Solicitud;

  private suscripciones: Subscription[];
  public formNuevaSolicitud: UntypedFormGroup;

  public formArchivos: UntypedFormGroup;

  public partidaExtraordinariaSeleccionada: string = 'Compra general';
  public tipoPartidaExtraordinaria:string[]=['Compra general', 'Gastos a comprobar', 'Reembolso', 'Gastos de viajes'];

  public faltanteDetallar:number;
  public sumaMontosPorConcepto:number;

  public CostoActualLocal:number;

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  //archivos
  public modeloArchivo: ModeloArchivo[];

  //-----


  idPerson = 0;

  constructor(
  private _validaRechazaService: ValidaRechazaService,
  private _archivosService: UploadDownloadService,
  private _fb: UntypedFormBuilder,
  public route: ActivatedRoute,
  private _catalogosService: CatalogosService,
  private _subirArchivosService: ServicioArchivo,
  private router: Router,
  private http: HttpClient,
  private _snackBar: MatSnackBar,
  private _router:Router
  ) {

  this.suscripciones = [];
  this.modeloArchivo =[];

    //formGroups Guardar----------------------------------------------------
    /*this.formNuevaSolicitud = this._fb.group({
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
        null,
        [
          Validators.required
        ]
      ],
      EquipoComputo:[
        false,
        []
      ]
    });*/

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
        null,
        [
          Validators.required
        ]
      ],
      EquipoComputo:[
        false,
        []
      ],

      //documentoNombre: [null, Validators.required],

      //documentoNombre_nombreOriginal: [null, Validators.required],

      detalleConceptos: this._fb.array([
        this._fb.group({
          IdRegistro: [0],
          ConceptoPorDetalle: [null],
          Monto: []
        })
      ])
    });




    //formGroups Archivos--------------------------------------
    this.formArchivos= this._fb.group({
      fileCotizacion:[
        null,
        []
      ],

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
    /*//console.log(this.detalles.controls);
    this.detalles.controls['ConceptoPorDetalle'].setValidators([Validators.required]);
    this.detalles.updateValueAndValidity();
    //console.log(this.detalles.controls);
    */

    //console.log(event.value);
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
    ////console.log(this.detalles);
    ////console.log(this.detalles.controls[0].get('ConceptoPorDetalle').setValidators([Validators.required]));

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

  submitDePrueba(){

    this.GuardadoCorrectamente = true;
    this.formNuevaSolicitud.disable();

  }

  onSubmit(){

    if(this.faltanteDetallar == 0 || this.partidaExtraordinariaSeleccionada == 'Compra general'){
        let conceptosyMontos='';
        let conceptosCorrectos:boolean = true;
        for(let elem of this.detalles.controls)
        {
          //console.log(elem.value['ConceptoPorDetalle']);
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
          //console.log(conceptosyMontos.substring(0,conceptosyMontos.length-1));


          if(this.idRegistroGlobal>0){//editar
            const editar$ = this._catalogosService.ModificarSolicitudPartidaExtraordinaria(
              this.tipo,
              this.formNuevaSolicitud.value['Descripcion'],
              this.formNuevaSolicitud.value['Proveedor'],
              this.formNuevaSolicitud.value['Justificacion'],
              this.formNuevaSolicitud.value['CostoActual'],
              equipoComputoNumerico,
              conceptosyMontos.substring(0,conceptosyMontos.length-1),
              this.solicitudModel[0].idperiodo,//este idPeriodo es el que se obtiene en el ngOnInit
              this.idRegistroGlobal,
              this.idPerson
            ).subscribe(
              {
                next: () =>{

                  this.GuardadoCorrectamente = true;
                  this.formNuevaSolicitud.disable();
                  this.openSnackBar("Se ha modificado correctamente");
                },
                error: (errores) =>{
                  console.error(errores);
                },
                complete: () => {
                //  this.router.navigateByUrl('/inicio');
                }
              }
            );
            this.suscripciones.push(editar$);
          }
          else//agregar
          {

            //Periodos-------------
            let idPeriodoActual:number = 0;
            const periodos$ = this._validaRechazaService.recuperaPeriodos().subscribe(
              {
                next:(data) =>{
                  ////console.log(data);
                  data = data.filter((item)=>item.actual==1);//filtro para obtener el idPeriodo actual
                  idPeriodoActual = data[0]['idPeriodo'];
                },
                error:(errores)=>{
                  console.error(errores);
                },
                complete:()=>{

                  if(idPeriodoActual>0)
                  {
                    const guardar$ = this._catalogosService.guardarNuevaSolicitudPartidaExtraordinaria(
                      this.tipo,
                      this.formNuevaSolicitud.value['Descripcion'],
                      this.formNuevaSolicitud.value['Proveedor'],
                      this.formNuevaSolicitud.value['Justificacion'],
                      this.formNuevaSolicitud.value['CostoActual'],
                      equipoComputoNumerico,
                      conceptosyMontos.substring(0,conceptosyMontos.length-1),
                      idPeriodoActual,
                      this.idPerson
                    ).subscribe(
                      {
                        next: (data) => {
                          ////console.log("<<<<<<<<<<<<<<<<Aquí>>>>>>>>>>>>");
                          ////console.log(data);
                          ////console.log(data[0]['idPartida']);
                          this.idRegistroGlobal = data[0]['idPartida'];
                          this.GuardadoCorrectamente = true;
                          this.formNuevaSolicitud.disable();
                          this.activarSeleccionaArchivo = true;
                          this.openSnackBar("Se ha guardado correctamente");

                          //alert('Se ha guardado correctamente');
                        },
                        error: (errores) =>{
                          console.error(errores);
                        },
                        complete: () => {
                       //   this.router.navigateByUrl('/inicio');
                        }
                      }
                    );

                    this.suscripciones.push(guardar$);
                  }
                  else
                  {
                    //console.log('No se pudo obtener el IdPeriodo')
                  }

                }
              }
            );
            this.suscripciones.push(periodos$);
          }
        }
    }
    else
    {
      this.openSnackBar('Falta detallar los montos respecto al costo actual.');
    }


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

    this.route.paramMap.pipe(
      map(params => Number(params.get('idRegistro')))
    ).subscribe(idRegistro =>{
      //Valida si tiene id, el id es el que se obtiene desde la ruta, el id es el que se envió desde la partida seleccionada desde la tabla y dieron editar.
      if(idRegistro>0){
       this.nuevaEditar = 'Editar'
       this.idRegistroGlobal = idRegistro;
       this.activarSeleccionaArchivo = true;
   //   this.formNuevaSolicitud.disable();//Deshabilita TODOS los controles si tiene determinado valor
      const obtenerConceptos$ = this._catalogosService.obtenerConceptosById(
        idRegistro
        ).subscribe(
        {
          next:(conceptos)=>{
            //this.detalles.removeAt(0);
            this.addDetalleConceptoConDatos(conceptos);

            //console.log(conceptos);
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
        idRegistro,
        this.idPerson
        ).subscribe(
        {
          next:(data) => {

            if(data.length<=0)
            {
              this.router.navigateByUrl('/inicio');
            }
            else{
              this.solicitudModel = data;
            //console.log(this.solicitudModel);
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
            //console.log(this.solicitudModel[0].costo);
            let fijarDatos = { //Establesco los datos que vienen desde la DB
              Descripcion:  this.solicitudModel[0].descripcion,
              Justificacion: this.solicitudModel[0].justificacion,
              Proveedor: this.solicitudModel[0].proveedor,
              CostoActual: parseFloat( this.solicitudModel[0].costo),

              EquipoComputo: this.solicitudModel[0].equipoComputo
            }
            //console.log(parseFloat(this.solicitudModel[0].costo));
            this.formNuevaSolicitud.patchValue(fijarDatos); //Seteo los datos obtenidos en cada control del formulario.
            }


          },
          error: (errores) => {
            console.error(errores);
          },
          complete:() =>{
            this.onKeyUp();
          }
        }
      );
        //console.log("idRegistro: ",idRegistro );
        this.suscripciones.push(obtenerSolicitud$);


      this.listarArchivos(idRegistro);


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

  listarArchivos(_idRegistro:number){
    this.modeloArchivo= [];
    //Listar archivos-----------------
    const obtenerlistardearchivosdelasolicitud$ = this._subirArchivosService.listaArchivosCotizacion(
      _idRegistro).subscribe(
      {
        next:(archivos)=>{
          //recorro y agrego la extensión del archivo a el modelo de archivos
          archivos.forEach(element => {
            if(element['nombreArchivo']){
              ////console.log(element['nombreArchivo']);
              ////console.log(element['nombreArchivo'].split(".").pop());
              element['extension'] = element['nombreArchivo'].split(".").pop();
            }
          });
          this.modeloArchivo = archivos;
          //console.log(archivos);
         },
        error: (errores) => {
          console.error(errores);
        },
        complete:() =>{

        }
      }
    );
    this.suscripciones.push(obtenerlistardearchivosdelasolicitud$);

    //--------------------------------
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
      duration: 3000
    });
  }
  //-------------------------------
  percentDone: number;
  uploadSuccess: boolean;


  upload(files: File[]){

    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))
    this.http.post('https://file.io', formData)
      .subscribe(event => {
        //console.log('done')
      })

  }

  clickeaste(){
    if(Math.round(this.Archivo.nativeElement.files[0].size / 1024) <= 20480)//son KB
    {
      this.NombreArchivo = this.Archivo.nativeElement.files[0].name;
    }
    else{

      this.Archivo.nativeElement.value = "";
      this.NombreArchivo = "";
      this.openSnackBar('No se permite subir archivos de 20 MB o más.');
    }
  }

  subirArchivo(){
    ////console.log(this.Archivo.nativeElement.files[0]);
    //this.Archivo.nativeElement.target.files
    const archivo$ = this._archivosService.subirArchivo(this.idRegistroGlobal,this.Archivo.nativeElement.files[0]).subscribe(
      {
        next:(data) =>{

          if(data['generatedName'].length>0){
            //console.log(data);
            //console.log(data['generatedName']);
            this.listarArchivos(this.idRegistroGlobal);
            this.openSnackBar('Se ha subido correctamente el archivo: '+ this.Archivo.nativeElement.files[0].name);
            this.Archivo.nativeElement.value = "";
            this.NombreArchivo = "";
          }
        },
        error:(errores)=>{

          console.error(errores);

        },
        complete:()=>{

        }
      }
    );
    this.suscripciones.push(archivo$);

  }

  eliminarArchivo(_idArchivo:number, _nombreArchivo:string){
    //console.log(_idArchivo);
    const eliminarArchivo$ = this._subirArchivosService.eliminarArchivo(_idArchivo).subscribe(
      {
        next:(data) =>{
          if(data){
            this.listarArchivos(this.idRegistroGlobal);
            this.openSnackBar('Se ha eliminado correctamente el archivo: '+ _nombreArchivo);
          }
        },
        error:(errores)=>{

          console.error(errores);

        },
        complete:()=>{

        }
      }
    );
    this.suscripciones.push(eliminarArchivo$);
  }

    //

  getFile($event){
    /*this.filePdf = $event;

    this.filePdf.forEach(element => {

      ////console.log(element);
      this.formNuevaSolicitud.value['documentoNombre_nombreOriginal'].setValue(element.documentoNombre_nombreOriginal);

      this.formNuevaSolicitud.value['documentoNombre_nombreOriginal'].updateValueAndValidity();

      this.formNuevaSolicitud.value['documentoNombre'].setValue(element.documentoNombre_nombreOriginal);

      this.formNuevaSolicitud.value['documentoNombre'].updateValueAndValidity();
      //--------------------------------------------------------------------------------------
      /*this.formulario.documentoNombre_nombreOriginal.setValue(element.documentoNombre_nombreOriginal);
      this.formulario.documentoNombre_nombreOriginal.updateValueAndValidity();

      this.formulario.documentoNombre.setValue(element.documentoNombre);
      this.formulario.documentoNombre.updateValueAndValidity();
    });*/
  }

  //get formulario() { return this.formNuevaSolicitud.controls}

  //

}
