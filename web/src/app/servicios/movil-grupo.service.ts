import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { MovilGrupo } from '../modelo/movil-grupo';


@Injectable({
  providedIn: 'root'
})
export class MovilGrupoService
extends ApiService<MovilGrupo>{
  movilgrup: MovilGrupo[] = [];
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super('movil-grupo', http, app);
  }


}