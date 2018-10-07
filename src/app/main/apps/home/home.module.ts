import { FuseMaterialColorPickerModule } from '@fuse/components/material-color-picker/material-color-picker.module';
import { FuseConfirmDialogModule } from './../../../../@fuse/components/confirm-dialog/confirm-dialog.module';
import { DeleteDialogComponent } from './lists/dialogs/delete/delete.dialog.component';
import { EditDialogComponent } from './lists/dialogs/edit/edit.dialog.component';
import { AddDialogComponent } from './lists/dialogs/add/add.dialog.component';
import { MaterialModule } from '../../../material.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ListComponent } from './list/list.component';
import { ListsComponent } from './lists/lists.component';
import { ListsService } from './lists/lists.service';
import { ListService } from './list/list.service';
import { AddListOfDateComponent } from './list/add-list/add-list.component';
import { ListOfDateComponent } from './list/list/list-of-date.component';
import { EditListOfDateComponent } from './list/list/edit-list-name/edit-list-name.component';

const routes: Routes = [
    {
        path: 'lists',
        component: ListsComponent,
        resolve: {
            data: ListsService
        }
    },
    {
        path: 'lists/:id',
        component: ListComponent,
        resolve: {
            data: ListService
        }
    },
    {
        path: '',
        redirectTo: 'lists',
        pathMatch: 'full'
    },
];

@NgModule({
    declarations: [
        ListComponent,
        AddListOfDateComponent,
        ListOfDateComponent,
        EditListOfDateComponent,

        ListsComponent,
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent,

    ],
    imports: [
        RouterModule.forChild(routes),

        MaterialModule,

        NgxDnDModule,
        NgxDatatableModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseMaterialColorPickerModule
    ],
    providers: [
        ListsService,
        ListService
    ],
    entryComponents: [
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent
    ],
})

export class HomeModule {
}
