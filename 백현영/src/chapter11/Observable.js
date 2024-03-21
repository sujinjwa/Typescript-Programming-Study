"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
var Observable = /** @class */ (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        // maybe...
        // const subscriber = new Subscriber(observerOrNext, error, complete);
        // this._subscribe(subscriber);
        // return subscriber;
    };
    return Observable;
}());
exports.Observable = Observable;
