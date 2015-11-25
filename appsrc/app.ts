import {bootstrap, Component, CORE_DIRECTIVES} from 'angular2/angular2';
import {HTTP_PROVIDERS} from 'angular2/http';
import {IQuandl} from './quandl/IQuandl';
import {DataService} from './dataService';

@Component({
    selector: 'quandl-data',
    templateUrl: './quandl/quandl.html',
    directives: [CORE_DIRECTIVES]
})

export class TechStudio {
    public title: string;
    public quandlData: IQuandl[];

    constructor(dataService: DataService) {
        this.title = 'Quandl Data';
        this.quandlData = dataService.items;
        dataService.fetch();
    }
}

bootstrap(TechStudio, [HTTP_PROVIDERS, DataService]);
