import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {
  items: Movil [] = [];
  seleccionado = new Movil();
  form = new FormGroup({});
  mostrarFormulario = false;
  dataSource = new MatTableDataSource<Movil>();
  columna: string[] = ['patente', 'descripcion', 'dependencia', 'marcamodeloanio', 'patrullaje', 'accion'];
  minDate: Date = new Date();
  
  @ViewChild(MatTable) tabla: MatTable<Movil> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private movilService: MovilService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog) { }

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
      CUIT: ['']
    });

    this.movilService.get().subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    );
  }
  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.items;
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

  }

  // tslint:disable-next-line:typedef
  guardar() {


  }

  // tslint:disable-next-line:typedef
  cancelar() {

  }
}

