// Class.
import { Listeners } from "./listeners.class";
/**
 * @description A class that implements an event emitter pattern.
 * @export
 * @class EventEmitter
 * @template {Record<string, (...args: any[]) => void>} Events 
 */
export class EventEmitter<Events extends Record<string, (...args: any[]) => void>> {
  /**
   * @description
   * @type {Map<keyof Events, Listeners<Events[keyof Events]>>}
   */
  #events: Map<keyof Events, Listeners<Events[keyof Events]>> = new Map();

  /**
   * Creates an instance of `EventEmitter`.
   * @constructor
   * @param {?Partial<{ [K in keyof Events]: Events[K][] }>} [events] 
   */
  constructor(events?: Partial<{ [K in keyof Events]: Events[K][] }>) {
    for (const [event, listeners] of Object.entries(events ?? {})) {
      this.#events.set(event as keyof Events, new Listeners<Events[keyof Events]>());
      for (const listener of listeners!) {
        this.#events.get(event as keyof Events)!.add(listener);
      }
    }
  }

  /**
   * @description Removes all listeners for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @returns {this} 
   */
  public clear<Event extends keyof Events>(event: Event): this {
    return this.#events.get(event)?.clear(), this;
  }

  /**
   * @description Removes all listeners for all event types.
   * @public
   * @returns {this} 
   */
  public clearAll(): this {
    return this.#events.clear(), this;
  }

  /**
   * @description Gets the number of listeners for a specific event.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @returns {number} 
   */
  public count<Event extends keyof Events>(event: Event): number {
    return this.#events.get(event)?.count() ?? 0;
  }

  /**
   * @description Emits an event, calling all listeners for that event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {...Parameters<Events[Event]>} args 
   */
  public emit<Event extends keyof Events>(event: Event, ...args: Parameters<Events[Event]>): this {
    return this.#events.get(event)?.emit(...args), this;
  }

  /**
   * @description Emits an event asynchronously, calling all listeners for that event type.
   * @public
   * @async
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {...Parameters<Events[Event]>} args 
   * @returns {this} 
   */
  public async emitAsync<Event extends keyof Events>(event: Event, ...args: Parameters<Events[Event]>): Promise<this> {
    return await this.#events.get(event)?.emitAsync(...args), this;
  }

  /**
   * @description Adds a listener for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {Events[Event]} listener 
   * @returns {this} 
   */
  public on<Event extends keyof Events>(event: Event, listener: Events[Event]): this {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Listeners<Events[Event]>());
    }
    return this.#events.get(event)!.add(listener), this;
  }

  /**
   * @description Adds a listener for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {Events[Event]} listener 
   * @returns {this} 
   */
  public once<Event extends keyof Events>(event: Event, listener: Events[Event]): this {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Listeners<Events[Event]>());
    }
    return this.#events.get(event)!.add(listener, {once: true}), this;
  }

  /**
   * @description Removes a listener for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {Events[Event]} listener 
   * @returns {this} 
   */
  public off<Event extends keyof Events>(event: Event, listener: Events[Event]): this {
    return this.#events.get(event)?.delete(listener), this;
  }
}
