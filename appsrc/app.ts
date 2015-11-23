import {bootstrap, Component, CORE_DIRECTIVES} from 'angular2/angular2';
import {Framework} from './frameworks/framework';
import {DataService} from './dataService';

@Component({
    selector: 'hello-app',
    templateUrl: './frameworks/frameworks.html',
    directives: [CORE_DIRECTIVES]
})

export class HelloApp {
    public title: string;
    public frameworks: Framework[];

    constructor(dataService: DataService) {
        this.title = 'Frameworks Guide';
        this.frameworks = dataService.getItems();
    }
}

bootstrap(HelloApp, [DataService]);
