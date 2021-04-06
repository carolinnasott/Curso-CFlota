import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Grupo } from 'src/app/modelo/grupo';
import { Movil } from 'src/app/modelo/movil';
import { MovilGrupo } from 'src/app/modelo/movil-grupo';
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
  columna: string[] = ['patente', 'descripcion','dependencia','estado','acciones'];
  movilseleccionado = new Movil();
  gruposeleccionado = new MovilGrupo();
  formularioAlta = false;
  formularioGrupo = false;
  formulario = new FormGroup({});
  formularioG = new FormGroup({});
  patente : string = "";
  descripcion : string = "";
  dependencia : string = "";
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
    this.formularioG = this.formBouilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: ['']
    })

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
  const dialogRef = this.matDialog.open(ConfirmarComponent);
  dialogRef.afterClosed().subscribe(
    result => {console.log(`Dialog result: ${result}`);

               if (result) {

      this.formularioAlta = true;
      this.movilseleccionado = movilseleccionado;
      this.movilseleccionado.moviId = this.movilseleccionado.movilID;
      this.movilServ.post(this.movilseleccionado).subscribe();
      this.formularioG.reset();
      this.gruposeleccionado = new MovilGrupo();

    }else{
      this.cancelar();
    }
  });
  
}
// tslint:disable-next-line:typedef
guardarG() {

  this.gruposeleccionado.mogrGrupId = this.formularioG.value.mogrGrupId;
  this.gruposeleccionado.mogrMoviId = this.movilseleccionado.moviId;
  this.movilgServ.post(this.gruposeleccionado).subscribe();
}

reactivar(movilseleccionado: Movil) {
  this.formulario.reset();
  this.movilseleccionado = movilseleccionado;
  this.movil.moviId = movilseleccionado.movilID;
  this.movilServ.post(this.movilseleccionado).subscribe();

  this.formularioAlta = true;

}

  accion(movilseleccionado: Movil, estado:string) {
    this.formularioAlta = true;
    this.movilseleccionado = movilseleccionado;
    if (estado == 'Movil No Registrado') {
      this.formularioGrupo = true;
    }
  }
  
// tslint:disable-next-line:typedef
actualizarTabla() {
    this.dataSource.data = this.moviles;
    this.dataSource.sort = this.sort;
  }

// tslint:disable-next-line:typedef
estado (moviId: number, borrado: boolean) {
  if (moviId !== null && borrado == false ) {return 'Movil Registrado' ; }
  else if (moviId !== null && borrado == true){return 'Movil Borrado'; } 
  else if (borrado == null){return 'Movil No Registrado'; }
  return''
}

  cancelar() {
    this.formularioAlta = false;
  }
  buscar(){
    if(this.patente && !this.dependencia && !this.descripcion){
      //patente
      this.movilServ.get(`patente=${this.patente}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
      )
    }else if(!this.patente && !this.dependencia && this.descripcion){
      //descripcion
      this.movilServ.get(`descripcion=${this.descripcion}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
      )
    }else{
      //depentencia
      this.movilServ.get(`dependencia=${this.dependencia}`).subscribe(
      (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
      )
    }
    if(this.patente && this.descripcion){
      this.movilServ.get(`patente=${this.patente}&descripcion=${this.descripcion}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
      )
    }else if(this.patente && this.dependencia){
      this.movilServ.get(`patente=${this.patente}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
      )
    }else if(this.dependencia && this.descripcion){
      this.movilServ.get(`descripcion=${this.descripcion}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
      )
    }else if(this.patente && this.descripcion && this.dependencia){
      this.movilServ.get(`patente=${this.patente}&descripcion=${this.descripcion}&dependencia=${this.dependencia}`).subscribe(
        (movil) => {
        this.moviles = movil;
        this.actualizarTabla();
      }
      )
    }
  }
}
