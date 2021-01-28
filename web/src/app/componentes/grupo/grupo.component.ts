import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
  columna: string[] = ['id', 'nombre', 'descripcion', 'fecha'];

  @ViewChild(MatTable) tabla: MatTable<Grupo> | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor( private grupoService: GrupoService, private formBuilder: FormBuilder) { }

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

}
