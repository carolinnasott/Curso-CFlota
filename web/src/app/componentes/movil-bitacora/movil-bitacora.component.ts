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
import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';
import { BitacoraTareaService } from 'src/app/servicios/bitacora-tarea.service';
import { MovilService } from 'src/app/servicios/movil.service';

@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {
  @Input() moviId= 0;
  @Input() programado = false; //desde movil-servicio

  movilbitacoras: MovilBitacora[] = [];
  seleccionado = new MovilBitacora();

  columnas: string[] = ['servNombre', 'mobiFecha', 'mobiObservaciones', 'mobiOdometro', 'mobiProximoOdometro', 'mobiProximaFecha', 'mobiPendiente', 'acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});
  formularioTarea = new FormGroup({});

  mostrarFormulario = false;
  grillaBitacora = false;

  servicios: Servicio[] = [];
  movilservicios: MovilServicio[] = [];
  bitacoratareas: BitacoraTarea[] = [];
  bitacoraTarea = new BitacoraTarea();

  constructor(
    public movilbitacoraService: MovilBitacoraService,
    private movilservicioService: MovilServicioService,
    private movilServ: MovilService,
    private servicioService: ServicioService,
    private bitacoraTareaService: BitacoraTareaService,
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
      servNombre: [''],
      patente: [''],
      descripcion: ['']
    });

    this.movilbitacoraService.get(`mobiMoviId=${this.movilServ.movil.moviId}`).subscribe(
      (movil) => {
        this.movilbitacoras = movil;
        this.actualizarTabla();
      }
    );

    this.movilservicioService.get(`moseMoviId=${this.movilServ.movil.moviId}`).subscribe(
      (movil) => {
        this.movilservicios = movil;
      }
    );

    this.servicioService.get().subscribe(
      (servicio) => {
        this.servicios = servicio;
      }
    );

    if (this.programado) {//preguntar si es un serv programado
      this.movilbitacoraService.movilbitac.mobiServId = this.movilservicioService.movilserv.moseServId;
      this.mostrarFormulario = true;
      //toma el valor del servicio
      this.form.get('mobiServId')?.setValue(this.movilservicioService.movilserv.moseServId);
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
  servicio(seleccionado: MovilBitacora) {
    this.movilbitacoraService.movilbitac.mobiServId = seleccionado.mobiServId;
    this.mostrarFormulario = true;
    this.grillaBitacora = true;
    this.seleccionado = seleccionado;
    this.movilbitacoraService.movilbitac = seleccionado;
    this.form.reset();
    this.form.get('mobiServId')!.setValue(this.seleccionado.mobiServId);
  }
  //no programado
  servicioN() {
    //this.servprogramado=false;
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormulario = true;
  }


  delete(seleccionado: MovilBitacora) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);
    dialogRef.afterClosed().subscribe(
      (result) => {

        if (result) {
          this.movilbitacoraService.delete(seleccionado.mobiId).subscribe(
            () => {
              this.movilbitacoras = this.movilbitacoras.filter(dato => dato.mobiId !== seleccionado.mobiId);
              this.actualizarTabla();
            });
        }
      });
  }

  edit(seleccionado: MovilBitacora) {
    this.movilbitacoraService.movilbitac.mobiServId = seleccionado.mobiServId;
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }
    let moseKM = 0;
    if (this.programado) { //servicio programado , pendiente
      //setear los datos
      this.seleccionado.mobiMoviId = this.movilservicioService.movilserv.moseMoviId;
      this.seleccionado.mobiServId = this.movilservicioService.movilserv.moseServId;
      this.seleccionado.mobiMoseId = this.movilservicioService.movilserv.moseId;
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
      //calcular KM
      moseKM = this.movilservicios.find(dato => dato.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      //traigo los datos de la fecha para actualizar
      this.actualizarProxFecha(this.seleccionado);
      //queda pendiente
      this.seleccionado.mobiPendiente = true;

      this.movilbitacoraService.post(this.seleccionado).subscribe(
        (agregarTarea) => {
          this.Tareas(agregarTarea.mobiId);
        }
      );
      this.programado = false; //no es servicio programado

    } else if (this.grillaBitacora){ // no programado, pendiente
      //actualizar el estado pendiente de la bitacora a falso
      this.seleccionado.mobiPendiente = false;
      this.movilbitacoraService.put(this.seleccionado).subscribe();
      //cargar bitacora siguiente
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
      //calcular KM
      moseKM = this.movilservicios.find(dato => dato.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      //actualizar fecha
      this.actualizarProxFecha(this.seleccionado);
      //cambiar estado de Pendiente
      this.seleccionado.mobiPendiente = true;
      this.seleccionado.mobiIdAnterior = this.seleccionado.mobiId;
 
      this.movilbitacoraService.post(this.seleccionado).subscribe(
        (nuevaTarea) => {
          this.Tareas(nuevaTarea.mobiId);
        }
      );
      this.grillaBitacora = false;

      //editar movil-bitacora
    } else if(this.seleccionado.mobiId) { 
      this.seleccionado.mobiServId = this.form.value.mobiServId;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      //odometro
      if(this.form.value.mobiOdometro !== this.seleccionado.mobiOdometro ){
        this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
        //calcular KM
        moseKM = this.movilservicios.find(dato => dato.moseId = this.seleccionado.mobiMoseId)!.moseKM;
        this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      }
      //fecha
      if(this.form.value.mobiFecha !== this.seleccionado.mobiFecha){
        this.seleccionado.mobiFecha = this.form.value.mobiFecha;
        //actualizar Fecha
        this.actualizarProxFecha(this.seleccionado);
      }
      this.movilbitacoraService.put(this.seleccionado).subscribe(
        () => {
          this.Tareas(this.seleccionado.mobiId);
        }
      );
    //agregar bitacora no programada ni pendiente
     }else{ 
       //setear los datos
      this.seleccionado.mobiMoviId = this.movilServ.movil.moviId;
      this.seleccionado.mobiServId = this.form.value.mobiServId;
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
      
      this.movilbitacoraService.post(this.seleccionado).subscribe();
    }
    
    this.mostrarFormulario = false;
    this.movilbitacoras= this.movilbitacoras.filter(dato => dato.mobiId !== this.seleccionado.mobiId);
    this.seleccionado.servNombre = this.servicios.find(dato => dato.servId == this.seleccionado.mobiServId)!.servNombre;
    this.movilbitacoras.push(this.seleccionado);
    this.actualizarTabla();
    
  }

  //funciones necesarias para cargar una bitacora
  actualizarProxFecha(seleccionado: MovilBitacora) {
    let mosePeriodo = this.movilservicios.find(dato => dato.moseId = seleccionado.mobiMoseId)!.mosePeriodo;
    let fecha = new Date(seleccionado.mobiFecha.getFullYear(),
      seleccionado.mobiFecha.getMonth(),
      seleccionado.mobiFecha.getDate());
    fecha.setDate(fecha.getDate() + mosePeriodo);//guardo datos en fecha para poder actualizar
    seleccionado.mobiProximaFecha = fecha;
  }

  Tareas(mobiId: number){
    this.movilbitacoraService.get(`mobiMoviId=${this.movilServ.movil.moviId}`).subscribe(
      (mobiId) => {
        this.movilbitacoras = mobiId;
      }
    )
    //actualizar las tareas
    this.bitacoraTareaService.bitatarea.forEach((x) => {
      x.bitaMobiId = mobiId;
      if(x.bitaBorrado){
        this.bitacoraTareaService.delete(x.bitaId).subscribe();
      }
      if(x.bitaId > 0){
        this.bitacoraTareaService.put(x).subscribe();
      }
      if(x.bitaId < 0){
        this.bitacoraTareaService.post(x).subscribe();
      }
    });
    this.mostrarFormulario= false;
    this.actualizarTabla;
  }

  cancelar() {
    this.form.reset();
    this.mostrarFormulario = false;
    this.movilbitacoraService.movilbitac.mobiServId = 0;
  }

  //select de servicios
  mobiServIdChange(event: any){
    console.log(event.value);
    this.movilbitacoraService.movilbitac.mobiServId = event.value;
  }

}