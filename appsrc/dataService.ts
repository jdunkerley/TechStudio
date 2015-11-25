import {Injectable} from 'angular2/angular2';
import {Http} from 'angular2/http';
import {Quandl} from './quandl/quandl';

@Injectable()
export class DataService {
    public items: Quandl[] = [];

    constructor(public http: Http) {
    }

    public fetch(): void {
        this.http.get('./quandl/data.json')
            .map((res: any) => res.json())
            .subscribe(
                data => this.process(data),
                err => console.log(err)
            );
    };

    private process(data: Object[]): void {
        data.map(d => this.items.push(new Quandl().deserialize(d)));
    };
}