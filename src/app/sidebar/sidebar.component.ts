import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/stat',     title: 'Statistique',         icon:'nc-bank',       class: '' },
    { path: '/cours',         title: 'cours',             icon:'nc-tile-56',    class: '' },
   
    { path: '/notifications', title: 'titre1',     icon:'nc-bell-55',    class: '' },
    { path: '/user',          title: 'titre1',      icon:'nc-single-02',  class: '' },
    { path: '/table',         title: 'titre1',        icon:'nc-diamond',    class: '' },
    { path: '/typography',    title: 'titre1',        icon:'nc-caps-small', class: '' },
    { path: '/upgrade',       title: 'titre1',    icon:'nc-spaceship',  class: 'active-pro' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
