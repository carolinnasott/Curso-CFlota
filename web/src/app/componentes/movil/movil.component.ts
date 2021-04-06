import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
import { MovilServicioService } from 'src/app/servicios/movil-servicio.service';
import { MovilServicio } from 'src/app/modelo/movil-servicio';
@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {
  moviles: Movil[] = [];
  seleccionado = new Movil();
  form = new FormGroup({});

  mostrarFormulario = false;
  formularioEditar = false;

  dataSource = new MatTableDataSource<Movil>();

  columna: string[] = ['patente', 'descripcion', 'dependencia', 'marcamodeloanio', 'patrullaje', 'accion'];

  mostrarFormularioGrupo = false;
  grupos: MovilGrupo[] = [];
  servicios: MovilServicio[] = [];

  patente: string = "";
  descripcion: string = "";
  dependencia: string = "";

  @ViewChild(MatTable) tabla: MatTable<Movil> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private movilService: MovilService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private movilgrupoService: MovilGrupoService,
    private movilservicioService: MovilServicioService) { }

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

  }

  actualizarTabla() {
    this.dataSource.data = this.moviles;
    this.dataSource.sort = this.sort;
  }

  accion(seleccionado: Movil) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.movilService.movil= seleccionado;
    this.movilgrupoService.get(`mogrMoviId=${this.seleccionado.moviId}`).subscribe(
      (grupos) => {
        this.grupos = grupos;
        this.actualizarTabla();
      }
    );

  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  delete(seleccionado: Movil) {
    const dialogRef = this.dialog.open(ConfirmarComponent);
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(`Dialog result: ${result}`);

        if (result) {
          this.seleccionado = seleccionado;
          this.movilService.delete(this.seleccionado.moviId).subscribe();
          this.moviles = this.moviles.filter(dato => dato.moviId != this.seleccionado.moviId);
          this.actualizarTabla();
        } else {
          this.cancelar();
        }
      });
  }

  edit(seleccionado: Movil) {
    this.formularioEditar = true;
    this.seleccionado = seleccionado;
  }

  // tslint:disable-next-line:typedef
  estado(moviId: number, borrado: boolean) {
    if (moviId !== null && borrado == false) { return 'Movil Registrado en Control de Flota'; }
    else if (moviId !== null && borrado == true) { return 'Movil Borrado'; }
    else if (borrado == null) { return 'Movil No Registrado'; }
    return ''
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if (this.seleccionado.moviId) {
      this.movilService.put(this.seleccionado)
        .subscribe((movil) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.movilService.post(this.seleccionado)
        .subscribe((movil) => {
          this.moviles.push(movil);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });

    }

  }

  cancelar() {
    this.mostrarFormulario = false;
    this.formularioEditar = false;
  }
  buscar() {
    if (this.patente && !this.dependencia && !this.descripcion) {
      //patente
      this.movilService.get(`patente=${this.patente}`).subscribe(
        (movil) => {
          this.moviles = movil;
          this.actualizarTabla();
        }
      )
    } else if (!this.patente && !this.dependencia && this.descripcion) {
      //descripcion
      this.movilService.get(`descripcion=${this.descripcion}`).subscribe(
        (movil) => {
          this.moviles = movil;
          this.actualizarTabla();
        }
      )
    } else {
      //depentencia
      this.movilService.get(`dependencia=${this.dependencia}`).subscribe(
        (movil) => {
          this.moviles = movil;
          this.actualizarTabla();
        }
      )
    }
    if (this.patente && this.descripcion) {
      this.movilService.get(`patente=${this.patente}&descripcion=${this.descripcion}`).subscribe(
        (movil) => {
          this.moviles = movil;
          this.actualizarTabla();
        }
      )
    } else if (this.patente && this.dependencia) {
      this.movilService.get(`patente=${this.patente}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
          this.moviles = movil;
          this.actualizarTabla();
        }
      )
    } else if (this.dependencia && this.descripcion) {
      this.movilService.get(`descripcion=${this.descripcion}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
          this.moviles = movil;
          this.actualizarTabla();
        }
      )
    } else if (this.patente && this.descripcion && this.dependencia) {
      this.movilService.get(`patente=${this.patente}&descripcion=${this.descripcion}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
          this.moviles = movil;
          this.actualizarTabla();
        }
      )
    }
  }
}

