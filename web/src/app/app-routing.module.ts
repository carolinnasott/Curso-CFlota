import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { HomeComponent } from './componentes/home/home.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { TareaComponent } from './componentes/tarea/tarea.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'grupos', component: GrupoComponent },
  { path: 'servicios', component: ServicioComponent },
  { path: 'tareas', component: TareaComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
