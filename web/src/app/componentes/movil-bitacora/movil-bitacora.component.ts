import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilBitacora } from '../../modelo/movil-bitacora';
import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';

@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId= 0;
  @Input() moseId=0;

  movilbitacoras: MovilBitacora[] = []
  seleccionado = new MovilBitacora();

  columnas: string[] = ['servNombre','mobiFecha','mobiObservaciones','mobiOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});

  mostrarFormulario = false;
  mostrarBitacora = false;
  servicios: Servicio[] = [];

  constructor(
    private movilBitacoraService: MovilBitacoraService,
    private servicioService: ServicioService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      mobiId: [''],
      mobiMoseId: [''],
      mobiServId: [''],
      mobiMoviId: [''],
      mobiFecha: [''],
      mobiObservaciones: [''],
      mobiOdometro: [''],
      mobiProximoOdometro: [''],
      mobiProximaFecha: [''],
      mobiIdAnterior: [''],
      mobiIdSiguiente: [''], 
      mobiPendiente: [''],
      mobiFechaAlta: [''],
      mobiBorrado: [''],
      servNombre: ['']
    });

    this.movilBitacoraService.get(`mobiMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.movilbitacoras = movil;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (serv) => {
        this.servicios = serv;
      }
    );
  }

  actualizarTabla() {
    this.dataSource.data = this.movilbitacoras;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  servicio(seleccionado: MovilBitacora){
    this.mostrarBitacora = true;
    this.seleccionado = seleccionado;
    this.form.reset();
    this.form.get('mobiServId')!.setValue(this.seleccionado.mobiServId);
  }

  agregar() {
    this.seleccionado = new MovilBitacora();
    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  
  }

  delete(seleccionado: MovilBitacora) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);
    dialogRef.afterClosed().subscribe(
      (result) => {
        
        if(result) {
          this.movilBitacoraService.delete(seleccionado.mobiId).subscribe(
            () => {
              this.movilbitacoras = this.movilbitacoras.filter(dato => dato.mobiId !== seleccionado.mobiId);
              this.actualizarTabla();
            });
        }
      });
  }

  edit(seleccionado: MovilBitacora) {
      this.mostrarFormulario = true;
      this.seleccionado = seleccionado;
      this.form.setValue(seleccionado);
  }

  guardar() {

  }

  cancelar() {
    this.mostrarFormulario = false;
  }

 


}