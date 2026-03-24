# Stitch Prompt Pack: Sovereign Analyst Edition

## Creative North Star
The creative north star is `The Sovereign Analyst`.

This product is not a startup dashboard, not a banking consumer app, and not a cyberpunk security toy. It should feel like an expensive intelligence instrument built for expert operators. The interface must fade into the background and give full visual authority to the analyst’s judgment, the evidence, and the risk signals.

The overall mood is:
- dark
- calm
- editorial
- precise
- architectural
- asymmetrical
- high-trust

The app should resemble a bespoke legal-intelligence or financial-forensics platform, with tonal layering instead of obvious boxes and borders.

## Product Context
`Savvy Fraud Intelligence` is a premium fraud operations platform for banks, fintechs, payment processors, compliance teams, and transaction risk analysts.

Core workflows:
- monitor suspicious transaction activity
- triage live alerts
- investigate individual cases
- review entity-level risk and identity trust
- prepare regulatory and governance outputs

## Screen Map / IA
- `Command Centre`
- `Live Alert Queue`
- `Case Investigation`
- `Entity Search`
- `Regulatory Reporting Portal`

## Master Stitch Prompt
Design a premium dark-mode web app called `Savvy Fraud Intelligence` for transaction fraud operations, case investigation, entity intelligence, and regulatory reporting.

Use the design philosophy `The Sovereign Analyst`. The interface should reject noisy fintech aesthetics, generic admin dashboards, and developer-tool layouts. It should feel like a custom-built operational intelligence product with tonal depth, editorial hierarchy, and architectural composition.

Use intentional asymmetry. Avoid rigid card farms. The app should feel like layered workspaces rather than a grid of bordered widgets. Each screen must have one clear focal region supported by secondary modules.

Visual requirements:
- dark tonal surface system
- no pure black
- no visible 1px section borders as the main structural device
- no bubbly shapes
- no loud rainbow gradients
- no pastel enterprise templates
- no Streamlit or dashboard-builder feel

Typography must feel highly controlled and editorial. Use `Public Sans` for headlines, body, labels, and data. Use large, authoritative headlines paired with much smaller metadata labels. Important identifiers, risk values, timestamps, and financial amounts should feel precise and legible.

The app must include:
- a premium left rail or command-oriented navigation system
- a centered command search bar in the top chrome
- dense but readable data layouts
- isolated lavender-blue system actions
- isolated red/pink risk alerts
- evidence-oriented detail panels
- operational timelines
- intelligence-grade tables

This should look like a high-end fraud intelligence workspace used by professionals during long review sessions.

## Visual System Prompt
Design the global visual system for `Savvy Fraud Intelligence` with the following exact mood:

- `surface`: deep obsidian charcoal, around `#131313`
- `surface-container`: layered dark panels around `#201f1f`
- `surface-container-high`: active cards around `#2a2a2a`
- `surface-container-highest`: floating search or overlays around `#353534`
- `primary`: cool lavender-blue around `#b6c4ff`
- `primary-container`: deeper indigo variation for subtle same-family gradients
- `risk accent`: soft stamped pink-red around `#ffb3ac` or `#ffb4ab`

Rules:
- use tonal shifts instead of visible borders wherever possible
- if a boundary is absolutely needed, use whisper-thin outline treatment at very low opacity
- use negative space to separate major modules
- reserve shadows for floating utilities only
- avoid bright, gamified color usage
- use risk color like a red stamp in a dossier, not as a page-wide theme

## Typography Prompt
Use `Public Sans` throughout.

Typography rules:
- headlines should be large, dense, and authoritative
- metadata labels should be small, uppercase or tightly tracked, and visually secondary
- body copy should be concise and highly readable
- tabular data and financial values should use tabular alignment
- entity names, case IDs, and risk scores must look serious and high-value

Do not use playful type, rounded startup typography, or anything consumer-finance coded.

## Shell / Navigation Prompt
Design the main app shell for `Savvy Fraud Intelligence`.

Requirements:
- dark left navigation rail with subtle glass or tonal depth
- top chrome with product title on the left and a centered command search bar
- small utility cluster on the right for notifications, help, settings, and operator identity
- left rail should feel like product infrastructure, not a settings sidebar
- active navigation state should be clear using tonal lift and a restrained primary accent
- include a bottom utility zone in the nav for system status and support

