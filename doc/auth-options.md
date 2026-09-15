# Access control for Korp corpora: options and a recommendation

Written 2026-09-15 for the CLARIN setup (`https://alf.hum.ku.dk/korp`),
korp-frontend v9.15.1 and korp-backend v8.2.0. The backend `dev` branch
(8.3.0) is identical in everything that matters here. Facts about upstream
code were read from the tagged sources; facts about WAYF and CLARIN were
read from their public documentation and metadata feeds on the same day.

## 1. Summary

The need: Korp is read-only. Most corpora stay public. Some corpora must be
visible only to a defined group, for example researchers at one KU faculty.
Federated login is preferred, ideally through WAYF.

The finding: current Korp already has the plumbing. The backend has a
pluggable *authorizer* that checks every content request against a list
of protected corpora, and the frontend has a `federated_auth` module that
picks up a JWT from a cookie-protected endpoint and sends it as a Bearer
token. Språkbanken uses exactly this to give Mink users SWAMID-federated
access. Nothing in upstream needs patching.

What is missing is the piece in between: something that logs the user in
at WAYF and turns "who is this" into "which corpora may they read".

Recommendation: **Option C**, a small auth gateway container that speaks
OpenID Connect (authorization code flow, supported by WAYF since April
2025) to WAYF, keeps a session cookie under `/korp/auth/`, and issues
short-lived RS256 JWTs listing the corpora the user may read, computed
from a YAML mapping of attribute rules and allow-lists. The backend gets a
small authorizer plugin of our own (the shipped JWT plugin breaks without
memcached and lacks a dependency), the frontend gets one setting in
`config.yml`. Estimated effort is about one working week plus the calendar
time of a WAYF registration. Details in section 4.

Two caveats that hold for every option:

- WAYF's standard attributes identify the institution (`ku.dk`) and the
  role (`staff@ku.dk`), not the faculty or department. Faculty-level rules
  need KU's identity provider to release a group attribute
  (`isMemberOf` or `eduPersonEntitlement`); otherwise the gateway falls
  back to allow-lists of user IDs, which is workable for groups of tens of
  people. This is a question for KU-IT and the WAYF secretariat.
- Two side doors bypass Korp's authorizer: the CLARIN FCS endpoint (which
  searches the same corpora through the old backend-v6 without any login)
  and the exporter (which queries the backend without credentials). Both
  need a small change when the first corpus is protected (section 6).

## 2. What upstream Korp provides today

### 2.1 Backend (korp-backend 8.2.0)

