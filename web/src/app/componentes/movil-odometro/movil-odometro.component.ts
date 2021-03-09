import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';

@Component({
  selector: 'app-movil-odometro',
  templateUrl: './movil-odometro.component.html',
  styleUrls: ['./movil-odometro.component.css']
})
export class MovilOdometroComponent implements OnInit {

  @Input() moviId= 0;

  movilodometros: MovilOdometro[] = []
  seleccionado = new MovilOdometro();

  columnas: string[] = ['modoFecha','modoOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilOdometro>();

  form = new FormGroup({});

  mostrarFormulario = false;
  servicios: Servicio[] = [];

  constructor(
    private movilodometroService: MovilOdometroService,
    private servicioService: ServicioService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      modoId: [''],
      modoMoviId: [''],
      modoFecha: [''],
      modoOdometro: [''],
      modoFechaAlta: [''],
      modoBorrado: ['']
    });

    this.movilodometroService.get(`modoMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.movilodometros = movil;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (servicio) => {
        this.servicios = servicio;
      }
    );
  }

  actualizarTabla() {
    this.dataSource.data = this.movilodometros;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    
  }

  delete(row: MovilOdometro) {

  }

  edit(seleccionado: MovilOdometro) {
   
  }

  guardar() {

  }

  cancelar() {
    this.mostrarFormulario = false;
  }

 


}