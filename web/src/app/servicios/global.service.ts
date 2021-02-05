import { Injectable } from '@angular/core';
import { ServicioTarea } from 'src/app/modelo/servicio-tarea';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

    sertar: ServicioTarea[] = [];

  constructor() { }
}