Plugin system. `PLUGINS` lists Python modules to import; every Flask
`Blueprint` in a module is registered, and a subclass of
`korp.utils.Authorizer` becomes the one active authorizer. Plugin settings
live in `PLUGINS_CONFIG`. Introduced in 8.2.0 ("Added support for
authorization plugins"); still described upstream as rudimentary.

Authorizer interface. Two methods: `get_protected_corpora()` returns the
protected corpus IDs in upper case, and `check_authorization(corpora)`
returns `(ok, unauthorized_ids, message)`. The Flask request (headers,
cookies) is available to the plugin.

Where it is enforced. `query`, `query_sample`, `count`, `count_all`,
`count_time`, `relations`, `relations_sentences`, `loglike`,
`lemgram_count` and `attr_values` all call `check_authorization`.
`timespan` has the call commented out upstream. `corpus_config`,
`corpus_info` and `info` never check. Consequences: the *content* of a
protected corpus is protected; its name, description, attribute list, size
and date distribution are visible to everyone, and `/info` publishes the
list of protected corpora. Hiding a corpus's existence needs a separate
mode or instance, or a per-user corpus list as Mink does with
`get_corpus_ids`.

Marking a corpus. Add the line `Protected: true` to the corpus's CWB
`.info` file (`/opt/corpora/data/<corpus>/.info`, the file that already
holds `Sentences:` and `Updated:`). The frontend reads the same flag via
`corpus_info`.

Shipped plugin `plugins.auth` (Språkbanken's account server). The frontend
sends HTTP Basic credentials to `/authenticate`; the plugin relays
username, password and an MD5 checksum to `AUTH_SERVER`, which answers
with the permitted corpora. The protected list comes from `PROTECTED_FILE`.
This is the modern form of the `AUTH_SERVER`, `AUTH_SECRET` and
`PROTECTED_FILE` keys our 2022 backend config carried but never used.

Shipped plugin `plugins.auth_jwt`. Reads `Authorization: Bearer <JWT>`,
verifies RS256 against a public key file named by `pubkey_file` in the
instance directory, takes the user's corpora from the keys of
`scope.corpora` in the payload, and treats every corpus whose `.info` says
`Protected: true` as protected. Two problems for our image:

1. It imports `jwt` from `pyjwt[crypto]`, which upstream's
   `requirements.txt` does not list; we would add it to
   `backend/requirements-overrides.txt`.
2. `get_protected_corpora()` calls memcached unconditionally. With
   `MEMCACHED_SERVER = None`, which is our configuration, every authorised
   request fails with `ValueError: Unsupported server specification: None`
   (reproduced with pymemcache 4.0). Either run memcached or write our own
   authorizer. Our own is the better choice: about forty lines that do the
   same JWT check and read the protected list from a file or from the
   `.info` files without a cache, shipped as a module in `backend/` and
   named in `PLUGINS`. No upstream patch.

### 2.2 Frontend (korp-frontend 9.15.1)

The `auth_module` setting in `config.yml` selects one of three behaviours:

- unset: no login link, all corpora treated as open;
- `basic_auth`: a username and password modal that calls
  `<backend>/authenticate` with HTTP Basic and remembers the credentials
  in local storage (pairs with the backend plugin `plugins.auth`);
- `federated_auth`: options `jwt_url`, `login_service`, `logout_service`.
  On page load the frontend fetches `jwt_url` with cookies
  (`credentials: include`); a 401 means "not logged in", otherwise it
  decodes the JWT payload and expects `name` or `email`, `scope.corpora`
  (an object of corpus ID to access level) and `levels` (`READ`, `WRITE`,
  `ADMIN`). Every backend request then carries
  `Authorization: Bearer <jwt>`. "Log in" redirects the browser to
  `login_service?redirect=<current URL>`; "Log out" redirects to
  `logout_service`.

A custom module is also possible: a file in the config directory's
`custom/` implementing the nine functions of the `AuthModule` interface.

Behaviour around protected corpora, all built in: a lock icon in the
corpus chooser, protected corpora dropped from the default selection,
a "Login needed for ..." notice when a URL selects one without
credentials, and unselection on logout. `config_dependent_on_authentication`
delays loading the corpus configuration until the login check is done.

Same-origin matters. The JWT endpoint is fetched with cookies, so it
should live on the same site as the frontend, for example
`https://alf.hum.ku.dk/korp/auth/jwt`. Browsers increasingly block
third-party cookies; a JWT endpoint on another host would be fragile.

Precedent. Språkbanken's public Korp uses `basic_auth` against their own
account server. Their Mink mode uses `federated_auth` with a Shibboleth
SP in SWAMID: `https://sp.spraakbanken.gu.se/auth/jwt`, `/auth/login`,
`/Shibboleth.sso/Logout`. Option C is the same design with WAYF in the
place of SWAMID.

### 2.3 Our setups today

- CLARIN: `PLUGINS = []`, no corpus protected, `auth_module` unset. The
  2022 header showed a "Log ind" link that never worked because no auth
  server existed.
- LANCHART: the whole site sits behind a login at the gateway (per its
  README). That is the all-or-nothing pattern of Option A.
- Alf's nginx gateway serves `/korp/` (frontend) and `/korp/backend/`
  (backend) on one host, which is exactly what the cookie-based flow
  needs.

## 3. The federation landscape for a KU service

### 3.1 WAYF

WAYF is the Danish research and education identity federation, run by
DeiC. KU is a member; its identity provider is
`https://id.ku.dk/nidp/saml2/metadata` (NetIQ Access Manager), and KU has
declared SIRTFI compliance. Connecting a service and using WAYF are free
of charge; the service provider pays for its own technical integration.

Joining, per WAYF's "How to 'WAYF' your web service": contact the
secretariat; supply the service's name, the provider's name and logo, a
short description and a contact person; agree an attribute release
profile ("only the minimum of information may be transferred that is
required for the service provider to be able to deliver his service");
integrate technically; go through a test connection, then production.
A commercial provider needs a sponsor statement from a member
institution; as a KU department we are the member.

Protocols. SAML 2.0 is native. OpenID Connect was added for services in
early 2023 (id_token with form_post) and the **authorization code flow on
30 April 2025**, with PKCE (S256) and RS256-signed id_tokens. Discovery
documents, fetched 2026-09-15:

| Document | URL | Issuer |
|---|---|---|
| WAYF hub (institution chooser) | `https://wayf.wayf.dk/.well-known/openid-configuration` | `https://wayf.wayf.dk` |
| KU only (no chooser) | `https://wayf.wayf.dk/oidc/config/ku.dk/.well-known/openid-configuration` | `https://wayf.wayf.dk/op/ku.dk` |

Token endpoint `https://wayf.wayf.dk/oidc/token`, userinfo
`https://wayf.wayf.dk/oidc/userinfo`, keys `https://wayf.wayf.dk/oidc/wayf.jwk`.
The claim set is fixed per service agreement and the `scope` parameter is
ignored. `client_id` and `client_secret` come from the secretariat. WAYF
notes that these documents are not digitally signed, so trust rests on
the TLS connection to `wayf.wayf.dk`.

Attributes, from WAYF's attribute list. Mandatory from every identity
provider: `cn`, `eduPersonPrincipalName` (for example
`jens.hansen@ku.dk`, never reassigned), `eduPersonPrimaryAffiliation`,
`schacHomeOrganization` (`ku.dk`), `organizationName`, `eduPersonAssurance`.
Generated by WAYF: `eduPersonTargetedID`, a pseudonymous per-service ID.
Optional, depending on the institution: `eduPersonScopedAffiliation`
(`staff@ku.dk`), `eduPersonAffiliation`, `isMemberOf` ("group memberships
within the identity provider"), `eduPersonEntitlement` ("special rights at
the service"), `mail`, `uid`. Faculty or department is not a standard
attribute; only `isMemberOf` or `eduPersonEntitlement` could carry it, and
only if KU's identity provider populates them. WAYF can filter attribute
values per service, so a service can be given only the group values that
match a pattern.

Obligations, from WAYF's policies: validate every signature (for OIDC,
the id_token signature and audience), HTTPS only, keep metadata and
endpoints current, practise data minimisation. WAYF accepts no liability.

### 3.2 eduGAIN and the CLARIN Service Provider Federation

WAYF is a member of eduGAIN and imports more than 150 eduGAIN services;
WAYF counts 531 services that accept logins from WAYF institutions through
eduGAIN. Those services receive the Research and Scholarship attribute
bundle: name, `eduPersonPrincipalName`, scoped affiliation,
`eduPersonTargetedID`, mail.

The CLARIN SPF is SAML only. Each CLARIN centre signs one agreement that
lets CLARIN ERIC deal with the national federations; WAYF (Denmark and
Iceland) is among the participating federations. The reference
implementation is a Shibboleth SP (CLARIN's SPF tutorial). CLARIN warns
that "each different SP incurs considerable overhead on both your
centre's staff and the CLARIN SPF team" and that "registering a new SP
can take a full working day" per federation. The CLARIN "homeless"
identity provider only gives access to preproduction services.

CLARIN-DK already has an SP in the SPF production feed:
`https://repository.clarin.dk/shibboleth` (CLARIN-DK-UCPH Repository),
tagged Research and Scholarship, Data Protection Code of Conduct and
clarin-member. It requests `eduPersonPrincipalName`, `mail`, `cn` and
`eduPersonTargetedID` as required and `givenName`, `sn`,
`eduPersonScopedAffiliation` as optional. So the centre agreement is in
place, the team has run Shibboleth in WAYF and eduGAIN, and that
attribute set is a realistic baseline for what a Korp service would get.

## 4. Options

Each option: how it works, what we build, what it gives, what it costs.
Effort figures are my estimates for one developer who knows this repo,
excluding the calendar time of registrations.

### A. Whole instance behind a login at the gateway

How. nginx `auth_request` on Alf in front of `/korp/`, answered by
oauth2-proxy configured as a generic OIDC client of WAYF, or plain HTTP
basic auth. Korp is untouched. Access is per instance, so "public plus
restricted" means a second Korp compose stack for the restricted corpora,
the way LANCHART runs.

Gives. Federated login (with oauth2-proxy). Group checks through
oauth2-proxy's `allowed_groups` or claim filters. No per-corpus
granularity inside an instance.

Costs. Hours for basic auth; one to two days for oauth2-proxy plus the
WAYF registration. Ongoing: a duplicated stack, two URLs, a split user
experience, no cross-instance searches.

Verdict. Fine for one restricted collection with one audience. Does not
scale to several groups.

### B. Local accounts with Korp's built-in basic auth

How. `auth_module: basic_auth` in the frontend, `plugins.auth` in the
backend, and a small account server of our own that implements
Språkbanken's JSON contract (username, password and checksum in, a
`permitted_resources.corpora` map out), about a hundred lines of Flask
with a bcrypt password file or SQLite, plus a `PROTECTED_FILE`. The
Danish UI texts for the login modal already exist in our translation.

Gives. Per-corpus access. No federation: we create accounts, reset
passwords, remove leavers, and store password hashes, with the security
and GDPR duties that brings.

Costs. Two to three days.

Verdict. The cheapest per-corpus route and an acceptable stopgap. The
protected flags and the corpus-to-group mapping carry over to Option C
unchanged.

### C. WAYF-federated auth gateway issuing Korp JWTs (recommended)

How. One new container, `auth`, in the CLARIN compose stack, a Python
service (Flask or FastAPI with Authlib) behind `/korp/auth/` on Alf:

- `GET /korp/auth/login?redirect=<url>` starts the OIDC authorization
  code flow with WAYF, using the KU-only provider or the hub with the
  institution chooser; the callback verifies the id_token against WAYF's
  published keys and stores the claims in a signed session cookie
  (`Secure`, `HttpOnly`, `SameSite=Lax`, path `/korp/auth/`), then sends
  the browser back to `redirect`.
- `GET /korp/auth/jwt` answers 401 without a session, otherwise a
  short-lived RS256 JWT of the shape the frontend expects:
  `sub`, `name`, `email`, `scope.corpora` (corpus ID to level),
  `levels` (`READ: 1`, `WRITE: 2`, `ADMIN: 3`), `exp`.
- `GET /korp/auth/logout` clears the cookie and optionally forwards to
  WAYF's logout.
- `access.yml`, mounted into the container, maps corpora to rules, for
  example: a corpus is readable by anyone with
  `eduPersonScopedAffiliation` `staff@ku.dk` and an `isMemberOf` value
  for the faculty, or by anyone whose `eduPersonPrincipalName` is on a
  list.

Then: our authorizer plugin in the backend (JWT verified with the
gateway's public key, protected list from the `.info` files or a file),
`pyjwt[crypto]` in `backend/requirements-overrides.txt`,
`auth_module: federated_auth` with the three URLs in
`setups/clarin/frontend/config/config.yml`, and one `location /korp/auth/`
rule in Alf's gateway.

Gives. Federated login for any WAYF institution or KU only; per-corpus
access; rule-based and list-based groups; no passwords stored; standard
libraries; no upstream patch. The same gateway can later gain a SAML
client for the CLARIN SPF (Option D) without touching Korp.

Costs. Four to six days of engineering including tests and fixtures,
then the WAYF registration: a form, an attribute agreement, a test
connection and a production switch, which is little work but weeks of
calendar time. Ongoing: editing `access.yml`.

Risks. WAYF's OIDC code flow is young (2025); if it proves awkward the
same service can speak SAML with `pysaml2` or `python3-saml` instead, and
the rest stays. Faculty-level rules depend on KU's attributes; the
allow-list fallback is always available. JWT lifetime: issue one per page
load with an expiry of a few hours, so long sessions do not break
mid-search.

### D. SAML SP in the CLARIN SPF (eduGAIN-wide)

How. The same architecture as C, but the login side is a Shibboleth SP
(Apache plus `shibd` in a container) or `pysaml2` registered in the CLARIN
SPF, so users from any eduGAIN federation, WAYF and KU included, can log
in through CLARIN's discovery service.

Gives. Everything in C plus reach across Europe and CLARIN branding.
Attributes are limited to the Research and Scholarship bundle, so
KU-faculty rules still depend on the KU-IT question or on allow-lists.

Costs. C plus two to four days for the SP, its metadata with the R&S and
Code of Conduct categories, and the SPF registration, plus the recurring
metadata hygiene CLARIN warns about.

Verdict. Only if non-Danish CLARIN users need restricted corpora. It can
be added to C later.

### E. Identity broker (Keycloak) between WAYF and Korp

How. Keycloak as OIDC client or SAML SP to WAYF (and the SPF), groups and
roles per corpus in its admin UI, JWTs issued by Keycloak. Korp still
needs an authorizer that maps realm roles to corpora, and the frontend
still needs a JWT in Korp's shape, so a thin adapter or a protocol mapper
is required on top.

Gives. Everything in C and D, an admin UI, local and federated accounts
side by side, and reuse by other KU services.

Costs. Five to ten days plus ongoing operation of a Java service with a
database, upgrades and backups.

Verdict. Overkill for read-only per-corpus gating on one service. The
right choice only if several KU services need shared federated login.

### F. Keep everything public

The baseline: no cost, no restricted corpora.

## 5. Comparison

| Option | Federated | Per-corpus | Who can log in | Group granularity | Passwords we store | Code we own | Upstream patches | Ongoing admin | Effort |
|---|---|---|---|---|---|---|---|---|---|
| A, basic auth | no | no, per instance | whoever has the shared password | none | one shared | none | none | low | hours |
| A, oauth2-proxy | yes | no, per instance | WAYF or KU | claims | none | config | none | low to medium, second stack | 1 to 2 days + WAYF |
| B, local accounts | no | yes | accounts we create | lists | yes | ~100 lines + admin script | none | medium, accounts | 2 to 3 days |
| **C, WAYF gateway** | **yes** | **yes** | **WAYF or KU** | **attribute rules + lists** | **none** | **~300 lines + plugin** | **none** | **low, edit access.yml** | **4 to 6 days + WAYF** |
| D, CLARIN SPF | yes | yes | eduGAIN incl. WAYF | R&S attributes + lists | none | C + SP config | none | medium, SPF metadata | C + 2 to 4 days + SPF |
| E, Keycloak | yes | yes | WAYF, eduGAIN, local | groups in a UI | optional | adapter + plugin | none | high, Keycloak operations | 5 to 10 days + operations |
| F, all public | n/a | n/a | n/a | n/a | none | none | none | none | none |

## 6. Recommended path

1. Decide the first restricted corpora and their audience. Add
   `Protected: true` to their `.info` files and write the first
   `access.yml`.
2. Ask the WAYF secretariat for a test connection (OIDC code flow, KU
   provider) and ask KU-IT what `id.ku.dk` releases through WAYF, in
   particular whether `isMemberOf` or `eduPersonEntitlement` can carry
   faculty or department membership.
3. Build Option C in `setups/clarin`: the `auth` service, the backend
   plugin and `pyjwt[crypto]` in `backend/`, `auth_module` in
   `config.yml`, the gateway rule on Alf.
4. Close the side doors. FCS: exclude protected corpora from the endpoint,
   either through backend-v6's `PROTECTED_FILE` (queries then fail
   closed) or through the endpoint's own corpus list. Exporter: forward
   the browser's `Authorization` header to the backend, or refuse
   protected corpora.
5. Extend `scripts/golden.sh` with an authorised and an unauthorised query
   per protected corpus, so a regression in the authorizer shows up in the
   fixtures.
6. Later, if needed: add a SAML client to the gateway for the SPF
   (Option D), or move to a broker (Option E) if KU services multiply.

If federated login must wait for the registrations, Option B can be built
first with the same protected flags and the same mapping, and replaced by
C without touching corpora or fixtures.

## 7. Open questions

- Which attributes will KU's identity provider release to this service
  through WAYF? This decides whether faculty rules can be attribute-based
  or must be allow-lists.
- Is "name visible with a lock icon" acceptable for restricted corpora,
  or must they be invisible? Invisibility needs a separate mode or
  instance.
- Will non-Danish users ever need restricted corpora? If yes, plan
  Option D from the start.
- Who maintains `access.yml`, and does it live in git or only on Alf?
- Which restricted corpora, if any, may stay searchable anonymously
  through the FCS endpoint?
- Session length, and whether logout should also log the user out of
  WAYF.

## Appendix: sources

Upstream code (tags v8.2.0 and v9.15.1, checked out 2026-09-15):

- korp-backend: `korp/utils.py` (`Authorizer`, `check_authorization`),
  `korp/__init__.py` (plugin loading), `plugins/auth.py`,
  `plugins/auth_jwt.py`, `korp/views/*.py` (enforcement points),
  `CHANGELOG.md` (8.2.0).
- korp-frontend: `doc/frontend_devel.md`, section "Authentication";
  `app/scripts/auth/{init,auth,basic_auth,fed_auth}.ts`;
  `app/scripts/data_init.ts` (the `Protected` flag);
  `app/scripts/app.ts` and `components/corpus-chooser/*` (lock, login
  needed).
- korp-frontend-sb: `app/config.yml` (`basic_auth`),
  `app/modes/mink_mode.js` (`federated_auth` with a Shibboleth SP).

WAYF:

- How to 'WAYF' your web service: https://wayf.dk/en/node/49
- Attributes: https://wayf.dk/en/node/60
- Policies: https://wayf.dk/en/policies
- OIDC configuration: https://www.wayf.dk/en/oidc-configuration-wayf
- OIDC code flow now supported (2025-04-30): https://wayf.dk/en/oidc-code-flow-now-supported-services-wayf
- Machine-readable OIDC config per organisation (2025-05-28): https://www.wayf.dk/en/machine-readable-oidc-config-now-online-each-wayf-user-organisation
- Services accepting WAYF logins through eduGAIN: https://wayf.dk/en/services-accepting-wayf-logins-through-edugain
- About WAYF: https://wayf.dk/en/about

CLARIN:

- Participating in the SPF: https://www.clarin.eu/content/participating-spf
- SPF technical details: https://www.clarin.eu/content/service-provider-federation-technical-details
- SPF overview and federations: https://www.clarin.eu/content/service-provider-federation
- Shibboleth SP tutorial: https://github.com/clarin-eric/SPF-tutorial
- Production SP metadata (contains `repository.clarin.dk`): https://infra.clarin.eu/aai/prod_md_about_spf_sps.xml
- Production IdP metadata (contains `id.ku.dk`): https://infra.clarin.eu/aai/prod_md_about_spf_idps.xml
- CLARIN-DK privacy policy (login via WAYF): https://info.clarin.dk/en/the-clarin-dk-infrastructure/overview/privacypolicy/
