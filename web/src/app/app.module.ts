import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './componentes/home/home.component';
import { AppConfigService } from './core/config.service';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';


import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { GrupoComponent } from './componentes/grupo/grupo.component';
import { TareaComponent } from './componentes/tarea/tarea.component';
import { ServicioTareaComponent } from './componentes/servicio-tarea/servicio-tarea.component';
import { GrupoServicioComponent } from './componentes/grupo-servicio/grupo-servicio.component';
import { MovilComponent } from './componentes/movil/movil.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MovilServicioComponent } from './componentes/movil-servicio/movil-servicio.component';
import { MovilBitacoraComponent } from './componentes/movil-bitacora/movil-bitacora.component';
import { MovilOdometroComponent } from './componentes/movil-odometro/movil-odometro.component';
import { MovilGrupoComponent } from './componentes/movil-grupo/movil-grupo.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GrupoComponent,
    ConfirmarComponent,
    ServicioComponent,
    TareaComponent,
    ServicioTareaComponent,
    GrupoServicioComponent,
    MovilComponent,
    MovilServicioComponent,
    MovilBitacoraComponent,
    MovilOdometroComponent,
    MovilGrupoComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatStepperModule,
    MatGridListModule

  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// tslint:disable-next-line:typedef
export function loadConfig(config: AppConfigService) {
  return () => config.load();
}