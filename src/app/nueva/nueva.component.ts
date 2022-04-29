import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nueva',
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.scss']
})
export class NuevaComponent implements OnInit {

  private suscripciones: Subscription[];
  public formNuevaSolicitud: FormGroup;


  public partidaExtraordinariaSeleccionada: string = 'Compra general';
  public tipoPartidaExtraordinaria:string[]=['Compra general', 'Gastos a comprobar', 'Reembolso', 'Gastos de viajes'];



  public faltanteDetallar:number;
  public sumaMontosPorConcepto:number;

  public CostoActualLocal:number;

  constructor(private _fb: FormBuilder) {

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
    this.formNuevaSolicitud.reset({

    }

    );
  }

  ngOnInit(): void {
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

      this.CostoActualLocal = parseInt(this.formNuevaSolicitud.value['CostoActual']);
      this.sumaMontosPorConcepto = 0; //reseteo la suma cada que escriban un numero y lo vuelvo a calcular abajo

      for(let detalle of this.detalles.controls)
      {
        if(_isNumberValue(parseInt(detalle.value['Monto'])) && parseInt(detalle.value['Monto'])!=undefined)
        this.sumaMontosPorConcepto+=parseInt(detalle.value['Monto']);
      }

      this.faltanteDetallar = this.CostoActualLocal - this.sumaMontosPorConcepto;

    }


  //
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

  //---------------------------------------------------------------

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
}
