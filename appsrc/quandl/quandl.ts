import {ISerializable} from '../ISerializable';
import {IQuandl} from './IQuandl';

export class Quandl implements ISerializable<Quandl>, IQuandl {
    public date: Date;
    public open: number;
    public high: number;
    public low: number;
    public close: number;
    public volume: number;
    public exDividend: number;
    public splitRatio: number;
    public adjOpen: number;
    public adjHigh: number;
    public adjLow: number;
    public adjClose: number;
    public adjVolume: number;

    deserialize(input: Object) {
        this.date = new Date(input['date']);
        this.open = input['open'];
        this.high = input['high'];
        this.low = input['low'];
        this.close = input['close'];
        this.volume = input['volume'];
        this.exDividend = input['ex-Dividend'];
        this.splitRatio = input['split Ratio'];
        this.adjOpen = input['adj. Open'];
        this.adjHigh = input['adj. High'];
        this.adjLow = input['adj. Low'];
        this.adjClose = input['adj. Close'];
        this.adjVolume = input['adj. Volume'];

        return this;
    }
}
