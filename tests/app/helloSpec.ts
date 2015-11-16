/// <reference path='../../typings/jasmine/jasmine.d.ts' />
import hello = require('../../src/app/hello');

describe('hello', () => {
    it('should be able to add two numbers', () => {
        expect(hello.add(2, 4)).toEqual(6);
    });
});
