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
   * @description Remove all listeners for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   */
  public clear<Event extends keyof Events>(event: Event): void {
    this.#events.get(event)?.clear();
  }

  /**
   * @description Remove all listeners for all event types.
   * @public
   */
  public clearAll(): void {
    this.#events.clear();
  }

  /**
   * @description Get the number of listeners for a specific event.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @returns {number} 
   */
  public count<Event extends keyof Events>(event: Event): number {
    return this.#events.get(event)?.count() ?? 0;
  }

  /**
   * @description Emit an event, calling all listeners for that event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {...Parameters<Events[Event]>} args 
   */
  public emit<Event extends keyof Events>(event: Event, ...args: Parameters<Events[Event]>): void {
    this.#events.get(event)?.emit(...args);
  }

  /**
   * @description Add a listener for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {Events[Event]} listener 
   */
  public on<Event extends keyof Events>(event: Event, listener: Events[Event]): void {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Listeners<Events[Event]>());
    }
    this.#events.get(event)!.add(listener);
  }

  /**
   * @description Add a listener for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {Events[Event]} listener 
   */
  public once<Event extends keyof Events>(event: Event, listener: Events[Event]): void {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Listeners<Events[Event]>());
    }
    this.#events.get(event)!.once(listener);
  }

  /**
   * @description Remove a listener for a specific event type.
   * @public
   * @template {keyof Events} Event 
   * @param {Event} event 
   * @param {Events[Event]} listener 
   */
  public off<Event extends keyof Events>(event: Event, listener: Events[Event]): void {
    this.#events.get(event)?.delete(listener);
  }
}

