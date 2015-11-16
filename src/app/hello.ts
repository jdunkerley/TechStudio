import goodbye = require('./goodbye');

export function add(a: number, b: number) {
    return a + b;
}

export function subtract(a: number, b: number) {
    return goodbye.gsubtract(a, b);
}

export function multiply(a: number, b: number) {
    return a * b;
}
