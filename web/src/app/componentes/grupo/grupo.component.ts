import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import {MatGridListModule} from '@angular/material/grid-list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { Grupo } from 'src/app/modelo/grupo';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { GrupoServicioService } from 'src/app/servicios/grupo-servicio.service';
@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit, AfterViewInit {
  grupos: Grupo[] = [];
  seleccionado = new Grupo();
  form = new FormGroup({});
  mostrarFormulario = false;
  dataSource = new MatTableDataSource<Grupo>();
  columna: string[] = ['nombre', 'descripcion', 'acciones'];

  @ViewChild(MatTable) tabla: MatTable<Grupo> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private grupoService: GrupoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public grupoServicioService: GrupoServicioService) { }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      grupId: [''],
      grupNombre: ['', Validators.required],
      grupDescripcion: [''],
      grupFechaAlta: [''],
      grupBorrado: ['']
    });

    this.grupoService.get().subscribe(
      (grupos) => {
        this.grupos = grupos;
        this.actualizarTabla();
      }
    );
  }
  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.grupos;
    this.dataSource.sort = this.sort;
  }

  // tslint:disable-next-line:typedef
  actualizarGruposerv(Id: number) {
    this.grupoServicioService.gruposerv.forEach((i) => {
      i.grusGrupId = Id;
      if (i.grusBorrado) {
        this.grupoServicioService.delete(i.grusId).subscribe();
      } else
        if (i.grusId < 0) {
          this.grupoServicioService.post(i).subscribe();
          // tslint:disable-next-line:no-unused-expression
        } else (i.grusId > 0) 
      this.grupoServicioService.put(i).subscribe();
    }
    );

    this.mostrarFormulario = false;
    this.actualizarTabla();

  }


  // tslint:disable-next-line:typedef
  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // tslint:disable-next-line:typedef
  agregar() {
    this.form.reset();
    this.seleccionado = new Grupo();
    this.mostrarFormulario = true;
  }
  // tslint:disable-next-line:typedef
  delete(row: Grupo) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.grupoService.delete(row.grupId)
          .subscribe(() => {

            this.grupos = this.grupos.filter(x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  // tslint:disable-next-line:typedef
  edit(seleccionado: Grupo) {
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

    if (this.seleccionado.grupId) {
      this.grupoService.put(this.seleccionado)
        .subscribe((grupo) => {
          this.actualizarGruposerv(grupo.grupId);
        });

    } else {
      this.grupoService.post(this.seleccionado)
        .subscribe((grupo) => {
          this.grupos.push(grupo);
          this.actualizarGruposerv(grupo.grupId);
          // this.mostrarFormulario = false;
        });
    }

  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }
}
