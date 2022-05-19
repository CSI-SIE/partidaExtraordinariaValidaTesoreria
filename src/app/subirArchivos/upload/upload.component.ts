import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  mostrarProgress=false;

  constructor() { }
  //
  ngOnInit(): void {
  }

  /*ssubirArchivo(file:File){
    //enviar tipo
    this.mostrarProgress = true;
    let formData = new FormData();
    let objXMLHttpRequest = new XMLHttpRequest();
    let resp;
    let _this = this;

    objXMLHttpRequest.upload.addEventListener("progress", function(e) {
      if (e.lengthComputable) {

      }
    }, false);

    objXMLHttpRequest.addEventListener("load", function(e){
      //console.log(objXMLHttpRequest); //RESPUESTA
      if(objXMLHttpRequest.status != 500){
        resp = JSON.parse(objXMLHttpRequest.response);

        if(resp.status){
          //generatedName
          //_this.procesaArchivos(resp.idArchivo);


          _this.mostrarProgress = true;
          _this.incrementar_progress(0);


          let tipoDocumento = _this.archivoSubir[0].tipoDocumento;
          let idPersonProfesor = _this.archivoSubir[0].idPersonProfesor;

          console.log("tipo documento en subir archivo"+tipoDocumento);

          _this.archivoSubir = [];

          //console.log("generated name"+ resp.originalName );
          _this.archivoSubir.push({idPersonProfesor: idPersonProfesor,
            tipoDocumento: tipoDocumento,documentoNombre : resp.generatedName, documentoNombreOriginal : resp.originalName})



          _this.filePdf.emit(_this.archivoSubir);

        }

      } else {

       _this.mostrarProgress = false;
       _this.errorArchivo = true;
       _this.messaggeError = "error de servidor, intente nuevamente";

      }
    }, false);
    objXMLHttpRequest.addEventListener("error", function(e){


      _this.mostrarProgress = false;
       _this.errorArchivo = true;
       _this.messaggeError = "error de servidor, intente nuevamente";
    }, false);

    objXMLHttpRequest.open("POST", this._rutasUrlArchivosService.URL);

    //persona y tipo documento es todo lo que necesito obviamente el file tambien

    formData.append('idPersonProfesor', String(this.archivoSubir[0].idPersonProfesor));
    formData.append('tipoDocumento', String(this.archivoSubir[0].tipoDocumento));
    formData.append('file', file[0] );
    objXMLHttpRequest.send(formData);
  }*/


}
