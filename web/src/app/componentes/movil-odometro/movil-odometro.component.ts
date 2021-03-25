import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';
import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-movil-odometro',
  templateUrl: './movil-odometro.component.html',
  styleUrls: ['./movil-odometro.component.css']
})
export class MovilOdometroComponent implements OnInit {

  @Input() moviId= 0;

  movilodometros: MovilOdometro[] = []
  seleccionado = new MovilOdometro();
  moviles = new Movil();
  movil: Movil[] = [];
  

  columnas: string[] = ['modoFecha','modoOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilOdometro>();

  form = new FormGroup({});

  mostrarFormulario = false;
  servicios: Servicio[] = [];
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private movilodometroService: MovilOdometroService,
    private movilService: MovilService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

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

    this.movilService.get().subscribe(
      (movil) => {
        this.movil = movil;
      }
    );
  }

  actualizarTabla() {
    this.dataSource.data = this.movilodometros;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.seleccionado = new MovilOdometro();
    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }

  delete(seleccionado: MovilOdometro) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);
    dialogRef.afterClosed().subscribe(
      result =>{
        console.log(`Dialog resulr: ${result}`);
        if (result) {
          this.movilodometroService.delete(seleccionado.modoId).subscribe(
            () => {
              this.movilodometros = this.movilodometros.filter( dato => dato.modoId !== seleccionado.modoId);
              this.actualizarTabla();
            });
        }
      });
  }

  edit(seleccionado: MovilOdometro) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }
    if(this.seleccionado.modoId){

      this.seleccionado.modoOdometro = this.form.value.modoOdometro;
      this.seleccionado.modoFecha = this.form.value.modoFecha;
      this.movilodometroService.put(this.seleccionado).subscribe();
      this.movilodometros = this.movilodometros.filter(dato => dato.modoId != this.seleccionado.modoId);
      this.movilodometros.push(this.seleccionado);
    }else{
      this.seleccionado.modoOdometro = this.form.value.modoOdometro;
      this.seleccionado.modoFecha = this.form.value.modoFecha;
      this.seleccionado.modoMoviId = this.moviId;

      let primero = this.movilodometros[0];

      if(primero.modoOdometro > this.form.value.modoOdometro){
        this.cancelar();

      }else{
        this.movilodometroService.post(this.seleccionado).subscribe();
        this.movilodometros = this.movilodometros.filter(dato => dato.modoId != this.seleccionado.modoId);
        this.movilodometros.push(this.seleccionado);    
        }
    }

    this.form.reset();
    this.actualizarTabla();

  }

  cancelar() {
    this.mostrarFormulario = false;
  }

}