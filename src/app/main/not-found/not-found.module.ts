import { FuseSharedModule } from './../../../@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes = [
  {
    path: '404',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    FuseSharedModule

  ],
  declarations: [NotFoundComponent]
})
export class NotFoundModule { }
