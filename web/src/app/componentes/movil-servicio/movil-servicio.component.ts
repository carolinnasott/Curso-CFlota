import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MovilServicio } from 'src/app/modelo/movil-servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { MovilServicioService } from 'src/app/servicios/movil-servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';



@Component({
  selector: 'app-movil-servicio',
  templateUrl: './movil-servicio.component.html',
  styleUrls: ['./movil-servicio.component.css']
})
export class MovilServicioComponent implements OnInit {

  @Input() moviId = 0;


  movilservicios: MovilServicio[] = [];
  seleccionado = new MovilServicio();

  columnas: string[] = ['servNombre', 'mosePeriodo', 'moseKM', 'acciones'];
  dataSource = new MatTableDataSource<MovilServicio>();


  form = new FormGroup({});
  mostrarFormulario = false;

  servicios: Servicio[] = [];
  idAux = -1;


  constructor(private movilServicioService: MovilServicioService,
              private servicioService: ServicioService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      moseId: [''],
      moseMoviId: [''],
      moseServId: [''],
      mosePeriodo: [''],
      moseKM: [''],
      moseFecha: [''],
      moseFechaAlta: [''],
      moseBorrado: [''],
      servNombre: ['']
    });

    this.movilServicioService.get(`moseMoviId=${this.moviId}`).subscribe(
      (movilServicio) => {
        this.movilServicioService.movilserv = movilServicio;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (servicios) => {
        this.servicios = servicios;
      }
    )
  }

  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.movilServicioService.movilserv.filter(borrado => borrado.moseBorrado == false);
  }

  // tslint:disable-next-line:typedef
  agregar() {
    this.idAux--;
    this.seleccionado = new MovilServicio();
    this.seleccionado.moseId = this.idAux;

    this.form.setValue(this.seleccionado);

    this.mostrarFormulario = true;
  }

  // tslint:disable-next-line:typedef
  delete(fila: MovilServicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        fila.moseBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  // tslint:disable-next-line:typedef
  editar(seleccionado: MovilServicio) {
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
    this.seleccionado.servNombre = this.servicios.find(servicio => servicio.servId == this.seleccionado.moseServId)!.servNombre;
    if (this.seleccionado.moseId  > 0) {
      const elemento = this.movilservicios.find(movilserv => movilserv.moseId  == this.seleccionado.moseId );
      // tslint:disable-next-line:no-non-null-assertion
      this.movilservicios.splice(this.seleccionado.moseId , 1, elemento!);

    } else {
      this.movilServicioService.movilserv.push(this.seleccionado);
    }
    this.mostrarFormulario = false;
    this.actualizarTabla();

  }
  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }


}