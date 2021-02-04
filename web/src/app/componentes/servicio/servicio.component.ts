import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { Servicio } from 'src/app/modelo/servicio';
import { ServicioService } from 'src/app/servicios/servicio.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit, AfterViewInit {
  
  servicios: Servicio[] = [];
  seleccionado = new Servicio();
  form = new FormGroup({});
  mostrarFormulario = false;
  dataSource = new MatTableDataSource<Servicio>();
  columna: string[] = ['id', 'nombre', 'descripcion', 'periodo', 'km', 'fecha', 'acciones'];
  date: Date = new Date();

  @ViewChild(MatTable) tabla: MatTable<Servicio> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      servId: [''],
      servNombre: ['', Validators.required],
      servDescripcion: ['', Validators.required],
      servPeriodo: ['', Validators.required],
      servKM: ['', Validators.required],
      servFecha: ['', Validators.required],
      servFechaAlta: [''],
      servBorrado: ['']
    });

    this.servicioService.get().subscribe(
      (servicios) => {
        this.servicios = servicios;
        this.actualizarTabla();
      }
    );
  }
  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.servicios;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  agregar() {
    this.form.reset();
    this.seleccionado = new Servicio();
    this.mostrarFormulario = true;
  }
  // tslint:disable-next-line:typedef
  delete(row: Servicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.servicioService.delete(row.servId)
          .subscribe((servicio) => {

            this.servicios = this.servicios.filter( x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  // tslint:disable-next-line:typedef
  edit(seleccionado: Servicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  // tslint:disable-next-line:typedef
  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if (this.seleccionado.servId) {
      this.servicioService.put(this.seleccionado)
        .subscribe(() => {
        });

    } else {
      this.servicioService.post(this.seleccionado)
        .subscribe((servicio: Servicio) => {
          this.servicios.push(servicio);
          //this.mostrarFormulario = false;
          this.actualizarTabla();
        });
    }

  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }

}
