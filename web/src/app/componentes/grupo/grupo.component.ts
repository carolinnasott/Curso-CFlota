import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/confirmar/confirmar.component';
import { Grupo } from 'src/app/modelo/grupo';
import { GrupoService } from 'src/app/servicios/grupo.service';

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
  columna: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  date: Date = new Date();

  @ViewChild(MatTable) tabla: MatTable<Grupo> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(private grupoService: GrupoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      grupId: [''],
      grupNombre: ['', Validators.required],
      grupDescripcion: ['', Validators.required],
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

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
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

            this.grupos = this.grupos.filter( x => x !== row);

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
        });

    } else {
      this.grupoService.post(this.seleccionado)
        .subscribe((grupo: Grupo) => {
          this.grupos.push(grupo);
          //this.mostrarFormulario = false;
          this.actualizarTabla();
        });
    }

  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }

}
