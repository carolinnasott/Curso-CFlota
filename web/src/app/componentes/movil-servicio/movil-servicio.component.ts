import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  formularioBitacora = false;

  servicios: Servicio[] = [];
  idAux = -1;


  constructor(private movilServicioService: MovilServicioService,
              private servicioService: ServicioService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
            
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
            
  }
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
      (movil) => {
        this.movilservicios = movil;
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
    this.dataSource.data = this.movilservicios;
    this.dataSource.paginator = this.paginator;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new MovilServicio();
    this.mostrarFormulario = true;
  }

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

    if(this.seleccionado.moseId){
      this.seleccionado.moseServId = this.form.value.moseServId;
      this.movilServicioService.put(this.seleccionado).subscribe();
      this.movilservicios = this.movilservicios.filter(dato => dato.moseId != this.seleccionado.moseId);
      this.movilservicios.push(this.seleccionado);
    }else{
      this.seleccionado.moseMoviId = this.moviId;
      this.seleccionado.moseServId = this.form.value.moseServId;
      this.seleccionado.mosePeriodo = this.servicios.find( dato => dato.servId == this.seleccionado.moseServId)!.servPeriodo;
      this.seleccionado.moseKM = this.servicios.find(dato => dato.servId == this.seleccionado.moseServId)!.servKM;
      this.seleccionado.servNombre =this.servicios.find(dato => dato.servId == this.seleccionado.moseServId)!.servNombre;      
      this.movilServicioService.post(this.seleccionado).subscribe();
      this.movilservicios = this.movilservicios.filter(dato => dato.moseId != this.seleccionado.moseId);
      this.movilservicios.push(this.seleccionado);
    }

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }
  
  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }
  
  bitacora(movilserv: MovilServicio){
    this.formularioBitacora = true;
    this.seleccionado = movilserv; 
    this.movilServicioService.movilserv = movilserv;   
  }

}