// Loaded by the frontend for every mode (app.ts requires custom/components.js).
// We register no Angular components here; the file exists to run site-wide
// code without patching upstream:
//
//  - import our CSS (hides Språkbanken's header menu, per-mode row colours)
//  - tag <body> with the current mode so the CSS can vary per mode, which
//    replaces the old per-mode settings.primaryColor / primaryLight.
import currentMode from "@/mode"
import "./clarin.css"

document.body.dataset.korpMode = currentMode

export default {}
