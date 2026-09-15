#!/usr/bin/env node
/**
 * modejs2yaml.js - convert Korp 9.1-era JavaScript mode files into the YAML
 * corpus configuration served by korp-backend >= 8.1 via /corpus_config.
 *
 * Usage:
 *   node scripts/modejs2yaml.js <setup frontend app dir> <output config dir> [--dump-json FILE]
 *   e.g. node scripts/modejs2yaml.js setups/clarin/frontend/app setups/clarin/corpus_config
 *
 * Reads:
 *   <app>/config.js                          (defaultOptions, defaultWithin, modeConfig)
 *   frontend/app/modes/common.js             (shared attribute definitions, from the base image)
 *   <app>/modes/<mode>_mode.js               (one per mode in modeConfig)
 *   <app>/translations/corpora-{da,en}.json  (labels)
 *   frontend/app/translations/locale-{da,en}.json (a few attribute labels live there)
 *
 * Writes:
 *   <out>/modes/<mode>.yaml
 *   <out>/corpora/<id>.yaml
 *   <out>/attributes/{positional,structural}/<preset>.yaml  (definitions shared by >1 corpus)
 *   <setup>/frontend/config/custom/statistics.js  (inline stats_stringify / stats_cqp functions)
 *   <setup>/frontend/config/custom/stringify.js   (inline stringify functions)
 *
 * The old files are evaluated in a sandbox with stubs for the globals they
 * touch (settings, CorpusListing, jQuery). Everything the YAML format cannot
 * express is reported on stderr as RESIDUE for manual review.
 *
 * No dependencies: YAML is emitted with a minimal writer that quotes every
 * string as a JSON string (a valid YAML double-quoted scalar).
 */
"use strict"

const fs = require("fs")
const path = require("path")
const vm = require("vm")
const crypto = require("crypto")

// ---------------------------------------------------------------- arguments
const args = process.argv.slice(2)
if (args.length < 2) {
    console.error("usage: modejs2yaml.js <app dir> <out dir> [--dump-json FILE]")
    process.exit(2)
}
const APP = path.resolve(args[0])
const OUT = path.resolve(args[1])
const dumpIdx = args.indexOf("--dump-json")
const DUMP = dumpIdx >= 0 ? path.resolve(args[dumpIdx + 1]) : null
const REPO = path.resolve(__dirname, "..")
const COMMON = path.join(REPO, "frontend/app/modes/common.js")
const SETUP = path.dirname(path.dirname(APP)) // <setup>/frontend/app -> <setup>
const CUSTOM_DIR = path.join(SETUP, "frontend/config/custom")

// Residue: grouped by (file, message); corpus ids collected per group.
const residue = new Map()
function warn(file, msg, corpusId) {
    const key = `${file}: ${msg}`
    if (!residue.has(key)) residue.set(key, new Set())
    if (corpusId) residue.get(key).add(corpusId)
}

// ------------------------------------------------------------- translations
function loadJsonLoose(p) {
    if (!fs.existsSync(p)) return {}
    // The old translation files may contain trailing commas.
    const txt = fs.readFileSync(p, "utf8").replace(/,(\s*[}\]])/g, "$1")
    return JSON.parse(txt)
}
const trDa = loadJsonLoose(path.join(APP, "translations/corpora-da.json"))
const trEn = loadJsonLoose(path.join(APP, "translations/corpora-en.json"))
const locDa = loadJsonLoose(path.join(REPO, "frontend/app/translations/locale-da.json"))
const locEn = loadJsonLoose(path.join(REPO, "frontend/app/translations/locale-en.json"))

/** Resolve a translation key to {dan, eng}; null if unknown. */
function translate(key) {
    const dan = trDa[key] ?? locDa[key]
    const eng = trEn[key] ?? locEn[key]
    if (dan === undefined && eng === undefined) return null
    const out = {}
    if (dan !== undefined) out.dan = dan
    if (eng !== undefined) out.eng = eng
    return out
}
/** A label in the old config is a translation key if the files know it, else literal text. */
const labelOf = (s) => (typeof s === "string" ? translate(s) ?? s : s)

