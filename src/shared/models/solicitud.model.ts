export interface Solicitud{
  /*id: number;
  descripcion:string;
  proveedor:string;
  justificacion:string;
  equipoComputo:string;
  costoActual:string;
  concepto:string;
  monto:string;
*/
idRegistro: number;//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

aplicada: number;
borrado: number;
comentDirVic:string;
comentRecDir:string;
comentarioRechazoDTI:string;
comentarioRechazoDirectorVicerrector:string;
comentarioRechazoRectorDirAdmin:string;
costo:string;//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
costof:string;
descripcion:string;//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
equipoComputo: number;
fechaAtencionTesoreria:string;
fechaAutorizacionDTI:string;
fechaAutorizacionDirector:string;
fechaAutorizacionRectorDirAdmin:string;
fechaBorrado:string;
fechaCaptura:string;
fechaUltimaModificacion:string;
idPersonCaptura: number;
idPersonValidaDTI: number;
idPersonValidaDirectorVicerrector: number;
idPersonValidaRectorDirAdmin: number;
idPuesto: number;

idUnidad: number;
idUnidadArea: number;
idperiodo: number;
justificacion: number;
montoReal:string;
nombreDTIRechazo:string;
nombreDirectorRechazo:string;
nombreRectorRechazo:string;
proveedor:string;//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
quienAtendio:string;
tipoPartida: number;//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
validaDTI: number;
validaDTI2: number;
validaDirectorVicerrector: number;
validaRectorDirAdmin: number;


}
