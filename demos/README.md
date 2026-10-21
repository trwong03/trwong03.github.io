# Live demos

Each interactive demo lives in its own folder: `demos/<name>/index.html`.
It is a self-contained page, so it can't break the main site.

To show it on the site, add this inside the project's card in `../index.html`:

```html
<a class="demo" href="demos/<name>/">Try it live →</a>
```

Or embed it inline in the card:

```html
<iframe src="demos/<name>/" width="100%" height="400" loading="lazy"></iframe>
```

## Ways to run real code in the browser (no server needed)

- **Python** (e.g. password strength checker): Pyodide runs Python in the page.
- **C** (e.g. MessagePack encoder, parts of myDACQ): compile to WebAssembly with Emscripten (`emcc file.c -o index.html`).
- **Firmware behavior** (FreeRTOS tasks, MQTT): simulate in JavaScript, or embed a Wokwi STM32 simulator project.
- **MQTT**: a browser client (MQTT.js over WebSockets) can talk to a public test broker.

GitHub Pages hosts all of this for free since everything runs client-side.