// ------------------------------------------------------------------ sandbox
function makeSandbox() {
    const noop = () => stub
    const stub = { remove: noop, hide: noop, show: noop, css: noop, addClass: noop, removeClass: noop }
    const sandbox = {
        window: { isLab: false },
        settings: {},
        console: { log() {}, warn() {}, error() {} },
        $: () => stub,
        _: undefined,
        moment: undefined,
        module: { exports: {} }, // common.js ends with a module.exports block
        require: () => ({}),
        CorpusListing: class CorpusListing {
            constructor(corpora) {
                this.corpora = corpora
            }
        },
    }
    sandbox.window.settings = sandbox.settings
    return vm.createContext(sandbox)
}
function run(ctx, file) {
    const code = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")
    new vm.Script(code, { filename: file }).runInContext(ctx)
}

const ctx = makeSandbox()
run(ctx, path.join(APP, "config.js"))
run(ctx, COMMON)
const S = ctx.settings
const modeConfig = S.modeConfig
if (!Array.isArray(modeConfig)) throw new Error("config.js did not define settings.modeConfig")

// ------------------------------------------------------- function registries
// Inline functions become named entries in custom/statistics.js (stats_stringify,
// stats_cqp) or custom/stringify.js (stringify). Identical sources share a name.
const registries = { statistics: new Map(), stringify: new Map() } // source -> name
function registerFn(kind, fn, hint) {
    const reg = registries[kind]
    let src = fn.toString().replace(/\r\n/g, "\n")
    // Recognise common bodies and give them stable, descriptive names.
    let base = hint.replace(/[^A-Za-z0-9]/g, "_")
    if (/^function\s*\(\s*values\s*\)\s*\{\s*return values\.join\(" "\)\s*;?\s*\}$/.test(src.replace(/\s+/g, " "))) {
        base = "joinWithSpace"
        src = "(values) => values.join(\" \")"
    }
    if (reg.has(src)) return reg.get(src)
    let name = base
    let n = 2
    while ([...reg.values()].includes(name)) name = `${base}_${n++}`
    reg.set(src, name)
    return name
}

// ------------------------------------------------------ attribute conversion
const KEY_MAP = {
    extendedComponent: "extended_component",
    extendedTemplate: "extended_template",
    displayType: "display_type",
    hideSidebar: "hide_sidebar",
    hideStatistics: "hide_statistics",
    hideExtended: "hide_extended",
    hideCompare: "hide_compare",
    isStructAttr: "is_struct_attr",
    internalSearch: "internal_search",
    externalSearch: "external_search",
    sidebarComponent: "sidebar_component",
    sidebarInfoUrl: "sidebar_info_url",
    customType: "custom_type",
    statsStringify: "stats_stringify",
    statsCqp: "stats_cqp",
    groupBy: "group_by",
}
const BOOL_KEYS = new Set(["hide_sidebar", "hide_statistics", "hide_extended", "hide_compare", "is_struct_attr", "internal_search", "escape", "ranked"])
const KNOWN_KEYS = new Set([
    "label", "opts", "order", "dataset", "escape", "type", "pattern", "translation",
    "extended_component", "extended_template", "display_type", "hide_sidebar", "hide_statistics",
    "hide_extended", "hide_compare", "is_struct_attr", "internal_search", "external_search",
    "sidebar_component", "sidebar_info_url", "custom_type", "stats_stringify", "stats_cqp",
    "stringify", "group_by", "ranked",
])

/**
 * Old patterns were built with string concatenation of a module-level
 * constant (`" + qtch + "`) INSIDE the lodash template expression. That only
 * worked because the old loader made the constant a global. Resolve it now.
 */
