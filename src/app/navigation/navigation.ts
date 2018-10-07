import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'เมนู',
        type     : 'group',
        icon     : 'apps',
        children: [
            {
                id: 'sme',
                title: 'รายการ',
                type: 'item',
                icon: 'dashboard',
                url: '/apps/sme/lists'
            }
        ]
    }
];
