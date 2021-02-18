import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { GlobalService } from 'src/app/servicios/global.service';
import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit, AfterViewInit {
  items: Movil [] = [];
  seleccionado = new Movil();
  form = new FormGroup({});
  mostrarFormulario = false;
  dataSource = new MatTableDataSource<Movil>();
  columna: string[] = ['id', 'fecha', 'odometro', 'acciones'];

  @ViewChild(MatTable) tabla: MatTable<Movil> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private movilService: MovilService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              public globalService: GlobalService) { }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      moviId: [''],
      moviModoFecha: ['', Validators.required],
      moviModoOdometro: [''],
      moviFechaAlta: [''],
      moviBorrado: ['']
    });

    this.movilService.get().subscribe(
      (items) => {
        this.items = items;
        this.actualizarTabla();
      }
    );
  }
  // tslint:disable-next-line:typedef
  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // tslint:disable-next-line:typedef
  agregar() {
    this.form.reset();
    this.seleccionado = new Movil();
    this.mostrarFormulario = true;
  }
  // tslint:disable-next-line:typedef
  delete(row: Movil) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.movilService.delete(row.moviId)
          .subscribe(() => {

            this.items = this.items.filter( x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  // tslint:disable-next-line:typedef
  edit(seleccionado: Movil) {
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

    if (this.seleccionado.moviId) {
      this.movilService.put(this.seleccionado)
        .subscribe(() => {
        });

    } else {
      this.movilService.post(this.seleccionado)
        .subscribe((movil: Movil) => {
          this.items.push(movil);
          // this.mostrarFormulario = false;
          this.actualizarTabla();
        });
    }

  }

  // tslint:disable-next-line:typedef
  cancelar() {
    this.mostrarFormulario = false;
  }
}

