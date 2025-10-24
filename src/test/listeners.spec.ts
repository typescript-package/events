import { Listeners } from "../lib";


describe('Listeners', () => {
  type Fn = (a?: number, b?: number) => void;
  let listeners: Listeners<Fn>;

  beforeEach(() => {
    listeners = new Listeners<Fn>();
  });

  it('should add and call a listener', () => {
    const spy = jasmine.createSpy('listener');
    listeners.add(spy);
    listeners.emit(1, 2);
    expect(spy).toHaveBeenCalledWith(1, 2);
    expect(spy.calls.count()).toBe(1);
  });

  it('should allow chaining for add, delete, clear, pause, resume', () => {
    const spy = jasmine.createSpy('listener');
    expect(listeners.add(spy)).toBe(listeners);
    expect(listeners.delete(spy)).toBe(listeners);
    expect(listeners.clear()).toBe(listeners);
    expect(listeners.pause()).toBe(listeners);
    expect(listeners.resume()).toBe(listeners);
  });

  it('should remove a listener', () => {
    const spy = jasmine.createSpy('listener');
    listeners.add(spy);
    listeners.delete(spy);
    listeners.emit(2, 3);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should clear all listeners', () => {
    const spy1 = jasmine.createSpy('l1');
    const spy2 = jasmine.createSpy('l2');
    listeners.add(spy1).add(spy2);
    listeners.clear();
    listeners.emit(3, 4);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(listeners.count()).toBe(0);
  });

  it('should return the correct count', () => {
    const spy1 = jasmine.createSpy('l1');
    const spy2 = jasmine.createSpy('l2');
    listeners.add(spy1);
    expect(listeners.count()).toBe(1);
    listeners.add(spy2);
    expect(listeners.count()).toBe(2);
    listeners.delete(spy1);
    expect(listeners.count()).toBe(1);
  });

  it('should only call a once-listener once', () => {
    const spy = jasmine.createSpy('listener');
    listeners.add(spy, { once: true });
    listeners.emit(5, 6);
    listeners.emit(5, 6);
    expect(spy.calls.count()).toBe(1);
  });

  it('should pause and resume emitting', () => {
    const spy = jasmine.createSpy('listener');
    listeners.add(spy);
    listeners.pause();
    listeners.emit(7, 8);
    expect(spy).not.toHaveBeenCalled();
    listeners.resume();
    listeners.emit(7, 8);
    expect(spy).toHaveBeenCalledWith(7, 8);
  });

  it('should return a snapshot of listeners', () => {
    const s1 = () => {};
    const s2 = () => {};
    listeners.add(s1).add(s2);
    const snapshot = listeners.snapshot();
    expect(snapshot).toContain(s1);
    expect(snapshot).toContain(s2);
    expect(snapshot.length).toBe(2);
  });

  it('should throw AggregateError if any listeners throw', () => {
    const good = jasmine.createSpy('good');
    const bad = () => { throw new Error('fail1'); };
    const bad2 = () => { throw new Error('fail2'); };
    listeners.add(good).add(bad as Fn).add(bad2 as Fn);

    expect(() => listeners.emit(1, 2)).toThrowError(AggregateError);
    expect(good).toHaveBeenCalled();
  });

  it('should await all listeners in emitAsync', async () => {
    const spy = jasmine.createSpy('listener');
    const asyncListener = jasmine.createSpy('asyncListener').and.callFake(async () => {});
    listeners.add(spy).add(asyncListener as Fn);
    await listeners.emitAsync(1, 2);
    expect(spy).toHaveBeenCalledWith(1, 2);
    expect(asyncListener).toHaveBeenCalledWith(1, 2);
  });

  it('should not emit when paused (emitAsync)', async () => {
    const spy = jasmine.createSpy('listener');
    listeners.add(spy);
    listeners.pause();
    await listeners.emitAsync(1, 2);
    expect(spy).not.toHaveBeenCalled();
  });
});
