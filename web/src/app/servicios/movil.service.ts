import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';
import { Movil } from '../modelo/movil';
import { MovilGrupo } from '../modelo/movil-grupo';


@Injectable({
  providedIn: 'root'
})
export class MovilService
extends ApiService<Movil>{
  find(arg0: (dato: any) => number) {
    throw new Error('Method not implemented.');
  }
  movilgrup: MovilGrupo[] = [];
  movilodomet= new Movil();
  movil= new Movil();
  moviles: Movil[]=[];
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super('movil', http, app);
  }


}