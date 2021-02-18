import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoServicioComponent } from './componentes/grupo-servicio/grupo-servicio.component';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { HomeComponent } from './componentes/home/home.component';
import { ServicioTareaComponent } from './componentes/servicio-tarea/servicio-tarea.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { TareaComponent } from './componentes/tarea/tarea.component';
import { MovilComponent } from './componentes/movil/movil.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'grupos', component: GrupoComponent },
  { path: 'servicios', component: ServicioComponent },
  { path: 'tareas', component: TareaComponent },
  { path: 'movil', component: MovilComponent }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
