/**
 * @description A class that manages a collection of listeners for events.
 * @export
 * @class Listeners
 * @template {(...args: any[]) => void} Listener 
 */
export class Listeners<Listener extends (...args: any[]) => void> {
  #listeners: Set<Listener> = new Set();

  #paused = false;

  public pause() { this.#paused = true; }
  public resume() { this.#paused = false; }

  /**
   * @description Add a listener
   * @public
   * @param {Listener} listener 
   */
  public add(listener: Listener) {
    this.#listeners.add(listener);
  }

  /**
   * @description Add a listener that will be called only once
   * @public
   * @param {Listener} listener 
   */
  public once(listener: Listener) {
    const wrapper = (...args: Parameters<Listener>) => {
      this.delete(wrapper as Listener);
      listener(...args);
    };
    this.add(wrapper as Listener);
  }

  /**
   * @description Remove a listener
   * @public
   * @param {Listener} listener 
   */
  public delete(listener: Listener) {
    this.#listeners.delete(listener);
  }

  /**
   * @description Remove all listeners
   * @public
   */
  public clear() {
    this.#listeners.clear();
  }

  /**
   * @description Get the current number of listeners
   * @public
   * @returns {number} 
   */
  public count(): number {
    return this.#listeners.size;
  }

  /**
   * @description Emit an event to all listeners
   * @public
   * @param {...Parameters<Listener>} args 
   */
  public emit(...args: Parameters<Listener>) {
    for (const listener of this.#listeners) {
      try {
        listener(...args);
      } catch (error) {
        // Optionally log or handle errors here
        // console.error("Listener error:", error);
      }
    }
  }

  /**
   * @description Emit an event to all listeners asynchronously.
   * @public
   * @async
   * @param {...Parameters<Listener>} args 
   * @returns {*} 
   */
  public async emitAsync(...args: Parameters<Listener>) {
    for (const listener of this.#listeners) {
      await listener(...args);
    }
  }

  /**
   * @description Return a snapshot of listeners (for debugging or introspection)
   * @public
   * @returns {Listener[]} 
   */
  public snapshot(): Listener[] {
    return Array.from(this.#listeners);
  }
}