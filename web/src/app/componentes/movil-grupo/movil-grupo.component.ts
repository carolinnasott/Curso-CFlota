import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilGrupo } from '../../modelo/movil-grupo';
import { Grupo } from '../../modelo/grupo';
import { GrupoService } from '../../servicios/grupo.service';
import { MovilService } from 'src/app/servicios/movil.service';
import { MovilGrupoService } from 'src/app/servicios/movil-grupo.service';

@Component({
  selector: 'app-movil-grupo',
  templateUrl: './movil-grupo.component.html',
  styleUrls: ['./movil-grupo.component.css']
})
export class MovilGrupoComponent implements OnInit {

  @Input() moviId= 0;
  
  movilgrupos: MovilGrupo[] = [];
  seleccionado = new MovilGrupo();

  columnas: string[] = ['grupNombre','acciones'];
  dataSource = new MatTableDataSource<MovilGrupo>();

  form = new FormGroup({});

  mostrarFormulario = false;
  grupos: Grupo[] = [];

  idAuxiliar = -1;
  constructor( private movilgrupoService: MovilGrupoService,
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
      (movilgrupos) => {
        this.movilgrupoService.movilgrup = movilgrupos;
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
    this.dataSource.data = this.movilgrupoService.movilgrup.filter(borrado => borrado.mogrBorrado==false);
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.idAuxiliar--;
    this.seleccionado = new MovilGrupo();
    this.seleccionado.mogrId = this.idAuxiliar;

    this.form.setValue(this.seleccionado);

    this.mostrarFormulario = true;
  }


  delete(row: MovilGrupo) {

  }

  edit(seleccionado: MovilGrupo) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
   
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);
    // tslint:disable-next-line:no-non-null-assertion
    this.seleccionado.grupNombre = this.grupos.find(grupo => grupo.grupId == this.seleccionado.mogrGrupId)!.grupNombre;
    if (this.seleccionado.mogrId  > 0) {
      const elemento = this.movilgrupos.find(movilgrup => movilgrup.mogrId  == this.seleccionado.mogrId );
      // tslint:disable-next-line:no-non-null-assertion
      this.movilgrupos.splice(this.seleccionado.mogrId , 1, elemento!);

    } else {
      this.movilgrupoService.movilgrup.push(this.seleccionado);
    }
    this.mostrarFormulario = false;
    this.actualizarTabla();

  }
  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }


 


}