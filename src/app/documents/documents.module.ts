import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentsRoutingModule } from './documents-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DocumentsRoutingModule
  ]
})
export class DocumentsModule { }
