import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { Grupo } from 'src/app/modelo/grupo';
import { MovilGrupo } from 'src/app/modelo/movil-grupo';
import { MovilGrupoService } from 'src/app/servicios/movil-grupo.service';
@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {
  moviles: Movil [] = [];
  seleccionado = new Movil();
  form = new FormGroup({});
  mostrarFormulario = false;
  formularioEditar = false ;
  dataSource = new MatTableDataSource<Movil>();
  columna: string[] = ['patente', 'descripcion', 'dependencia', 'marcamodeloanio', 'patrullaje', 'accion'];
  minDate: Date = new Date();
  mostrarFormularioGrupo = false;
  grupos: MovilGrupo [] = [];

  @ViewChild(MatTable) tabla: MatTable<Movil> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private movilService: MovilService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private movilgrupoService: MovilGrupoService) { }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      moviId: [''],
      moviModoFecha: ['', Validators.required],
      moviModoOdometro: ['', Validators.required],
      moviFechaAlta: [''],
      moviBorrado: [''],
      movilID: [''],
      patente: [''],
      descripcion: [''],
      dependencia: [''],
      dependenciaCompleta: [''],
      marca: [''],
      modelo: [''],
      anio: [''],
      chasis: [''],
      tipoMovil: [''],
      numeroMovil: [''],
      color: [''],
      seguro: [''],
      poliza: [''],
      numeroMotor: [''],
      peso: [''],
      tienePatrullaje: [''],
      CUIT: [''],
      activa: ['']
    });

    this.movilService.get("activos=1").subscribe(
      (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
    );
    this.movilgrupoService.get().subscribe(
      (grupos) => {
        this.grupos = grupos;
        this.actualizarTabla();
      }
    );
  }
  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.moviles;
    this.dataSource.sort = this.sort;
  }
  accion(seleccionado: Movil) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
  }
  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // tslint:disable-next-line:typedef
  agregar() {

  }
  // tslint:disable-next-line:typedef
  delete(row: Movil) {

  }

  // tslint:disable-next-line:typedef
  edit(seleccionado: Movil) {
    this.formularioEditar = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);

  }

  // tslint:disable-next-line:typedef
estado(moviId: number, borrado: number){
  if (moviId !== null && borrado == 0 ) {return 'Movil Registrado en Control de Flota'; }
  else if (moviId !== null && borrado == 1){return 'Movil Borrado'; } 
  else if (borrado == null){return 'Movil No Registrado'; }
  }

  // tslint:disable-next-line:typedef
  guardar() {


  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
    this.formularioEditar = false;
  }
}

