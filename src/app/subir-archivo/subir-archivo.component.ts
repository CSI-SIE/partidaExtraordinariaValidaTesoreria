import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ModeloArchivo } from 'src/shared/models/archivo.model';

import { ServicioArchivo } from '../services/archivos.service';

const URL = 'http://localhost:8080//app/administrativo/subirArchivo.php';
//const URL = 'https://sie.iest.edu.mx//app/administrativo/subirArchivo.php';
@Component({
  selector: 'subir-archivo',
  templateUrl: './subir-archivo.component.html',
  styleUrls: ['./subir-archivo.component.scss']
})
export class SubirArchivoComponent implements OnInit {

  readonly maxSize: number = 20 * 1024 * 1024;
  @Output() filePdf = new EventEmitter<ModeloArchivo>();
  nombreArchivo:string;
  files:File;
  datosArchivo:ModeloArchivo[] = [];

  //variables para el progress
  mostrarProgress: boolean = false;
  errorArchivo:boolean = false;

  mensajeError:string;

  progress:number = 0;


  constructor(private _consultaDatos: ServicioArchivo) { }

  ngOnInit(): void {
  }

  subirArchivo(file:File){
    this.mostrarProgress = true;
    let formData = new FormData();
    let xhr = new XMLHttpRequest();
    let resp;
    let _this = this;

    xhr.upload.addEventListener("progress", function(e){
      if(e.lengthComputable){

      }
    }, false);

    xhr.addEventListener("load", function(e){
      if(xhr.status != 500){
        resp = JSON.parse(xhr.response);

        if(resp.status){
          _this.mostrarProgress = true;
          _this.incrementar_progress(0);

          _this.datosArchivo = [];
          //_this.datosArchivo.push({documentoNombre:resp.generatedName, documentoNombre_nombreOriginal: resp.originalName});
          //_this.filePdf.emit({documentoNombre:resp.generatedName, documentoNombre_nombreOriginal: resp.originalName});
        }
      }
      else{
        _this.mostrarProgress = false;
        _this.errorArchivo = true;
        _this.mensajeError = "error de servidor, intente nuevamente";
      }
    }, false );

    xhr.addEventListener("error", function(e){
      _this.mostrarProgress = false;
      _this.errorArchivo = true;
      _this.mensajeError = "error de servidor, intente nuevamente";
    }, false);

    xhr.open("POST", URL);

    //formData.append('idPerson', String(this.idPerson));
    formData.append('file', file[0]);
    xhr.send(formData);
  }

  isValidFile(file: any){
    return file.name.endsWith('.pdf');
  }

  incrementar_progress(x){
    if(x<101){
      this.progress = x;
      setTimeout(() => this.incrementar_progress(x+10), 200);
    }
  }

  uploadFile(e:any){
    this.mostrarProgress = false;
    this.errorArchivo = false;

    this.files = e.srcElement.files;
    const textoDiv = document.getElementById("nombreArchivo");
    if(this.isValidFile(this.files[0]) && this.files[0].size <= this.maxSize){

      this.nombreArchivo = this.files[0].name;
      textoDiv.setAttribute("data-text", this.nombreArchivo);

      try{
        this.subirArchivo(this.files);
      }catch(e){
        //console.log('error', e);
      }
    }else{
      textoDiv.setAttribute("data-text", "Seleccione archivo .pdf");
      this.files = undefined;

      if(!this.files[0].endWith(".pdf")){
        this.mensajeError = "Extensión no valida, el archivo tiene que ser un pdf. ";
        this.errorArchivo = true;
        alert(this.mensajeError);
      }

      if(this.files[0].size > this.maxSize){
        this.mensajeError = "Ha excedido el límite de tamaño de 20 MB";
        alert(this.mensajeError);
        this.errorArchivo = true;
      }


    }
  }

}
