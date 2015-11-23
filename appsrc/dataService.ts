import {Framework} from './frameworks/framework';

export class DataService {
    private items: Framework[];

    constructor() {
        this.items = [
            new Framework('AngularJS'),
            new Framework('Angular 2'),
            new Framework('React'),
            new Framework('Knockout')
        ];
    }

    getItems() {
        return this.items;
    }
}