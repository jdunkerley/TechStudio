/// <reference path='../../typings/jasmine/jasmine.d.ts' />

import * as arithmetic from '../../src/arithmetic';

describe('arithmetic', () => {
    it('should add', () => {
        expect(arithmetic.add(2, 4)).toEqual(6);
    });

    it('should multiply', () => {
        expect(arithmetic.multiply(2, 4)).toEqual(8);
    });
});
