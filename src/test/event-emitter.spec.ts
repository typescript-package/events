import { EventEmitter } from "../lib";

describe('EventEmitter', () => {
  type MyEvents = {
    data: (value: number) => void;
    error: (err: Error) => void;
  };

  let emitter: EventEmitter<MyEvents>;

  beforeEach(() => {
    emitter = new EventEmitter<MyEvents>();
  });

  it('should add and call listeners for an event', () => {
    const dataSpy = jasmine.createSpy('data');
    emitter.on('data', dataSpy);
    emitter.emit('data', 42);
    expect(dataSpy).toHaveBeenCalledWith(42);
    expect(emitter.count('data')).toBe(1);
  });

  it('should support chaining .on, .off, .emit', () => {
    const dataSpy = jasmine.createSpy('data');
    emitter
      .on('data', dataSpy)
      .emit('data', 123)
      .off('data', dataSpy)
      .emit('data', 456);
    expect(dataSpy).toHaveBeenCalledTimes(1);
    expect(emitter.count('data')).toBe(0);
  });

  it('should add a once listener and remove after first call', () => {
    const dataSpy = jasmine.createSpy('data');
    emitter.once('data', dataSpy);
    emitter.emit('data', 1);
    emitter.emit('data', 2);
    expect(dataSpy).toHaveBeenCalledTimes(1);
  });

  it('should remove a listener', () => {
    const dataSpy = jasmine.createSpy('data');
    emitter.on('data', dataSpy);
    emitter.off('data', dataSpy);
    emitter.emit('data', 99);
    expect(dataSpy).not.toHaveBeenCalled();
  });

  it('should clear all listeners for an event', () => {
    const dataSpy = jasmine.createSpy('data');
    const dataSpy2 = jasmine.createSpy('data2');
    emitter.on('data', dataSpy).on('data', dataSpy2);
    emitter.clear('data');
    emitter.emit('data', 77);
    expect(dataSpy).not.toHaveBeenCalled();
    expect(dataSpy2).not.toHaveBeenCalled();
    expect(emitter.count('data')).toBe(0);
  });

  it('should clear all listeners for all events', () => {
    const dataSpy = jasmine.createSpy('data');
    const errorSpy = jasmine.createSpy('error');
    emitter.on('data', dataSpy).on('error', errorSpy);
    emitter.clearAll();
    emitter.emit('data', 5);
    emitter.emit('error', new Error('fail'));
    expect(dataSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(emitter.count('data')).toBe(0);
    expect(emitter.count('error')).toBe(0);
  });

  it('should initialize with listeners via constructor', () => {
    const dataSpy = jasmine.createSpy('data');
    const emitter2 = new EventEmitter<MyEvents>({ data: [dataSpy] });
    emitter2.emit('data', 321);
    expect(dataSpy).toHaveBeenCalledWith(321);
    expect(emitter2.count('data')).toBe(1);
  });

  it('should emit to listeners asynchronously', async () => {
    const asyncSpy = jasmine.createSpy('asyncData').and.callFake(async (value: number) => {
      await new Promise(r => setTimeout(r, 10));
    });
    emitter.on('data', asyncSpy);
    await emitter.emitAsync('data', 55);
    expect(asyncSpy).toHaveBeenCalledWith(55);
  });
});