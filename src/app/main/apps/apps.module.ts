import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../services/auth.guard';

const routes: Routes = [
    {
        path: 'apps',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'sme',
                loadChildren: './home/home.module#HomeModule'
            },
            {
                path: '',
                redirectTo: 'sme/lists',
                pathMatch: 'full'
            },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
    ],
    declarations: []
})
export class AppsModule {
}
