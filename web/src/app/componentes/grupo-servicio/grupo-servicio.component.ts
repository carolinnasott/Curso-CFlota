import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GrupoServicio } from 'src/app/modelo/grupo-servicio';
import { Servicio } from 'src/app/modelo/servicio';
import { GrupoServicioService } from 'src/app/servicios/grupo-servicio.service';
import { ServicioService } from 'src/app/servicios/servicio.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { GlobalService } from 'src/app/servicios/global.service';



@Component({
  selector: 'app-grupo-servicio',
  templateUrl: './grupo-servicio.component.html',
  styleUrls: ['./grupo-servicio.component.css']
})
export class GrupoServicioComponent implements OnInit {

  @Input() grupId = 0;


  gruposervicios: GrupoServicio[] = [];
  seleccionado = new GrupoServicio();

  columnas: string[] = ['grusId', 'servNombre', 'grusPeriodo', 'grusKM', 'grusFecha', 'acciones'];
  dataSource = new MatTableDataSource<GrupoServicio>();


  form = new FormGroup({});
  mostrarFormulario = false;

  servicios: Servicio[] = [];
  idAux = -1;


  constructor(private grupoServicioService: GrupoServicioService,
              private servicioService: ServicioService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              public globalService: GlobalService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      grusId: [''],
      grusGrupId: [''],
      grusServId: ['', Validators.required],
      grusPeriodo: [''],
      grusKM: [''],
      grusFecha: [''],
      grusBorrado: [''],
      grusFechaAlta: [''],
      servNombre: [''],
    });

    this.grupoServicioService.get(`grusGrupId=${this.grupId}`).subscribe(
      (grupoServicio) => {
        this.globalService.gruser = grupoServicio;
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
    this.dataSource.data = this.globalService.gruser.filter(borrado => borrado.grusBorrado === false);
  }

  // tslint:disable-next-line:typedef
  agregar() {
    this.idAux--;
    this.seleccionado = new GrupoServicio();
    this.seleccionado.grusId = this.idAux;

    this.form.setValue(this.seleccionado);

    this.mostrarFormulario = true;
  }

  // tslint:disable-next-line:typedef
  delete(fila: GrupoServicio) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result){
        fila.grusBorrado = true;
        this.actualizarTabla();
      }

    });
  }

  // tslint:disable-next-line:typedef
  editar(seleccionado: GrupoServicio) {
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
    this.seleccionado.servNombre = this.servicios.find(serv => serv.servId === this.seleccionado.grusServId)!.servNombre;
    this.globalService.gruser = this.globalService.gruser.filter(x => x.grusId !== this.seleccionado.grusId);
    this.globalService.gruser.push(this.seleccionado);

    if (this.seleccionado.grusId > 0){
      const elemento = this.gruposervicios.find(gruser => gruser.grusId === this.seleccionado.grusId);
      // tslint:disable-next-line:no-non-null-assertion
      this.gruposervicios.splice(this.seleccionado.grusId, 1, elemento!);
    }else{
      this.globalService.gruser.push(this.seleccionado);
    }

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }


}