Navigation items:
- Dashboard or Command Centre
- Alert Queue
- Case Manager
- Entity Search
- Reporting
- Audit Logs

Add a primary action near the lower part of the rail such as `New Investigation`.

Avoid:
- Streamlit-style sidebar controls
- giant utility filter sidebars
- thick outlines
- oversized rounded pills

## Shared Component System Prompt
Design a component system for `Savvy Fraud Intelligence` that supports dense analyst workflows.

Include:
- left navigation rail
- top command bar
- operational page headers
- dossier-style summary strips
- risk index rings and score modules
- intelligence cards using tonal separation instead of visible borders
- compact metadata chips
- risk chips for `Critical`, `High`, `Medium`, `Pending`, `Accepted`, `Certified`
- intelligence tables with spacing between rows instead of default horizontal dividers
- audit timeline with icon markers and precise timestamps
- supporting evidence modules
- financial snapshot cards
- identity trust / KYC modules
- associated entities cards
- intervention panels
- export and report action modules

Component rules:
- card corners should be sharp to medium, not bubbly
- buttons should have crisp edges
- primary buttons use lavender-blue with subtle same-family tonal gradient
- ghost buttons should be visible mostly through tone and low-opacity outline
- tables should feel curated, not spreadsheet-like
- use zebra or tonal row treatment instead of standard divider lines

## Prompt 1: Command Centre
Design the `Command Centre` screen for `Savvy Fraud Intelligence`.

Goal:
Show the operational fraud posture for the platform at a glance. This is the command surface for urgent review, current threat context, and analyst action routing.

Reference composition:
- a large hero threat module on the left
- a narrow KPI stack on the right
- a second row with one large chart module and one advisory module
- a lower action-required review list
- a thin audit/system strip near the bottom

What the hero should communicate:
- current critical operation or named threat cluster
- risk index
- velocity
- exposure value
- dominant signal
- two clear action buttons

Required blocks:
- page label such as `Operational Overview`
- `Command Centre` title
- live network or feed status indicator
- critical priority hero panel
- side KPI stack:
  - live alert volume
  - high-risk count
  - STR-ready cases
- risk signal distribution visualization
- intelligence advisory narrative
- action-required review posture list
- bottom system / audit strip

Visual behavior:
- one dominant asymmetrical hero area
- no generic top row of equal cards
- dark tonal panels with restrained highlights
- clear hierarchy between focal risk panel and supporting modules

Avoid:
- dashboard template layouts
- equal-size KPI cards across the top
- large empty light spaces
- consumer fintech language

## Prompt 2: Live Alert Queue
Design the `Live Alert Queue` screen for `Savvy Fraud Intelligence`.

Goal:
Provide a highly usable real-time alert triage workspace for analysts.

Reference composition:
- page title and queue volume at top
- inline filter bar directly under title
- dominant large table on the left
- narrow insight rail on the right
- pagination and queue summary at bottom
- optional floating quick-add or quick-action button

Required blocks:
- title `Live Alert Queue`
- queue volume subtitle
- inline filters:
  - severity
  - channel
  - owner
  - clear filters
- top-right actions:
  - export CSV
  - batch action
- primary alert table with columns:
  - time
  - alert
  - customer
  - amount
  - channel
  - risk
  - signal
- right rail modules:
  - signal distribution
  - team performance
  - AI recommendation
- bottom pagination / item count

Table style:
- roomy rows
- tonal row separation, not obvious lines
- risk values should feel like instruments, not labels
- status chips should be compact and sharp

Avoid:
- spreadsheet aesthetics
- bright multicolor charts
- making the right rail visually heavier than the queue itself

## Prompt 3: Entity Search
Design the `Entity Search` screen for `Savvy Fraud Intelligence`.

Goal:
Show entity-level exposure and identity-linked fraud context. This should feel like a high-end dossier.

Reference composition:
- entity breadcrumb and entity title at top
- metadata chips under the title
- primary exposure summary on the left-center
- financial snapshot module on the right
- second row with behavioral fingerprint and identity trust
- lower rows with event timeline, associated entities, and suggested interventions

