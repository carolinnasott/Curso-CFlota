import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';
import { Movil } from 'src/app/modelo/movil';
import { MovilService } from 'src/app/servicios/movil.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AlertaOdometroComponent } from 'src/app/shared/alerta-odometro/alerta-odometro.component';

@Component({
  selector: 'app-movil-odometro',
  templateUrl: './movil-odometro.component.html',
  styleUrls: ['./movil-odometro.component.css']
})
export class MovilOdometroComponent implements OnInit {

  @Input() moviId: number= 0;

  movilodometros: MovilOdometro[] = [];
  seleccionado = new MovilOdometro();
  movil: Movil[] = []; 
  moviles= new Movil();
  

  columnas: string[] = ['modoFecha','modoOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilOdometro>();

  form = new FormGroup({});

  mostrarFormulario = false;
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private movilodometroService: MovilOdometroService,
    public movilService: MovilService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      modoId: [''],
      modoMoviId: [''],
      modoFecha: [''],
      modoOdometro: [''],
      modoFechaAlta: [''],
      modoBorrado: ['']
    });

    this.movilodometroService.get(`modoMoviId=${this.moviId}`).subscribe(
      (movilodometro) => {
        this.movilodometros = movilodometro;
        this.actualizarTabla();
      }
    );

    this.movilService.get().subscribe(
      (moviles) => {
        this.movil = moviles;
      }
    );
  }

  actualizarTabla() {
    this.dataSource.data = this.movilodometros;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.mostrarFormulario = true;
    this.form.setValue(this.seleccionado);
    this.seleccionado = new MovilOdometro();
  }

  delete(seleccionado: MovilOdometro) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);
    dialogRef.afterClosed().subscribe(
      result =>{
        console.log(`Dialog resulr: ${result}`);
        if (result) {
          this.movilodometroService.delete(seleccionado.modoId).subscribe(
            () => {
              this.movilodometros = this.movilodometros.filter( dato => dato.modoId !== seleccionado.modoId);
              this.actualizarTabla();
            });
        }
      });
  }

  edit(seleccionado: MovilOdometro) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

 guardar() {
    if (!this.form.valid) {
      return;
    }
    Object.assign(this.seleccionado, this.form.value);
    //guardo en memoria
    this.movilService.movilodomet.moviId = this.seleccionado.modoMoviId;
    this.movilService.movilodomet.moviModoOdometro = this.seleccionado.modoOdometro;
    this.movilService.movilodomet.moviModoFecha = this.seleccionado.modoFecha;
    
    const odometro = this.movilodometros.find(dato => dato.modoMoviId == this.seleccionado.modoMoviId)!.modoOdometro;
    
    //comparar el que ingresa con el existente
    if(odometro > this.seleccionado.modoOdometro){
      this.matDialog.open(AlertaOdometroComponent); //error

    }else if (this.seleccionado.modoOdometro>=1000){//comparar con valor mayor
      const dialogRef = this.matDialog.open(ConfirmarComponent);
      dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
        if (result){
          if(this.seleccionado.modoId){
            this.movilodometroService.put(this.seleccionado).subscribe(
              ()=>{
              this.mostrarFormulario = false;
              });
          }else{
            this.movilodometroService.post(this.seleccionado).subscribe(
              (movilodometro)=>{
                this.movilodometros.push(movilodometro);
                this.mostrarFormulario=false;
                this.actualizarTabla();
              });
            }
          }
        });
        }else{
          if(this.seleccionado.modoId){
            this.movilodometroService.put(this.seleccionado).subscribe(
              ()=>{
              this.mostrarFormulario = false;
              });
          }else{ this.movilodometroService.post(this.seleccionado).subscribe(
            (movilodometro)=>{
              this.movilodometros.push(movilodometro);
              this.mostrarFormulario = false;
              this.actualizarTabla();
            });
          }
        }this.actualizarTabla();
  }
  

  cancelar() {
    this.mostrarFormulario = false;
  }

}