function fixPattern(pattern, file, name, corpusId) {
    let p = pattern.replace(/"\s*\+\s*qtch\s*\+\s*"/g, '\\"')
    if (/\bqtch\b/.test(p)) warn(file, `attribute '${name}': pattern still references 'qtch' after substitution`, corpusId)
    if (/rel="?localize\[/.test(p) || /rel=\\"localize\[/.test(p))
        warn(file, `attribute '${name}': pattern uses rel="localize[...]" spans; verify they still localise in the new sidebar (plan 3.4 step 7)`, corpusId)
    return p
}

/** Convert one old attribute definition object to the new key set. */
function convertAttr(name, def, file, corpusId) {
    if (def === undefined || def === null) {
        warn(file, `attribute '${name}' is undefined (a missing variable in the mode file); dropped`, corpusId)
        return null
    }
    const out = {}
    let translationKey = null
    const hasController = "extendedController" in def
    for (const [k0, v0] of Object.entries(def)) {
        let k = KEY_MAP[k0] ?? k0
        let v = v0
        if (k0 === "translationKey") {
            translationKey = v0
            continue
        }
        if (k0 === "extendedController") continue
        if (k0 === "extendedTemplate" && hasController) {
            warn(file, `attribute '${name}': inline extendedTemplate+extendedController dropped (the msd info-modal is replaced by sidebar_info_url, plan 4.2)`, corpusId)
            continue
        }
        if (typeof v === "function") {
            if (k === "stats_stringify" || k === "stats_cqp") v = registerFn("statistics", v, `${name}_${k}`)
            else if (k === "stringify") v = registerFn("stringify", v, name)
            else {
                warn(file, `attribute '${name}': key '${k0}' is a function; dropped`, corpusId)
                continue
            }
        }
        if (BOOL_KEYS.has(k) && typeof v === "string") v = v === "true"
        if (k === "label") v = labelOf(v)
        if (k === "pattern" && typeof v === "string") v = fixPattern(v, file, name, corpusId)
        if (v && typeof v === "object" && !Array.isArray(v)) v = { ...v }
        if (!KNOWN_KEYS.has(k)) warn(file, `attribute '${name}': unknown key '${k0}' kept as '${k}'`, corpusId)
        out[k] = v
    }
    if (translationKey) {
        const values = out.dataset ? (Array.isArray(out.dataset) ? out.dataset : Object.values(out.dataset)) : []
        const translation = {}
        for (const val of values) {
            const t = translate(translationKey + val)
            if (t) translation[val] = t
        }
        if (Object.keys(translation).length) out.translation = translation
        else warn(file, `attribute '${name}': translationKey '${translationKey}' had no '${translationKey}*' entries in any translation file, so values were shown raw before too; dropped`, corpusId)
    }
    return out
}

// Attribute definitions are collected per kind; after all modes are read,
// definitions used by more than one corpus become presets, the rest are
// inlined in their corpus file.
const attrUses = { positional: new Map(), structural: new Map() } // hash -> {attrName, def, uses: [{corpusId, mode}]}
function noteAttr(kind, attrName, def, corpusId, mode) {
    const hash = crypto.createHash("sha1").update(attrName + JSON.stringify(def)).digest("hex")
    const store = attrUses[kind]
    if (!store.has(hash)) store.set(hash, { attrName, def, uses: [] })
    store.get(hash).uses.push({ corpusId, mode })
    return hash
}

// ------------------------------------------------------- within and context
const SIZE_RANK = { sentence: 1, paragraph: 2, text: 3 }
const rankOf = (value) => {
    const m = String(value).match(/(sentence|paragraph|text)/)
    return m ? SIZE_RANK[m[1]] : 99
}
/** {"sentence": "sentence"} -> [{label, value}] ordered from smaller to bigger. */
function convertLabeled(obj, file, corpusId, what) {
    if (obj === undefined || obj === null) {
        warn(file, `${what} is undefined; omitted so the frontend default applies`, corpusId)
        return undefined
    }
    return Object.entries(obj)
        .map(([label, value]) => ({ label: translate(`${what}_${label}`) ?? label, value }))
        .sort((a, b) => rankOf(a.value) - rankOf(b.value))
}

// ---------------------------------------------------------------- folders
/** Old: {title, description, contents: [...], sub: {...}} nested by property; new: {title, description, subfolders}. */
function convertFolders(folders, prefix, corpusToFolder) {
    const out = {}
    for (const [key, f] of Object.entries(folders || {})) {
        if (!f || typeof f !== "object") continue
        const pathKey = prefix ? `${prefix}.${key}` : key
        const node = {}
        if (f.title !== undefined) node.title = labelOf(f.title)
        if (f.description !== undefined && String(f.description).trim() !== "") node.description = labelOf(f.description)
        for (const c of f.contents || []) (corpusToFolder[String(c).toLowerCase()] ??= []).push(pathKey)
        const subs = Object.fromEntries(
            Object.entries(f).filter(([k, v]) => !["title", "description", "contents"].includes(k) && v && typeof v === "object" && !Array.isArray(v))
        )
        if (Object.keys(subs).length) node.subfolders = convertFolders(subs, pathKey, corpusToFolder)
        out[key] = node
    }
    return out
}

// ------------------------------------------------------------- YAML writer
function yaml(value, indent = 0) {
    const pad = " ".repeat(indent)
    if (value === null || value === undefined) return "null"
    if (typeof value === "boolean" || typeof value === "number") return String(value)
    if (typeof value === "string") return JSON.stringify(value)
    if (Array.isArray(value)) {
        if (!value.length) return "[]"
        return value
            .map((v) => {
                if (v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length) {
                    return `${pad}- ${yaml(v, indent + 2).trimStart()}`
                }
                return `${pad}- ${yaml(v, indent + 2)}`
            })
            .join("\n")
    }
    const entries = Object.entries(value)
    if (!entries.length) return "{}"
    return entries
        .map(([k, v]) => {
            const plain = /^[A-Za-z0-9_][A-Za-z0-9_\-.]*$/.test(k) && !/^(true|false|null|yes|no|on|off)$/i.test(k)
            const key = plain ? k : JSON.stringify(k)
            if (v && typeof v === "object" && (Array.isArray(v) ? v.length : Object.keys(v).length)) {
                return `${pad}${key}:\n${yaml(v, indent + 2)}`
            }
            return `${pad}${key}: ${yaml(v, indent + 2)}`
        })
        .join("\n")
}
function writeYaml(file, obj, header) {
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, (header ? `# ${header}\n` : "") + yaml(obj) + "\n")
}

