import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioModule } from './inicio/inicio.module';
import { NuevaComponent } from './nueva/nueva.component';
import { ValidaDirectorVicerrectorComponent } from './valida-director-vicerrector/valida-director-vicerrector.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then(m => InicioModule)
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
    path: '**',
    redirectTo: '/inicio'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