Required blocks:
- breadcrumb
- large entity name
- entity tags such as account type, region, segment
- top-right actions:
  - export dossier
  - freeze account
- `Critical Exposure` module with:
  - risk index ring
  - short narrative
  - several sub-metrics like velocity, geolocation, network, identity match
- financial snapshot summary
- behavioral risk fingerprint
- identity trust / KYC module
- event timeline
- associated entities panel
- suggested interventions module

Tone:
- forensic
- identity-centric
- layered and high trust

Avoid:
- CRM-like profile page styling
- oversized avatar-led consumer identity cards
- equal card grids

## Prompt 4: Case Investigation
Design the `Case Investigation` screen for `Savvy Fraud Intelligence`.

Goal:
Support case review, evidence interpretation, and final determination for a single suspicious transaction.

Reference composition:
- case header and summary strip at top
- large central left column for audit trail and supporting evidence
- right column for risk signal dashboard, entity profile, and final determination
- evidence modules arranged like a dossier, not like cards in a generic dashboard

Required blocks:
- case ID
- transaction amount
- initiation method
- destination rail or payment route
- current case status
- evidence pack action
- audit trail with timestamped events
- supporting evidence area:
  - geo-location
  - device signature
  - frequency
  - average size
  - tenure
- risk signal dashboard with scored factors
- entity profile summary
- final determination area with:
  - reject
  - approve
  - escalate to compliance

Visual rules:
- the audit trail must feel central and authoritative
- risk detail on the right should feel like a determination sidebar
- buttons should be sharp and decisive

Avoid:
- stacked generic whitepaper cards
- playful case-management UI
- oversimplified red-green binary styling

## Prompt 5: Regulatory Reporting Portal
Design the `Regulatory Reporting Portal` screen for `Savvy Fraud Intelligence`.

Goal:
Show governance, control effectiveness, and regulator-facing reporting assets in a way that feels credible to senior compliance and audit stakeholders.

Reference composition:
- title and governance label at top
- actions in the upper right
- a row of major performance metrics
- a large table on the left
- a circular model performance module on the right
- export cards below
- narrative and assurance modules in the right column

Required blocks:
- title `Regulatory Reporting Portal`
- small governance label
- actions:
  - internal distribution
  - generate regulator pack
- top metrics:
  - loss avoided
  - time to detect
  - time to triage
  - false-positive rate
- recent regulatory submissions table
- model performance and drift ring visualization
- export modules:
  - alert queue analysis
  - control map summary
  - board summary pack
- officer narrative panel
- assurance summary panel

Tone:
- executive
- formal
- audit-ready
- not salesy

Avoid:
- over-technical ML dashboard feel
- compliance screens that feel like ERP software
- too many tiny chart widgets

## Negative Prompt / Guardrails
Do not generate:
- Streamlit-style layouts
- visible 1px border-heavy structure
- light dashboards
- beige enterprise templates
- fintech lifestyle UI
- bubbly pills except risk/status chips
- rainbow gradients
- pure black backgrounds
- cyberpunk neon security visuals
- large cartoon icons or illustrations
- equal-weight card farms
- generic admin dashboard spacing
- loud chart palettes

## Copy Direction
Preferred language:
- `Operational Overview`
- `Command Centre`
- `Live Alert Queue`
- `Case Investigation`
- `Entity Search`
- `Regulatory Reporting Portal`
- `Critical Exposure`
- `Risk Index`
- `Intelligence Advisory`
- `Suggested Interventions`
- `Audit Trail`
- `Supporting Evidence`
- `Model Performance & Drift`
- `Generate Regulator Pack`
- `Escalate to Compliance`

Avoid language that feels:
- consumer finance
- community savings
- startup marketing
- crypto-native
- playful or motivational

## Stitch Usage Order
Recommended order:
1. `Master Stitch Prompt`
2. `Visual System Prompt`
3. `Shell / Navigation Prompt`
4. `Command Centre`
5. `Live Alert Queue`
6. `Entity Search`
7. `Case Investigation`
8. `Regulatory Reporting Portal`
9. `Shared Component System Prompt`
