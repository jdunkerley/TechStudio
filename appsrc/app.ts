import {bootstrap, Component, CORE_DIRECTIVES} from 'angular2/angular2';
import {Framework} from './frameworks/framework';

@Component({
    selector: 'hello-app',
    templateUrl: './frameworks/frameworks.html',
    directives: [CORE_DIRECTIVES]
})

export class HelloApp {
    public title: string;
    public frameworks: Framework[];

    constructor() {
        this.title = 'Frameworks Guide';
        this.frameworks = [
            new Framework('AngularJS'),
            new Framework('Angular 2'),
            new Framework('React'),
            new Framework('Knockout')
        ];
    }
}

bootstrap(HelloApp);
