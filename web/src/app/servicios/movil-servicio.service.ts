import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { MovilServicio } from '../modelo/movil-servicio';

@Injectable({
  providedIn: 'root'
})
export class MovilServicioService  extends ApiService<MovilServicio>{
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super('movil-servicio', http, app);

}
  movilserv: MovilServicio[] = [];
}
