import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevaComponent } from './nueva/nueva.component';
import { ValidaDirectorVicerrectorComponent } from './valida-director-vicerrector/valida-director-vicerrector.component';
import { ValidaDTIComponent } from './valida-dti/valida-dti.component';
import { ValidaRectorAdministrativoComponent } from './valida-rector-administrativo/valida-rector-administrativo.component';
import { ValidaTesoreriaComponent } from './valida-tesoreria/valida-tesoreria.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule)
  },
  {
    path: 'debe-iniciar-sesion-SIE',
    loadChildren:()=>import('./sesion-sie/sesion-sie.module').then(m => m.SesionSieModule)
  },
  {
    path: 'nuevo',
    component: NuevaComponent
  },
  {
    path: 'editar/:idRegistro',
    component: NuevaComponent
  },
  {
    path:'validaDirectorVicerrector',
    component: ValidaDirectorVicerrectorComponent
  },
  {
    path:'validaDTI',
    component: ValidaDTIComponent
  },
  {
    path:'validaRectorAdministrativo',
    component: ValidaRectorAdministrativoComponent
  },
  {
    path: 'validaTesoreria',
    component: ValidaTesoreriaComponent
  },
  {
    path: '**',
    redirectTo: '/inicio'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
