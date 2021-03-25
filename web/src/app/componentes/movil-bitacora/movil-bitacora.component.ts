import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilBitacora } from '../../modelo/movil-bitacora';
import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MovilServicio } from 'src/app/modelo/movil-servicio';
import { MovilServicioService } from 'src/app/servicios/movil-servicio.service';

@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId= 0;
  @Input() moseId=0;
  @Input() servId= 0;
  @Input() programado= false;

  movilbitacoras: MovilBitacora[] = []
  seleccionado = new MovilBitacora();

  columnas: string[] = ['servNombre','mobiFecha','mobiObservaciones','mobiOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});

  mostrarFormulario = false;

  servicios: Servicio[] = [];
  movilservicios: MovilServicio[] = [];
  servprogramado = false;

  constructor(
    private movilbitacoraService: MovilBitacoraService,
    private movilservicioService: MovilServicioService,
    private servicioService: ServicioService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }
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

    this.movilbitacoraService.get(`mobiMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.movilbitacoras = movil;
        this.actualizarTabla();
      }
    );

    this.movilservicioService.get(`moseMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.movilservicios = movil;
      }
    );

    this.servicioService.get().subscribe(
      (servicio) => {
        this.servicios = servicio;
      }
    );

    if(this.programado){
      this.servprogramado = false;
      this.movilbitacoraService.movilbitac.mobiServId = this.moseId;
      this.mostrarFormulario = true;
      this.form.get('mobiServId')?.setValue(this.servId);
    }
  }

  actualizarTabla() {
    this.dataSource.data = this.movilbitacoras;
    this.dataSource.paginator = this.paginator;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //programado
  servicio(seleccionado: MovilBitacora){
    this.servprogramado = false;
    this.movilbitacoras.mobiServId = seleccionado.mobiServId;
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.reset();
    this.form.get('mobiServId')!.setValue(this.seleccionado.mobiServId);
  }
  //no programado
  servicioN() {
    this.servprogramado = true;
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormulario = true;
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
          this.movilbitacoraService.delete(seleccionado.mobiId).subscribe(
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