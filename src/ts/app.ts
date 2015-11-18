import {bootstrap, Component} from 'angular2/angular2';

@Component({
    selector: 'hello-app',
    template: `
        <h1>Hello, {{name}}!</h1>
        Say hello to: <input [value]="name" (input)="name = $event.target.value">
    `
})

export class HelloApp {
    public name: string = 'World';
}

bootstrap(HelloApp);
