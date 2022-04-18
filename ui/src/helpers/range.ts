import { List } from "immutable";

export function range(start: number, end: number) {
    if (start > end) throw Error("start has to be greater than end");

    var res = List<number>();
    for (let i = start; i <= end; i++) {
        res = res.push(i);
    }
    return res;
}
