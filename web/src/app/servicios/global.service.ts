import { Injectable } from '@angular/core';
import { ServicioTarea } from 'src/app/modelo/servicio-tarea';
import { GrupoServicio } from 'src/app/modelo/grupo-servicio';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

    sertar: ServicioTarea[] = [];
    gruser: GrupoServicio[] = [];

  constructor() { }
}