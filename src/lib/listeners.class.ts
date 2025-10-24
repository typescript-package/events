/**
 * @description A class that manages a collection of listeners for events.
 * @export
 * @class Listeners
 * @template {(...args: any[]) => void} Listener 
 */
export class Listeners<Listener extends (...args: any[]) => void> {
  /**
   * @description Privately stored listeners.
   * @type {Set<Listener>}
   */
  #listeners: Set<Listener> = new Set();

  /**
   * @description Privately stored state of pause.
   * @type {boolean}
   */
  #paused = false;

  /**
   * Creates an instance of `Listeners`.
   * @constructor
   * @param {...Listener[]} listeners The listeners to add.
   */
  constructor(...listeners: Listener[]) {
    listeners?.forEach(listener => this.add(listener));
  }

  /**
   * @description Adds a listener.
   * @public
   * @param {Listener} listener 
   */
  public add(listener: Listener, { once }: { once: boolean} = { once: false }): this {
    const listenerOnce = ((...args: Parameters<Listener>) => {
      this.delete(listenerOnce as Listener);
      listener(...args);
    }) as Listener;
    return this.#listeners.add(once ? listenerOnce : listener), this;
  }

  /**
   * @description Removes a listener.
   * @public
   * @param {Listener} listener 
   * @returns this
   */
  public delete(listener: Listener): this {
    return this.#listeners.delete(listener), this;
  }

  /**
   * @description Removes all listeners.
   * @public
   * @returns this
   */
  public clear(): this {
    return this.#listeners.clear(), this;
  }

  /**
   * @description Gets the current number of listeners.
   * @public
   * @returns {number} 
   */
  public count(): number {
    return this.#listeners.size;
  }

  /**
   * @description Emits an event to all listeners.
   * @public
   * @param {...Parameters<Listener>} args 
   */
  public emit(...args: Parameters<Listener>): this {
    if (this.#paused) return this;
    const errors: any[] = [];
    for (const listener of this.#listeners) {
      try {
        listener(...args);
      } catch (error) {
        errors.push(error);
      }
    }
    if (errors.length) {
      throw new AggregateError(errors, "One or more listeners failed");
    }
    return this;
  }

  /**
   * @description Emit an event to all listeners asynchronously.
   * @public
   * @async
   * @param {...Parameters<Listener>} args 
   * @returns {*} 
   */
  public async emitAsync(...args: Parameters<Listener>) {
    if (this.#paused) return this;
    for (const listener of this.#listeners) {
      await Promise.resolve(listener(...args));
    }
    return this;
  }

  /**
   * @description Adds listener invoked once.
   * @public
   * @param {Listener} listener 
   * @returns {this} 
   */
  public once(listener: Listener): this {
    return this.add(listener, { once: true });
  }

  /**
   * @description Pauses emitting.
   * @public
   */
  public pause(): this { return this.#paused = true, this; }

  /**
   * @description Resume emitting.
   * @public
   */
  public resume(): this { return this.#paused = false, this; }

  /**
   * @description Returns a snapshot of listeners.
   * @public
   * @returns {Listener[]} 
   */
  public snapshot(): Listener[] {
    return Array.from(this.#listeners);
  }
}
