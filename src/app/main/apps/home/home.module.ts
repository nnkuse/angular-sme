import { FuseMaterialColorPickerModule } from '@fuse/components/material-color-picker/material-color-picker.module';
import { FuseConfirmDialogModule } from './../../../../@fuse/components/confirm-dialog/confirm-dialog.module';
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
import { ListOfDateComponent } from './list/list-of-date/list-of-date.component';
import { EditListOfDateComponent } from './list/list-of-date/edit-list-name/edit-list-name.component';
import { AddListOfDateComponent } from './list/add-list-of-date/add-list.component';
import { EditDialogComponent } from './list/edit-list/edit.dialog.component';
import { ListDetailService } from './list/list-detail/list-detail.service';
import { ListDetailComponent } from './list/list-detail/compact/compact.component';
import { AddDetailDialogComponent } from './list/list-detail/dialogs/add/add.dialog.component';

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
        path: 'lists/:list_item_id/:in_date/:id',
        component: ListDetailComponent,
        resolve: {
            data: ListDetailService
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

        ListDetailComponent,
        AddDetailDialogComponent

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
        ListService,
        ListDetailService
    ],
    entryComponents: [
        AddDialogComponent,
        EditDialogComponent,

        // detail add
        AddDetailDialogComponent
    ],
})

export class HomeModule {
}
