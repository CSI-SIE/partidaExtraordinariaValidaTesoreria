import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs/operators'
import { Solicitud } from 'src/shared/models/solicitud.model';
import { CatalogosService } from '../services/catalogo.service';
import { HttpClient } from '@angular/common/http';


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

  idRegistroGlobal:number;

  public solicitudModel: Solicitud;

  private suscripciones: Subscription[];
  public formNuevaSolicitud: FormGroup;


  public partidaExtraordinariaSeleccionada: string = 'Compra general';
  public tipoPartidaExtraordinaria:string[]=['Compra general', 'Gastos a comprobar', 'Reembolso', 'Gastos de viajes'];

  public faltanteDetallar:number;
  public sumaMontosPorConcepto:number;

  public CostoActualLocal:number;

  constructor(private _fb: FormBuilder,
  public route: ActivatedRoute,
  private _catalogosService: CatalogosService,
  private http: HttpClient) {

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
          Validators.required
        ]
      ],
      EquipoComputo:[
        false,
        []
      ],
      detalleConceptos: this._fb.array([
        this._fb.group({
          ConceptoPorDetalle: [null,Validators.required],
          Monto: ['', Validators.required]
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
    return this.formNuevaSolicitud.get('detalleConceptos') as FormArray;
  }

  addDetalleConcepto() {
    this.detalles.push(
      this._fb.group({
        ConceptoPorDetalle: [null],
        Monto: ['']
      })
    );
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

  onSubmit(){


    //console.log(this.detalles.value);
    let variable='';
    for(let elem of this.detalles.controls)
    {
      variable+= elem.value['ConceptoPorDetalle'] + '|' + elem.value['Monto'] + '$';
      //console.log(elem.value['ConceptoPorDetalle']);
      //console.log(elem.value['Monto']);
    }

    //Limpio la variable quitandole el último carácter
    console.log(variable.substring(0,variable.length-1));

    const guardar$ = this._catalogosService.guardarNuevaSolicitudPartidaExtraordinaria(
      this.formNuevaSolicitud.value['Descripcion'],
      this.formNuevaSolicitud.value['Proveedor'],
      this.formNuevaSolicitud.value['Justificacion'],
      this.formNuevaSolicitud.value['CostoActual'],
      this.formNuevaSolicitud.value['EquipoComputo'],
      variable.substring(0,variable.length-1)
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
        }
      }
    );

    this.suscripciones.push(guardar$);
  }

  ngOnInit(): void {

    /*let valoresss = {
      Descripcion: 'ekisde'
    }
    this.formNuevaSolicitud.patchValue(valoresss);
*/
    //Se va a utilizar----------------------------------------------------------------------
    this.route.paramMap.pipe(
      map(params => Number(params.get('idRegistro')))
    ).subscribe(idRegistro =>{

      //Valida si tiene id, el id es el que se obtiene desde la ruta, el id es el que se envió desde la partida seleccionada desde la tabla y dieron editar.
      if(idRegistro>0){
      this.idRegistroGlobal = idRegistro;
      this.formNuevaSolicitud.disable();//Deshabilita TODOS los controles si tiene determinado valor
      const obtenerConceptos$ = this._catalogosService.obtenerListadoConceptosById(idRegistro).subscribe(
        {
          next:(conceptos)=>{
            console.log(conceptos);
           },
          error: (errores) => {
            console.error(errores);
          },
          complete:() =>{}
        }
      );
      this.suscripciones.push(obtenerConceptos$);

      const obtenerSolicitud$ = this._catalogosService.obtenerSolicitudById(idRegistro).subscribe(
        {
          next:(data) => {
            this.solicitudModel = data;
            console.log(this.solicitudModel);

            let fijarDatos = { //Establesco los datos que vienen desde la DB
              Descripcion:  this.solicitudModel[0].descripcion,
              Justificacion: this.solicitudModel[0].justificacion,
              Proveedor: this.solicitudModel[0].proveedor,
              CostoActual: this.solicitudModel[0].costo,
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

  obtenerSolicitud(id){

  }


  onKeyUp() {

    this.CostoActualLocal = parseInt(this.formNuevaSolicitud.value['CostoActual']);
    this.sumaMontosPorConcepto = 0; //reseteo la suma cada que escriban un numero y lo vuelvo a calcular abajo

     for(let detalle of this.detalles.controls)
     {
       if(_isNumberValue(parseInt(detalle.value['Monto'])) && parseInt(detalle.value['Monto'])!=undefined)
       this.sumaMontosPorConcepto+=parseInt(detalle.value['Monto']);
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

  //---------------------------------------------------------------0.

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

    cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
    }

    reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
    }
  //-------------------------------

}
