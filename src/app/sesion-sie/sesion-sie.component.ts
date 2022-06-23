import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sesion-sie',
  templateUrl: './sesion-sie.component.html',
  styleUrls: ['./sesion-sie.component.scss']
})
export class SesionSieComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

   /**
   * Redirige al formulario de inicio de sesión en el SIE.
   */
    public cargaInicioSesionSIE(): void {
      window.location.replace('https://sie.iest.edu.mx');
    }
}
