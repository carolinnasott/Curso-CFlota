import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { MovilBitacora } from '../modelo/movil-bitacora';

@Injectable({
  providedIn: 'root'
})
export class MovilBitacoraService  extends ApiService<MovilBitacora>{
  movilbitac= new MovilBitacora();
  
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super('movil-bitacora', http, app);

}

}
