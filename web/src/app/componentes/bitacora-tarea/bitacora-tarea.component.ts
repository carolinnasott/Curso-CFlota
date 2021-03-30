import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';
import { ServicioTarea } from 'src/app/modelo/servicio-tarea';
import { Tarea } from 'src/app/modelo/tarea';
import { BitacoraTareaService } from 'src/app/servicios/bitacora-tarea.service';
import { MovilBitacoraService } from 'src/app/servicios/movil-bitacora.service';
import { ServicioTareaService } from 'src/app/servicios/servicio-tarea.service';
import { TareaService } from 'src/app/servicios/tarea.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';

@Component({
  selector: 'app-bitacora-tarea',
  templateUrl: './bitacora-tarea.component.html',
  styleUrls: ['./bitacora-tarea.component.css']
})
export class BitacoraTareaComponent implements OnInit {

  @Input() mobiId= 0;

  seleccionado = new BitacoraTarea();

  form = new FormGroup({});
  columnas: string[] = ['tareNombre','bitaObservaciones','bitaCantidad','bitaCosto','acciones'];
  dataSource = new MatTableDataSource<BitacoraTarea>();

  FormularioBitaTarea = false;

  tareas: Tarea[] = [];
  serviciotareas: ServicioTarea[] = [];

  AuxId = -1;

  constructor(
    private bitacoraTareaService : BitacoraTareaService,
    private tareaService: TareaService,
    private servicioTareaService: ServicioTareaService,
    private movilBitacoraService : MovilBitacoraService,
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
      bitaId: [''],
      bitaMobiId: [''],
      bitaTareId: [''],
      bitaObservaciones: [''],
      bitaCantidad: [''],
      bitaCosto: [''],
      bitaFechaAlta: [''],
      bitaBorrado: [''],
      tareNombre: ['']
    });

    this.bitacoraTareaService.get(`bitaMobiId=${this.mobiId}`).subscribe(
      (bitatarea) => {
        this.bitacoraTareaService.bitatarea = bitatarea;
        this.actualizartabla();
      }
    );

    this.tareaService.get().subscribe(
      (tarea) => {
        this.tareas = tarea;
      }
    );

    //servicios de las tareas
    this.servicioTareaService.get(`setaServId=${this.movilBitacoraService.movilbitac.mobiServId}`).subscribe(
      (servtarea) => {
        this.serviciotareas = servtarea;
      }
    );
  }

  actualizartabla(){
    this.dataSource.data = this.bitacoraTareaService.bitatarea;
    this.dataSource.paginator = this.paginator;
  }

  agregar(){
    this.AuxId--;
    this.seleccionado = new BitacoraTarea();
    this.seleccionado.bitaId = this.AuxId;

    this.FormularioBitaTarea = true;
    this.form.reset(this.seleccionado);
  }

  edit(seleccionado: BitacoraTarea){
    this.FormularioBitaTarea = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }


  guardar(){
    if(!this.form.valid){
      return
    }

    Object.assign(this.seleccionado, this.form.value);
    this.seleccionado.bitaMobiId = this.mobiId;
    this.seleccionado.tareNombre = this.tareas.find(dato => dato.tareId == this.seleccionado.bitaTareId)!.tareNombre;
    this.bitacoraTareaService.bitatarea = this.bitacoraTareaService.bitatarea.filter(dato => dato.bitaId !== this.seleccionado.bitaId);
    this.bitacoraTareaService.bitatarea.push(this.seleccionado);
    
    this.FormularioBitaTarea = false;
    this.actualizartabla();
  }

  delete(seleccionado: BitacoraTarea){
    const dialog = this.matDialog.open(ConfirmarComponent);
    dialog.afterClosed().subscribe(
      (result) => {
        if(result) {
          seleccionado.bitaBorrado = 1;
          this.actualizartabla();
        }
      });
  }

  cancelar(){
    this.FormularioBitaTarea = false;
  }
}