// ------------------------------------------------------------------- modes
const corpora = new Map() // id -> corpus def (attributes as hashes until finalised)
const modes = []
const CORPUS_KEYS = ["id", "title", "description", "within", "context", "attributes", "structAttributes", "struct_attributes", "customAttributes"]

modeConfig.forEach((mc, index) => {
    const modeName = mc.mode
    const file = path.join(APP, "modes", `${modeName}_mode.js`)
    const base = path.basename(file)
    if (!fs.existsSync(file)) {
        warn(base, "listed in modeConfig but the file does not exist")
        return
    }
    S.corpora = {}
    S.corporafolders = {}
    S.preselectedCorpora = []
    for (const k of ["primaryColor", "primaryLight", "autocomplete", "wordpicture", "lemgramSelect"]) delete S[k]
    run(ctx, file)

    const mode = { label: translate(mc.localekey) ?? mc.localekey, order: index + 1 }
    for (const key of ["autocomplete", "wordpicture"]) {
        if (S[key] !== undefined) warn(base, `settings.${key}=${S[key]}: set the global in config.yml (autocomplete / word_picture) rather than per mode`)
    }
    if (S.primaryColor !== undefined) warn(base, `settings.primaryColor='${S.primaryColor}' / primaryLight='${S.primaryLight}' have no YAML equivalent (plan 4.6)`)
    if (S.lemgramSelect !== undefined) warn(base, `settings.lemgramSelect=${S.lemgramSelect} has no equivalent; the lemgram UI follows 'autocomplete'`)
    if (/\$\(/.test(fs.readFileSync(file, "utf8"))) warn(base, "contains jQuery DOM calls ($(...)); dropped")

    const corpusToFolder = {}
    const folders = convertFolders(S.corporafolders, "", corpusToFolder)
    if (Object.keys(folders).length) mode.folders = folders
    if (Array.isArray(S.preselectedCorpora) && S.preselectedCorpora.length) {
        mode.preselected_corpora = S.preselectedCorpora.map((c) => String(c).toLowerCase())
    }
    modes.push({ name: modeName, def: mode, corpusCount: Object.keys(S.corpora).length })

    for (const [key, c] of Object.entries(S.corpora)) {
        const id = String(c.id ?? key).toLowerCase()
        if (String(key).toLowerCase() !== id) warn(base, `corpus key '${key}' differs from its id '${c.id}'; using '${id}'`)
        const modeEntry = { name: modeName }
        const folderPaths = corpusToFolder[id] || corpusToFolder[String(key).toLowerCase()]
        if (folderPaths) modeEntry.folder = folderPaths.length === 1 ? folderPaths[0] : folderPaths
        if (!corpora.has(id)) {
            const def = { id, title: labelOf(c.title ?? id), description: labelOf(c.description ?? ""), mode: [] }
            const within = convertLabeled(c.within, base, id, "within")
            const context = convertLabeled(c.context, base, id, "context")
            if (within) def.within = within
            if (context) def.context = context
            def._pos = []
            for (const [name, adef] of Object.entries(c.attributes || {})) {
                const conv = convertAttr(name, adef, base, id)
                if (conv) def._pos.push({ name, hash: noteAttr("positional", name, conv, id, modeName) })
            }
            def._struct = []
            for (const [name, adef] of Object.entries(c.structAttributes || c.struct_attributes || {})) {
                const conv = convertAttr(name, adef, base, id)
                if (conv) def._struct.push({ name, hash: noteAttr("structural", name, conv, id, modeName) })
            }
            if (c.customAttributes) {
                def.custom_attributes = []
                for (const [name, adef] of Object.entries(c.customAttributes)) {
                    const conv = convertAttr(name, adef, base, id)
                    if (conv) def.custom_attributes.push({ [name]: conv })
                }
            }
            for (const k of Object.keys(c)) if (!CORPUS_KEYS.includes(k)) warn(base, `corpus key '${k}' not converted`, id)
            corpora.set(id, def)
        } else {
            const prev = corpora.get(id)
            const a = JSON.stringify([Object.keys(c.attributes || {}), Object.keys(c.structAttributes || {})])
            const b = JSON.stringify([prev._pos.map((o) => o.name), prev._struct.map((o) => o.name)])
            if (a !== b) warn(base, `defined again with different attributes than in an earlier mode; first definition kept`, id)
        }
        corpora.get(id).mode.push(modeEntry)
    }
})

// ------------------------------------------- finalise presets vs inline defs
const presets = { positional: [], structural: [] } // {name, def}
const hashToRef = { positional: new Map(), structural: new Map() } // hash -> preset name | inline def
for (const kind of ["positional", "structural"]) {
    // Group variants by attribute name; the most used variant gets the bare name.
    const byName = new Map()
    for (const [hash, u] of attrUses[kind]) (byName.get(u.attrName) ?? byName.set(u.attrName, []).get(u.attrName)).push({ hash, ...u })
    for (const [attrName, variants] of byName) {
        variants.sort((a, b) => b.uses.length - a.uses.length)
        const taken = new Set()
        variants.forEach((v, i) => {
            if (v.uses.length < 2) {
                hashToRef[kind].set(v.hash, v.def) // inline
                return
            }
            let name = i === 0 ? attrName : `${attrName}__${v.uses[0].mode}`
            let n = 2
            while (taken.has(name)) name = `${attrName}__${v.uses[0].mode}_${n++}`
            taken.add(name)
            presets[kind].push({ name, def: v.def, uses: v.uses.length })
            hashToRef[kind].set(v.hash, name)
        })
    }
}
for (const c of corpora.values()) {
    c.pos_attributes = c._pos.map(({ name, hash }) => ({ [name]: hashToRef.positional.get(hash) }))
    c.struct_attributes = c._struct.map(({ name, hash }) => ({ [name]: hashToRef.structural.get(hash) }))
    delete c._pos
    delete c._struct
    if (c.custom_attributes) {
        const ca = c.custom_attributes
        delete c.custom_attributes
        c.custom_attributes = ca // keep it after the other attribute lists
    }
}

// -------------------------------------------------------------------- write
if (DUMP) {
    fs.writeFileSync(
        DUMP,
        JSON.stringify(
            {
                modes,
                corpora: [...corpora.values()],
                presets,
                functions: Object.fromEntries(Object.entries(registries).map(([k, m]) => [k, Object.fromEntries([...m].map(([s, n]) => [n, s]))])),
                residue: [...residue].map(([k, ids]) => ({ message: k, corpora: [...ids] })),
            },
            null,
            2
        )
    )
}

fs.rmSync(OUT, { recursive: true, force: true })
const HEADER = "Generated by scripts/modejs2yaml.js from the pre-2026 JavaScript mode files. Edit freely; the JS files are the past."
for (const m of modes) writeYaml(path.join(OUT, "modes", `${m.name}.yaml`), m.def, HEADER)
for (const c of corpora.values()) writeYaml(path.join(OUT, "corpora", `${c.id}.yaml`), c, HEADER)
for (const kind of ["positional", "structural"]) {
    for (const { name, def, uses } of presets[kind]) {
        writeYaml(path.join(OUT, "attributes", kind, `${name}.yaml`), def, `${HEADER} Used by ${uses} corpora.`)
    }
}

/** Known old helper calls and their replacements in the current frontend. */
function modernise(src) {
    // util.lemgramToString(x, true) rendered a lemgram as plain text.
    const m = src.replace(/\s+/g, " ").match(/^function\s*\(\s*(\w+)\s*\)\s*\{\s*return util\.lemgramToString\(\s*\1\s*,\s*true\s*\)\s*;?\s*\}$/)
    if (m) return `(${m[1]}) => Lemgram.parse(${m[1]})?.toString() || ${m[1]}`
    return null
}
function writeCustom(kind, file, preamble) {
    const reg = registries[kind]
    if (!reg.size) return
    fs.mkdirSync(CUSTOM_DIR, { recursive: true })
    const entries = [...reg].map(([src, name]) => {
        let body = modernise(src) ?? src
        if (body === src && /\butil\.|\bsettings\.|\$\(/.test(src)) warn(file, `function '${name}' uses old globals (util/settings/jQuery) and needs a manual port`)
        return `    ${name}: ${body.replace(/\n\s*/g, " ")},`
    })
    fs.writeFileSync(path.join(CUSTOM_DIR, file), `${preamble}\nexport default {\n${entries.join("\n")}\n}\n`)
}
writeCustom("statistics", "statistics.js", "// Generated by scripts/modejs2yaml.js: functions that were inline in the old mode\n// files, now referenced by name from stats_stringify / stats_cqp in the corpus YAML.")
writeCustom("stringify", "stringify.js", '// Generated by scripts/modejs2yaml.js: sidebar value stringifiers referenced by\n// name from `stringify` in the corpus YAML.\nimport { Lemgram } from "@/lemgram"')

// ------------------------------------------------------------------ report
console.log(`modes:   ${modes.length}  (${modes.map((m) => `${m.name}=${m.corpusCount}`).join(", ")})`)
console.log(`corpora: ${corpora.size}`)
const inlineCount = (kind) => [...hashToRef[kind].values()].filter((v) => typeof v !== "string").length
console.log(`presets: positional=${presets.positional.length} (+${inlineCount("positional")} inline) structural=${presets.structural.length} (+${inlineCount("structural")} inline)`)
console.log(`custom functions: statistics=${registries.statistics.size} stringify=${registries.stringify.size}`)
console.log(`output:  ${OUT}`)
if (residue.size) {
    console.error(`\nRESIDUE (${residue.size} distinct items to review by hand):`)
    for (const [k, ids] of residue) console.error(`  ${k}${ids.size ? `  [${ids.size} corpora: ${[...ids].slice(0, 3).join(", ")}${ids.size > 3 ? ", ..." : ""}]` : ""}`)
}
