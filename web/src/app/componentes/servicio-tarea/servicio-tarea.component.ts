import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder  } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';


import { ServicioTarea } from 'src/app/modelo/servicio-tarea';
import { ServicioTareaService } from 'src/app/servicios/servicio-tarea.service';
import { Tarea } from 'src/app/modelo/tarea';
import { TareaService } from 'src/app/servicios/tarea.service';
import { Servicio } from 'src/app/modelo/servicio';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { GlobalService } from 'src/app/servicios/global.service';

@Component({
  selector: 'app-servicio-tarea',
  templateUrl: './servicio-tarea.component.html',
  styleUrls: ['./servicio-tarea.component.css']
})


export class ServicioTareaComponent implements OnInit{
  serviciotareas: ServicioTarea[] = [];
  tareas: Tarea[] = [];
  servicios: Servicio[] = [];
  seleccionado = new ServicioTarea();
  form = new FormGroup({});
  setaIdNuevos = -1;

  mostrarFormulario = false;
  dataSource = new MatTableDataSource<ServicioTarea>();
  columna: string[] = ['nombretarea', 'idservicio', 'idtarea', 'acciones'];

  @ViewChild(MatTable) tabla: MatTable<ServicioTarea> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() servId = 0;

  constructor(private serviciotareaService: ServicioTareaService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private tareaService: TareaService,
              private globalService: GlobalService) { }

  // tslint:disable-next-line:typedef
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      setaId: [''],
      setaServId: [''],
      setaTareId: [''],
      setaFechaAlta: [''],
      setaBorrado: [''],
      tareNombre: ['']
    });

    this.serviciotareaService.get(`setaServId=${this.servId}`).subscribe(
      (servicioTarea) => {
        this.globalService.sertar = servicioTarea;
        this.actualizarTabla();
      }
    );
    this.tareaService.get().subscribe(
      (productos) => {
        this.tareas = productos;
      }
    )
  }
  
  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.globalService.sertar.filter(borrado => borrado.setaBorrado === false);
  }

  // tslint:disable-next-line:typedef
  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // tslint:disable-next-line:typedef
  agregar() {
    this.setaIdNuevos--;
    this.seleccionado = new ServicioTarea();
    this.seleccionado.setaId = this.setaIdNuevos;
    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }
  // tslint:disable-next-line:typedef
  delete(row: ServicioTarea) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.serviciotareaService.delete(row.setaId)
          .subscribe((serviciotarea) => {

            this.serviciotareas = this.serviciotareas.filter( x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  // tslint:disable-next-line:typedef
  edit(seleccionado: ServicioTarea) {
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
    // tslint:disable-next-line:no-non-null-assertion
    this.seleccionado.tareNombre = this.tareas.find(tarea => tarea.tareId === this.seleccionado.setaTareId)!.tareNombre;
    if (this.seleccionado.setaId > 0) {
      const elemento = this.serviciotareas.find(sertar => sertar.setaId === this.seleccionado.setaId);
      // tslint:disable-next-line:no-non-null-assertion
      this.serviciotareas.splice(this.seleccionado.setaId, 1, elemento!);

    } else {
      this.globalService.sertar.push(this.seleccionado);
    }
    this.mostrarFormulario = false;
    this.actualizarTabla();

  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }

}
