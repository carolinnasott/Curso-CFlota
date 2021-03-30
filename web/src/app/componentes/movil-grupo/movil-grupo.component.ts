import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilGrupo } from '../../modelo/movil-grupo';
import { Grupo } from '../../modelo/grupo';
import { GrupoService } from '../../servicios/grupo.service';
import { MovilService } from 'src/app/servicios/movil.service';
import { MovilGrupoService } from 'src/app/servicios/movil-grupo.service';
import { MovilServicio } from 'src/app/modelo/movil-servicio';
import { GrupoServicio } from 'src/app/modelo/grupo-servicio';
import { GrupoServicioService } from 'src/app/servicios/grupo-servicio.service';
import { MovilServicioService } from 'src/app/servicios/movil-servicio.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-movil-grupo',
  templateUrl: './movil-grupo.component.html',
  styleUrls: ['./movil-grupo.component.css']
})

export class MovilGrupoComponent implements OnInit {

  @Input() moviId= 0;
  
  movilgrupos: MovilGrupo[] = [];
  seleccionado = new MovilGrupo();
  grupos: Grupo[] = [];
  serv: number[]=[];
  movilservicios= new MovilServicio();
  gruposervicios: GrupoServicio[] = [];

  columnas: string[] = ['grupNombre','grupDescripcion','acciones'];
  dataSource = new MatTableDataSource<MovilGrupo>();

  form = new FormGroup({});

  mostrarFormulario = false;


  constructor( private movilservService: MovilServicioService,
               private movilgrupoService: MovilGrupoService,
               private grupoService: GrupoService,
               private gruposervicioService: GrupoServicioService,
               private formBouilder: FormBuilder,
               public dialog: MatDialog
  ) { }
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.form = this.formBouilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: [''],
      grupNombre: [''],
      grupDescripcion: ['']
    });

    this.movilgrupoService.get(`mogrMoviId=${this.moviId}`).subscribe(
      (movilgrupos) => {
        this.movilgrupos = movilgrupos;
        this.actualizarTabla();
      }
    );

    this.grupoService.get().subscribe(
      (grupo) => {
        this.grupos = grupo;
      }
    );
  
    this.grupoService.get().subscribe(
      (grupos) => {
        this.grupos = grupos;
      }
    );
    this.gruposervicioService.get().subscribe(
      (grupos) => {
        this.gruposervicios = grupos;
      }
    )
  }
  
  actualizarTabla() {
    this.dataSource.data = this.movilgrupos;
    this.dataSource.paginator = this.paginator;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new MovilGrupo();
    this.mostrarFormulario = true;
  }


  delete(seleccionado: MovilGrupo) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.movilgrupoService.delete(seleccionado.mogrId).subscribe(
          () => {
            this.movilgrupos = this.movilgrupos.filter(dato => dato.mogrId !== seleccionado.mogrId);
            this.actualizarTabla();
          });
      }
    });
}

  edit(seleccionado: MovilGrupo) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }
    if (this.seleccionado.mogrId) {
      this.seleccionado.mogrGrupId = this.form.value.mogrGrupId;
      this.movilgrupoService.put(this.seleccionado).subscribe();
      this.movilgrupos = this.movilgrupos.filter(dato => dato.mogrId != this.seleccionado.mogrId);
      this.movilgrupos.push(this.seleccionado);
    } else {
      this.seleccionado.mogrMoviId = this.moviId;
      this.seleccionado.mogrGrupId = this.form.value.mogrGrupId;
      this.gruposervicios = this.gruposervicios.filter(dato => dato.grusGrupId == this.seleccionado.mogrGrupId);
      //setear servicios
      this.gruposervicios.forEach((x) => {
        this.movilservicios.moseMoviId = this.moviId;
        this.movilservicios.moseServId = x.grusServId;
        this.movilservicios.mosePeriodo = x.grusPeriodo;
        this.movilservicios.moseKM = x.grusKM;
        this.movilservicios.moseFecha = x.grusFecha;
        this.movilservService.post(this.movilservicios).subscribe();
      });
    
      this.movilgrupoService.post(this.seleccionado).subscribe();
      this.movilgrupos = this.movilgrupos.filter(dato => dato.mogrId != this.seleccionado.mogrId);
      this.seleccionado.grupNombre = this.grupos.find(dato => dato.grupId = this.seleccionado.mogrGrupId)!.grupNombre;
      this.seleccionado.grupDescripcion = this.grupos.find(dato => dato.grupId = this.seleccionado.mogrGrupId)!.grupDescripcion;

      this.movilgrupos.push(this.seleccionado);
      this.form.reset();
    }
    this.mostrarFormulario = false;
    this.actualizarTabla();

  }

  cancelar() {
    this.mostrarFormulario = false;
  }
}
