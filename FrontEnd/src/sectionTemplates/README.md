Usage

This folder contains section templates and a tiny renderer helper.

Examples (in your React code):

```js
import { getRenderedTemplate } from "./templateRenderer";

const data = {
  title: "Our Vision",
  content:
    "The vision of Team Arabia is to continue advancing our roles as the leaders within the industry and develop strong relationships with all our skilled employees and esteemed clients. Integrity, trust, and performance drive us towards our journey of becoming the benchmark within our field.",
};

const payload = getRenderedTemplate("about_us", "text_paragraph", data);
// payload will be: { id, module, data, html }
// Send `payload` as JSON to the backend.
```

Notes

- `renderTemplate` performs very small templating: {{key}}, {{#if key}}...{{/if}} and {{#each arr}}...{{/each}} with {{this}}.
- The renderer escapes HTML in values to reduce injection risk; if you intentionally store HTML in `content`, modify `renderTemplate` accordingly.
