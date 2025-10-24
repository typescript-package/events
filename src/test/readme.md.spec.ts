import { EventEmitter, Listeners } from "../lib";

type MyEvents = {
  data: (value: number) => void;
  error: (err: Error) => void;
};

const event = new EventEmitter({
  'data': [
    (value: number) => { console.log('Initial data listener:', value); },
    (value: number) => { console.log('Second data listener:', value); }
  ],
  'error': [
    (err: Error) => { console.error('Initial error listener:', err); }
  ],
});

event.on('data', value => console.log('Data:', value));
event.on('error', err => console.error('Error:', err));

event.emit('data', 42); // Logs: Data: 42
event.emit('error', new Error('Oops!')); // Logs: Error: Error: Oops!

const listeners = new Listeners<(msg: string) => void>();

listeners.add(msg => console.log(msg));
listeners.emit('Hello, world!'); // Logs: Hello, world!