import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { Tarea } from 'src/app/modelo/tarea';
import { TareaService } from 'src/app/servicios/tarea.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css']
})
export class TareaComponent implements OnInit, AfterViewInit {
  tareas: Tarea[] = [];
  seleccionado = new Tarea();
  firstFormGroup = new FormGroup({});
  secondFormGroup = new FormGroup({});
  mostrarFormulario = false;
  dataSource = new MatTableDataSource<Tarea>();
  columna: string[] = ['id', 'nombre', 'descripcion', 'unidad', 'cantidad', 'costo', 'acciones'];
  date: Date = new Date();

  @ViewChild(MatTable) tabla: MatTable<Tarea> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // tslint:disable-next-line:no-trailing-whitespace
  
  constructor(private tareaService: TareaService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog) { }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.firstFormGroup = this.formBuilder.group({
      tareId: [''],
      tareNombre: ['', Validators.required],
      tareDescripcion: ['', Validators.required],
      tareUnidadMedida: ['', Validators.required]});
    this.secondFormGroup = this.formBuilder.group({
      tareCantidad: ['', Validators.required],
      tareCosto: ['', Validators.required],
      tareFechaAlta: [''],
      tareBorrado: ['']
    });

    this.tareaService.get().subscribe(
      (tareas) => {
        this.tareas = tareas;
        this.actualizarTabla();
      }
    );
  }
  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.tareas;
    this.dataSource.sort = this.sort;
  }

  // tslint:disable-next-line:typedef
  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // tslint:disable-next-line:typedef
  agregar() {
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.seleccionado = new Tarea();
    this.mostrarFormulario = true;
  }
  // tslint:disable-next-line:typedef
  delete(row: Tarea) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.tareaService.delete(row.tareId)
          .subscribe((tarea) => {

            this.tareas = this.tareas.filter( x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  // tslint:disable-next-line:typedef
  edit(seleccionado: Tarea) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.firstFormGroup.setValue(seleccionado);
    this.secondFormGroup.setValue(seleccionado);
  }

  // tslint:disable-next-line:typedef
  guardar() {
    if (!this.firstFormGroup.valid && !this.secondFormGroup.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.firstFormGroup.value, this.secondFormGroup.value);

    if (this.seleccionado.tareId) {
      this.tareaService.put(this.seleccionado)
        .subscribe(() => {
        });

    } else {
      this.tareaService.post(this.seleccionado)
        .subscribe((tarea: Tarea) => {
          this.tareas.push(tarea);
          // this.mostrarFormulario = false;
          this.actualizarTabla();
        });
    }

  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }

}
