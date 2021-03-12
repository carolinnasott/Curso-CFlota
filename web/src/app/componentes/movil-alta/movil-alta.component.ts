import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Grupo } from 'src/app/modelo/grupo';
import { Movil } from 'src/app/modelo/movil';
import { GrupoService } from 'src/app/servicios/grupo.service';
import { MovilGrupoService } from 'src/app/servicios/movil-grupo.service';
import { MovilService } from 'src/app/servicios/movil.service';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';



@Component({
  selector: 'app-movil-alta',
  templateUrl: './movil-alta.component.html',
  styleUrls: ['./movil-alta.component.css']
})
export class MovilAltaComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  grupos: Grupo[] = []; 
  moviles: Movil [] = [];
  movil = new Movil();

  dataSource = new MatTableDataSource<Movil>();
  columna: string[] = ['patente', 'descripcion','dependencia','estado','accion'];
  movilseleccionado = new Movil();
  formularioAlta = false;
  formulario = new FormGroup({});
  @Input() mogrMoviId= 0;

  constructor(private movilServ: MovilService,
                private grupoServ: GrupoService,
                private movilgServ: MovilGrupoService,
                private formBouilder: FormBuilder,
                private matDialog: MatDialog ){}
  

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.formulario = this.formBouilder.group({
      moviId: [''],
      moviModoFecha: ['', Validators.required],
      moviModoOdometro: ['', Validators.required],
      moviBorrado: [''],
      moviFechaAlta: ['']
    });

    this.movilServ.get().subscribe(
      (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
    );
    this.grupoServ.get().subscribe(
      (grupo) => {
      this.grupos = grupo;
      }
    );

  }
  // tslint:disable-next-line:typedef
  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
// tslint:disable-next-line:typedef
agregar(movilseleccionado: Movil) {
  this.formulario.reset();
  this.movilseleccionado = movilseleccionado;
  this.movil.moviId = movilseleccionado.movilID;
  this.movilServ.post(this.movilseleccionado).subscribe();

  this.formularioAlta = true;
  
}

  accion(movilseleccionado: Movil) {
    this.formularioAlta = true;
    this.movilseleccionado = movilseleccionado;
  }
  
// tslint:disable-next-line:typedef
actualizarTabla() {
    this.dataSource.data = this.moviles;
    this.dataSource.sort = this.sort;
  }

// tslint:disable-next-line:typedef
estado(moviId: number, borrado: number){
  if (moviId !== null && borrado == 0 ) {return 'Movil Borrado'; }
  else if (moviId !== null && borrado == 1){return 'Movil Registrado'; } 
  else if (moviId == null){return 'Movil No Registrado'; }
  }
  cancelar() {
    this.formularioAlta = false;
  }

}
