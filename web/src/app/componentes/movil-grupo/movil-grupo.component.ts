import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilGrupo } from '../../modelo/movil-grupo';
import { MovilGrupoService } from '../../servicios/movil-grupo.service';
import { Grupo } from '../../modelo/grupo';
import { GrupoService } from '../../servicios/grupo.service';

@Component({
  selector: 'app-movil-grupo',
  templateUrl: './movil-grupo.component.html',
  styleUrls: ['./movil-grupo.component.css']
})
export class MovilGrupoComponent implements OnInit {

  @Input() moviId= 0;

  movilgrupos: MovilGrupo[] = []
  seleccionado = new MovilGrupo();

  columnas: string[] = ['grupNombre','acciones'];
  dataSource = new MatTableDataSource<MovilGrupo>();

  form = new FormGroup({});

  mostrarFormulario = false;
  grupos: Grupo[] = [];

  constructor(
    private movilgrupoService: MovilGrupoService,
    private grupoService: GrupoService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: [''],
      grupNombre: ['']

    });

    this.movilgrupoService.get(`mogrMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.movilgrupos = movil;
        this.actualizarTabla();
      }
    );

    this.grupoService.get().subscribe(
      (grupo) => {
        this.grupos = grupo;
      }
    );
  }

  actualizarTabla() {
    this.dataSource.data = this.movilgrupos;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    
  }

  delete(row: MovilGrupo) {

  }

  edit(seleccionado: MovilGrupo) {
   
  }

  guardar() {

  }

  cancelar() {
    this.mostrarFormulario = false;
  }

 


}