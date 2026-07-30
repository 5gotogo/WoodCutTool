import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  cutListExpressionFunctionNames,
  evaluateCutListExpression,
} from "./cut-list-expression.mjs";

const REVIEWED_DATE = "2026-07-30";
const MODEL_VERSION = "1.0.0";

const AWI_CASEWORK_SOURCE = {
  name: "ANSI/AWI 1235-2024 – Specialty Casework",
  url: "https://awinet.org/standards/specialty-casework/requirements-specialty-casework/3-2-material-6/",
  scope:
    "Primary industry standard used here for casework material, component, and hardware-planning context. Its published scope is specialty casework; it does not set universal residential cabinet dimensions or replace project documents.",
};

const AWI_INSTALLATION_SOURCE = {
  name: "ANSI/AWI 0620-2025 – Finish Carpentry/Installation",
  url: "https://awinet.org/standards/finish-carpentry-installation/requirements/structural-7/",
  scope:
    "Primary industry standard used here only for installation, attachment, and structural-coordination context. It does not certify a wall, fastener, rail, or cabinet assembly for a specific load.",
};

const USDA_WOOD_HANDBOOK_SOURCE = {
  name: "USDA Forest Products Laboratory – Wood Handbook, Chapter 11",
  url: "https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr282/chapter_11_fpl_gtr282.pdf",
  scope:
    "Primary government reference for wood-based composite material characteristics. It supports material-behavior checks, not project-specific span, load, machining, or fastening approval.",
};

const BLUM_CONFIGURATOR_SOURCE = {
  name: "Blum Product Configurator",
  url: "https://www.blum.com/us/en/services/e-services/onlineproductconfigurator/",
  scope:
    "Primary manufacturer resource for current Blum product selection and application data. It governs only the exact Blum product and revision selected; it is not a generic hardware standard.",
};

const sharedAssumptions = [
  "This is a reviewable planning model, not a universal cabinetmaking standard; the shop drawing, approved sample, field dimensions, and contract documents remain authoritative.",
  "Manufacturer hardware dimensions, load ratings, fastener schedules, edge distances, and drilling requirements govern whenever hardware is involved.",
];

const sharedChecks = [
  "Measure the actual sheet, board, or panel thickness from the material lot and reconcile it with every mating groove, dado, fastener, and hardware allowance.",
  "Build or dry-fit the first assembly, record the verified result, and release the remaining batch only under the same model revision.",
];

const sharedStopConditions = [
  "Stop when the exact hardware product, current manufacturer data, or required attachment method is unresolved; do not substitute a generic allowance.",
  "Stop when field dimensions, actual material thickness, grain requirement, or model revision cannot be verified before batch cutting.",
];

const sharedMistakes = [
  "Treating nominal material thickness as measured thickness and carrying the resulting error through every fitted component.",
  "Releasing an entire batch before a first-piece dry fit proves the dimension chain, orientation, and assembly sequence.",
];

function defineModel(config) {
  return {
    ...config,
    assumptions: [...config.assumptions, ...sharedAssumptions],
    checks: [...config.checks, ...sharedChecks],
    stopConditions: [...config.stopConditions, ...sharedStopConditions],
    mistakes: [...config.mistakes, ...sharedMistakes],
    modelVersion: MODEL_VERSION,
    reviewedDate: REVIEWED_DATE,
  };
}

function localLink(href, label, kind, description) {
  return { href, label, kind, description };
}

export const componentCategories = [
  {
    slug: "cabinet-structure",
    name: "Cabinet Structure",
    title: "Cabinet Structure Cut List Models",
    description:
      "Auditable cut-list models for face frames, toe-kick platforms, stretchers, nailers, and partitions, with explicit dimension chains and release gates.",
    workflow: [
      "Freeze the cabinet envelope, reference faces, construction method, and actual material thickness.",
      "Select the component model and enter only measured or drawing-controlled inputs.",
      "Review every formula note and trace each allowance back to a drawing, sample, or named manufacturer document.",
      "Cut and dry-fit one assembly before releasing repeat parts or nested sheets.",
    ],
    evidence: [
      "Dated field-measurement or approved-shop-drawing record for the cabinet envelope.",
      "Material-lot thickness record tied to the panels or stock being cut.",
      "First-piece dry-fit result with the model version and any approved corrections.",
      "Hardware or attachment document identified by manufacturer, product, and revision when applicable.",
    ],
    stopConditions: [
      "The cabinet envelope or reference-face convention is still changing.",
      "Actual material thickness differs from the drawing and the joinery has not been reconciled.",
      "A load-bearing, anchoring, or hardware allowance is based on habit rather than approved project or manufacturer data.",
      "The first-piece assembly does not close, square, or align within the project tolerance.",
    ],
  },
  {
    slug: "shelves-and-backs",
    name: "Shelves and Backs",
    title: "Shelf and Cabinet Back Cut List Models",
    description:
      "Reviewable models for fixed shelves, adjustable shelf packs, applied backs, and captured backs, including fit, groove, clearance, and material checks.",
    workflow: [
      "Measure the finished inside opening after the carcass construction method is fixed.",
      "Choose fixed, adjustable, applied, or captured construction and identify every groove or clearance separately.",
      "Calculate the planning sizes, then compare span, load, grain, and edge treatment with the material and project requirements.",
      "Trial-fit one shelf or back before copying the model across a cabinet run.",
    ],
    evidence: [
      "Finished inside-opening measurements at the locations the component will occupy.",
      "Groove, dado, pin, edge-banding, and material-thickness records for the actual assembly.",
      "Shelf load and span decision supported by project requirements or an approved engineering/manufacturer source.",
      "First-piece fit evidence showing insertion path, clearance, and final seating.",
    ],
    stopConditions: [
      "The carcass is not square enough for one rectangular component to fit the measured opening.",
      "Shelf load, span, material grade, or support method has not been approved.",
      "Back groove depth or actual back thickness is unknown.",
      "The installation sequence would trap the component before it can be inserted or fastened.",
    ],
  },
  {
    slug: "fronts-panels-installation",
    name: "Fronts, Panels, and Installation",
    title: "Cabinet Front, Panel, and Installation Cut List Models",
    description:
      "Planning models for fillers, drawer-front grids, finished ends, and hanging rails, with reveal, scribe, field-fit, hardware, and attachment controls.",
    workflow: [
      "Record the installed or approved opening, reveal datum, finished face, and field obstructions.",
      "Enter controlled gaps and allowances separately so they remain visible during review.",
      "Resolve finish, grain continuity, edge treatment, hardware, and anchorage before material release.",
      "Template or trial-fit the first visible or installation-critical component before batch fabrication.",
    ],
    evidence: [
      "Field template or dated opening measurements referenced to a named finished face.",
      "Approved reveal, grain, finish, edge, and sequence requirements for visible components.",
      "Current hardware or attachment instructions for every product that affects size or load transfer.",
      "First-piece visual and installation fit record tied to the released model revision.",
    ],
    stopConditions: [
      "Walls, floors, adjacent fronts, or finish thicknesses are not stable enough to define the visible gap.",
      "Grain match or sequencing is required but the sheet layout and part IDs are not frozen.",
      "Hardware geometry or adjustment range is unresolved.",
      "Hanging or attachment work lacks verified substrate, fastener, load, or engineering information.",
    ],
  },
];

export const componentModels = [
  defineModel({
    slug: "face-frame-cut-list-calculator",
    categorySlug: "cabinet-structure",
    name: "Face Frame",
    title: "Face Frame Cut List Calculator",
    description:
      "Plan face-frame stiles and rails from the cabinet envelope, member widths, and opening layout while preserving an auditable first-piece release.",
    h1: "Face Frame Cut List Calculator",
    intro:
      "Build a traceable face-frame planning cut list from explicit cabinet and member dimensions. This is a reviewable planning model, not a universal standard; joint geometry, reveals, hardware, and approved drawings govern the released size.",
    searchIntent: "face frame cut list calculator",
    whatItBuilds:
      "Two full-height outer stiles, top and bottom rails between them, plus user-controlled intermediate stiles and rails for a rectangular cabinet face frame.",
    inputs: [
      {
        id: "cabinetWidth",
        label: "Cabinet outside width",
        default: 30,
        min: 6,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Finished cabinet width at the face-frame reference plane.",
      },
      {
        id: "cabinetHeight",
        label: "Cabinet outside height",
        default: 34.5,
        min: 6,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Full face-frame height before any project-specific scribe or installation trimming.",
      },
      {
        id: "stileWidth",
        label: "Stile width",
        default: 1.5,
        min: 0.5,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Finished width of both outer and intermediate vertical members.",
      },
      {
        id: "railWidth",
        label: "Rail width",
        default: 1.5,
        min: 0.5,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Finished width of top, bottom, and intermediate horizontal members.",
      },
      {
        id: "materialThickness",
        label: "Frame stock thickness",
        default: 0.75,
        min: 0.25,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness of the prepared face-frame stock.",
      },
      {
        id: "openingCount",
        label: "Opening columns",
        default: 2,
        min: 1,
        max: 12,
        step: 1,
        unit: "count",
        help: "Number of horizontal opening columns; one fewer intermediate stile is planned.",
      },
      {
        id: "middleRailCount",
        label: "Intermediate rails",
        default: 1,
        min: 0,
        max: 12,
        step: 1,
        unit: "count",
        help: "Count of intermediate rails; set the actual approved layout rather than inferring drawer positions.",
      },
    ],
    parts: [
      {
        name: "Outer stile",
        quantity: "2",
        length: "cabinetHeight",
        width: "stileWidth",
        thickness: "materialThickness",
        materialGroup: "Face-frame stock",
        grain: "Lengthwise",
        formulaNote: "Outer stiles run the full cabinet height in this planning model.",
      },
      {
        name: "Top and bottom rail",
        quantity: "2",
        length: "cabinetWidth - 2 * stileWidth",
        width: "railWidth",
        thickness: "materialThickness",
        materialGroup: "Face-frame stock",
        grain: "Lengthwise",
        formulaNote:
          "Rails fit between full-height outer stiles; joinery shoulders, tenons, or pocket-screw setbacks are not added automatically.",
      },
      {
        name: "Intermediate stile",
        quantity: "openingCount - 1",
        length: "cabinetHeight - 2 * railWidth",
        width: "stileWidth",
        thickness: "materialThickness",
        materialGroup: "Face-frame stock",
        grain: "Lengthwise",
        formulaNote:
          "The model adds one fewer intermediate stile than opening columns, so a single opening correctly produces no intermediate stile.",
      },
      {
        name: "Intermediate rail",
        quantity: "middleRailCount",
        length: "cabinetWidth - 2 * stileWidth",
        width: "railWidth",
        thickness: "materialThickness",
        materialGroup: "Face-frame stock",
        grain: "Lengthwise",
        formulaNote:
          "Intermediate rails use the clear width between outer stiles; split openings and joint extensions require a project-specific revision.",
      },
    ],
    measurementSteps: [
      "Name the face-frame reference plane and record the finished cabinet width at the top, middle, and bottom.",
      "Record the finished frame height on both sides and resolve any deliberate installation scribe before modeling.",
      "Mill sample stock, then measure the actual stile width, rail width, and thickness after surfacing.",
      "Lay out every opening, centerline, overlay, inset, and hardware conflict on an approved elevation.",
      "Calculate the parts, cut one frame set, and clamp or dry-assemble it against the cabinet before batch release.",
    ],
    assumptions: [
      "Outer stiles run full height and all listed rails fit between those stiles.",
      "Intermediate stiles fit between the top and bottom rails; alternate joint stacks require edited formulas.",
      "Joinery extensions are excluded because mortise-and-tenon, cope-and-stick, dowel, biscuit, and pocket-screw workflows do not share one allowance.",
    ],
    checks: [
      "Confirm rail lengths plus two stile widths reproduce the approved cabinet width.",
      "Check intermediate-member centerlines against door, drawer, hinge, slide, and appliance clearances.",
      "Verify the clamped frame is square by comparing diagonals and confirming the required cabinet reveal.",
    ],
    stopConditions: [
      "Stop when the face-frame joint type or required joint extension is not yet selected.",
      "Stop when the opening elevation conflicts with hinge cups, drawer slides, pullouts, or appliance clearances.",
    ],
    mistakes: [
      "Adding a generic tenon length to every rail even when the selected joint does not use that geometry.",
      "Centering intermediate members visually without checking the net openings and hardware envelopes.",
    ],
    faqs: [
      {
        question: "Does the calculator add tenons or cope-and-stick allowances?",
        answer:
          "No. It reports planning member sizes to the stated frame boundaries. Add joint extensions only from the approved tooling and joint detail.",
      },
      {
        question: "Can the intermediate stile count be used for unequal openings?",
        answer:
          "The count creates parts, but it does not position them. Record unequal opening centerlines on the elevation and verify every net opening separately.",
      },
      {
        question: "Should a wall-side scribe stile be wider?",
        answer:
          "Only when the field condition and installation detail require it. Model that stile as a controlled project revision rather than hiding it inside a generic allowance.",
      },
    ],
    relatedSlugs: [
      "stretcher-nailer-cut-list-calculator",
      "divider-partition-cut-list-calculator",
      "drawer-front-grid-calculator",
    ],
    links: [
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Plan the surrounding cabinet box before locking the face-frame envelope.",
      ),
      localLink(
        "/learn/cabinet-dimension-chain-from-opening-to-parts/",
        "Cabinet Dimension Chain Guide",
        "Learn",
        "Trace the opening-to-part dimension chain used during model review.",
      ),
      localLink(
        "/worksheets/face-frame-assembly-record/",
        "Face Frame Assembly Record",
        "Worksheet",
        "Record stock, diagonals, joint decisions, and first-piece results.",
      ),
      localLink(
        "/checklists/cut-list-revision-release/",
        "Cut List Revision Release",
        "Checklist",
        "Release the verified face-frame revision without mixing old dimensions.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE],
  }),

  defineModel({
    slug: "toe-kick-platform-cut-list-calculator",
    categorySlug: "cabinet-structure",
    name: "Toe-Kick Platform",
    title: "Toe-Kick Platform Cut List Calculator",
    description:
      "Plan toe-kick platform rails and sleepers from the cabinet footprint, setbacks, platform height, and an explicit support-spacing input.",
    h1: "Toe-Kick Platform Cut List Calculator",
    intro:
      "Create a reviewable platform-frame cut list for a cabinet toe-kick footprint. This planning model is not a universal structural or cabinet standard; verified floor, load, attachment, project, and material requirements govern.",
    searchIntent: "toe kick platform cut list calculator",
    whatItBuilds:
      "Two long platform rails, two end sleepers, and user-spaced intermediate sleepers within a recessed cabinet footprint.",
    inputs: [
      {
        id: "cabinetWidth",
        label: "Cabinet outside width",
        default: 30,
        min: 6,
        max: 144,
        step: 0.0625,
        unit: "in",
        help: "Outside width of the cabinet or platform module.",
      },
      {
        id: "cabinetDepth",
        label: "Cabinet outside depth",
        default: 24,
        min: 6,
        max: 60,
        step: 0.0625,
        unit: "in",
        help: "Outside cabinet depth before the front recess is deducted.",
      },
      {
        id: "platformHeight",
        label: "Platform height",
        default: 4,
        min: 1,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Finished vertical height of the platform members.",
      },
      {
        id: "frontSetback",
        label: "Front toe-kick setback",
        default: 3,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Horizontal recess from cabinet front to the platform front edge.",
      },
      {
        id: "sideSetback",
        label: "Setback at each side",
        default: 0.75,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Equal planning inset from each cabinet side; set zero for flush module ends.",
      },
      {
        id: "materialThickness",
        label: "Platform stock thickness",
        default: 0.75,
        min: 0.25,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured thickness of the platform rails and sleepers.",
      },
      {
        id: "supportSpacing",
        label: "Planning support spacing",
        default: 24,
        min: 6,
        max: 48,
        step: 1,
        unit: "in",
        help: "User-controlled maximum planning interval used only to estimate intermediate sleeper count.",
      },
    ],
    parts: [
      {
        name: "Front and rear platform rail",
        quantity: "2",
        length: "cabinetWidth - 2 * sideSetback",
        width: "platformHeight",
        thickness: "materialThickness",
        materialGroup: "Platform stock",
        grain: "Lengthwise",
        formulaNote: "Long rails span the inset platform width.",
      },
      {
        name: "End sleeper",
        quantity: "2",
        length: "cabinetDepth - frontSetback - 2 * materialThickness",
        width: "platformHeight",
        thickness: "materialThickness",
        materialGroup: "Platform stock",
        grain: "Lengthwise",
        formulaNote:
          "Sleepers fit between front and rear rails after the front toe-kick recess; rear recesses require a separate input revision.",
      },
      {
        name: "Intermediate sleeper",
        quantity: "max(0, ceil((cabinetWidth - 2 * sideSetback) / supportSpacing) - 1)",
        length: "cabinetDepth - frontSetback - 2 * materialThickness",
        width: "platformHeight",
        thickness: "materialThickness",
        materialGroup: "Platform stock",
        grain: "Lengthwise",
        formulaNote:
          "Count is a planning estimate from entered spacing, not a structural prescription; approved load and attachment information controls.",
      },
    ],
    measurementSteps: [
      "Measure the cabinet footprint and identify whether the platform is one module or a continuous run.",
      "Map the finished floor high point, low point, slope, obstructions, and required leveling method.",
      "Record front and side recesses from the same finished cabinet faces used on the elevation.",
      "Confirm actual platform-stock thickness and the assembly method before calculating sleeper length.",
      "Dry-fit or template one platform, confirm level and load path, then release repeated modules.",
    ],
    assumptions: [
      "Front and rear rails use the same thickness and the sleepers fit between them.",
      "The rear platform edge is flush with the modeled cabinet depth; a service chase or rear recess must be modeled separately.",
      "Support spacing estimates part quantity only and does not establish allowable load, deflection, fastener capacity, or substrate adequacy.",
    ],
    checks: [
      "Confirm platform width plus both side setbacks reproduces the intended cabinet width.",
      "Check the floor survey and leveling plan before treating every vertical member as the same height.",
      "Verify sleepers, seams, cabinet sides, fastening points, and concentrated loads share an approved load path.",
    ],
    stopConditions: [
      "Stop when the floor condition or leveling method would change platform member heights.",
      "Stop when load, span, anchorage, or substrate information has not been approved for the project.",
    ],
    mistakes: [
      "Using a familiar sleeper spacing as if it were a verified structural capacity.",
      "Deducting the front recess twice by mixing cabinet-depth and platform-depth reference planes.",
    ],
    faqs: [
      {
        question: "Is the support-spacing input a code or engineering value?",
        answer:
          "No. It only estimates a planning count. Project loads, material capacity, fastening, substrate, and any required engineering govern the released platform.",
      },
      {
        question: "Does the model level the platform for an uneven floor?",
        answer:
          "No. Survey the finished floor and use the approved leveling or scribing method before cutting final vertical dimensions.",
      },
      {
        question: "Can several cabinets share one platform?",
        answer:
          "Yes when the approved installation detail supports it, but seams, cabinet boundaries, access, loads, and field handling must be modeled on the continuous run.",
      },
    ],
    relatedSlugs: [
      "stretcher-nailer-cut-list-calculator",
      "divider-partition-cut-list-calculator",
      "cabinet-hanging-rail-calculator",
    ],
    links: [
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Coordinate the platform footprint with the cabinet box.",
      ),
      localLink(
        "/learn/cabinet-box-squareness-before-cutting/",
        "Cabinet Box Squareness Before Cutting",
        "Learn",
        "Control the box geometry that will bear on the platform.",
      ),
      localLink(
        "/worksheets/material-group-specification/",
        "Material Group Specification",
        "Worksheet",
        "Record the platform stock and material-lot decisions.",
      ),
      localLink(
        "/checklists/material-thickness-verification/",
        "Material Thickness Verification",
        "Checklist",
        "Verify the measured stock thickness used by sleeper formulas.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, AWI_INSTALLATION_SOURCE],
  }),

  defineModel({
    slug: "stretcher-nailer-cut-list-calculator",
    categorySlug: "cabinet-structure",
    name: "Stretchers and Nailers",
    title: "Stretcher and Nailer Cut List Calculator",
    description:
      "Plan cabinet stretchers and nailers from inside width, end clearance, member widths, and explicit part counts without hiding attachment decisions.",
    h1: "Stretcher and Nailer Cut List Calculator",
    intro:
      "Calculate reviewable stretcher and nailer blanks between cabinet sides. This is a planning model, not a universal structural or installation standard; project loads, joint details, substrate, fasteners, and manufacturer instructions govern.",
    searchIntent: "cabinet stretcher nailer cut list calculator",
    whatItBuilds:
      "User-counted horizontal stretcher and nailer members sized between two cabinet sides with an explicit clearance at both ends.",
    inputs: [
      {
        id: "cabinetWidth",
        label: "Cabinet outside width",
        default: 30,
        min: 6,
        max: 144,
        step: 0.0625,
        unit: "in",
        help: "Outside cabinet width across both side panels.",
      },
      {
        id: "sideThickness",
        label: "Side panel thickness",
        default: 0.75,
        min: 0.25,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured thickness of each cabinet side.",
      },
      {
        id: "endClearance",
        label: "Clearance at each end",
        default: 0,
        min: 0,
        max: 1,
        step: 0.03125,
        unit: "in",
        help: "Deliberate fit clearance between the member and each side; do not use it to conceal a dimension error.",
      },
      {
        id: "stretcherWidth",
        label: "Stretcher face width",
        default: 3,
        min: 1,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Finished face width of each stretcher.",
      },
      {
        id: "nailerWidth",
        label: "Nailer face width",
        default: 4,
        min: 1,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Finished face width of each nailer.",
      },
      {
        id: "materialThickness",
        label: "Member thickness",
        default: 0.75,
        min: 0.25,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness shared by the listed members.",
      },
      {
        id: "stretcherCount",
        label: "Stretcher count",
        default: 2,
        min: 1,
        max: 12,
        step: 1,
        unit: "count",
        help: "Count from the approved cabinet construction detail.",
      },
      {
        id: "nailerCount",
        label: "Nailer count",
        default: 1,
        min: 1,
        max: 12,
        step: 1,
        unit: "count",
        help: "Count from the approved cabinet and installation details.",
      },
    ],
    parts: [
      {
        name: "Stretcher",
        quantity: "stretcherCount",
        length: "cabinetWidth - 2 * sideThickness - 2 * endClearance",
        width: "stretcherWidth",
        thickness: "materialThickness",
        materialGroup: "Cabinet structural panel or stock",
        grain: "Lengthwise",
        formulaNote:
          "Length is the cabinet inside width minus deliberate end clearances; joint tongues or tenons are excluded.",
      },
      {
        name: "Nailer",
        quantity: "nailerCount",
        length: "cabinetWidth - 2 * sideThickness - 2 * endClearance",
        width: "nailerWidth",
        thickness: "materialThickness",
        materialGroup: "Approved nailer stock",
        grain: "Lengthwise",
        formulaNote:
          "The model sizes the blank only. Attachment capacity, fastener layout, and wall connection are separate approvals.",
      },
    ],
    measurementSteps: [
      "Confirm the cabinet outside width and identify the two side faces that bound each member.",
      "Measure both side panels from the actual material lot after surfacing or panel selection.",
      "Record the exact joint type, joint extension, installation role, and allowable fit clearance for each member.",
      "Map sinks, appliances, drawers, slides, plumbing, access, and wall attachments before fixing member locations.",
      "Cut and dry-fit one stretcher and nailer set, then document pull-up, squareness, and fastening access.",
    ],
    assumptions: [
      "Both cabinet sides use the same measured thickness and the listed members fit between them.",
      "Stretcher and nailer blanks use the same thickness; different materials require separate model records.",
      "Member width and quantity come from the approved construction and installation design, not from this calculator.",
    ],
    checks: [
      "Confirm member length plus both side thicknesses and clearances reproduces the cabinet outside width.",
      "Check every member location against drawer-slide, appliance, plumbing, sink, top-fastening, and access envelopes.",
      "Verify the selected joint and fastener pattern have the required edge distance and installation access.",
    ],
    stopConditions: [
      "Stop when the stretcher or nailer is expected to carry load without an approved material, joint, and load path.",
      "Stop when the wall substrate, fastener, attachment spacing, or installation responsibility is unresolved.",
    ],
    mistakes: [
      "Calling every horizontal strip a nailer and assuming it is suitable for wall attachment.",
      "Subtracting nominal side thickness while machining a groove or joint to a different measured panel thickness.",
    ],
    faqs: [
      {
        question: "Does nailer width determine wall-attachment capacity?",
        answer:
          "No. Capacity depends on the full assembly, material, fastener, edge distance, substrate, spacing, installation, and project requirements.",
      },
      {
        question: "Should joint tongues be added to the calculated length?",
        answer:
          "Only from the approved joint detail and tooling setup. The listed formula reports the clear blank between side reference faces.",
      },
      {
        question: "Can stretchers and nailers use different thicknesses?",
        answer:
          "Yes, but model them as separate controlled records because the shared thickness input intentionally describes one material setup.",
      },
    ],
    relatedSlugs: [
      "face-frame-cut-list-calculator",
      "toe-kick-platform-cut-list-calculator",
      "cabinet-hanging-rail-calculator",
    ],
    links: [
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Coordinate member lengths with the complete cabinet dimension chain.",
      ),
      localLink(
        "/learn/cabinet-dimension-chain-from-opening-to-parts/",
        "Cabinet Dimension Chain Guide",
        "Learn",
        "Review side-thickness deductions and reference faces.",
      ),
      localLink(
        "/checklists/cut-list-revision-release/",
        "Cut List Revision Release",
        "Checklist",
        "Control revised member sizes after the first-piece fit.",
      ),
      localLink(
        "/troubleshooting/cabinet-doors-collide/",
        "Cabinet Door Collision Troubleshooting",
        "Troubleshooting",
        "Trace member-location or opening changes that affect door clearance.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, AWI_INSTALLATION_SOURCE],
  }),

  defineModel({
    slug: "divider-partition-cut-list-calculator",
    categorySlug: "cabinet-structure",
    name: "Divider and Partition",
    title: "Divider and Partition Cut List Calculator",
    description:
      "Plan vertical cabinet dividers from the clear interior, top and bottom clearances, front setback, back clearance, and measured panel thickness.",
    h1: "Divider and Partition Cut List Calculator",
    intro:
      "Create a reviewable vertical-divider cut list inside a known cabinet opening. This planning model is not a universal standard; joint engagement, load, hardware, opening layout, and project tolerances remain controlled decisions.",
    searchIntent: "cabinet divider partition cut list calculator",
    whatItBuilds:
      "One or more rectangular vertical partition panels reduced by explicit top, bottom, front, and back allowances.",
    inputs: [
      {
        id: "insideHeight",
        label: "Finished inside height",
        default: 33,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Clear cabinet height between the modeled top and bottom reference faces.",
      },
      {
        id: "insideDepth",
        label: "Finished inside depth",
        default: 23.25,
        min: 3,
        max: 60,
        step: 0.0625,
        unit: "in",
        help: "Clear cabinet depth before front and back allowances.",
      },
      {
        id: "dividerCount",
        label: "Divider count",
        default: 1,
        min: 1,
        max: 24,
        step: 1,
        unit: "count",
        help: "Number of identical divider blanks in this controlled opening group.",
      },
      {
        id: "topClearance",
        label: "Top clearance",
        default: 0,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Deliberate clearance below the top reference face; joint engagement is not represented by a negative clearance.",
      },
      {
        id: "bottomClearance",
        label: "Bottom clearance",
        default: 0,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Deliberate clearance above the bottom reference face.",
      },
      {
        id: "frontSetback",
        label: "Front setback",
        default: 0.75,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Distance from the cabinet front reference face to the divider front edge.",
      },
      {
        id: "backClearance",
        label: "Back clearance",
        default: 0.25,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Distance from divider back edge to the inside back reference face.",
      },
      {
        id: "materialThickness",
        label: "Divider thickness",
        default: 0.75,
        min: 0.125,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness of the divider material.",
      },
    ],
    parts: [
      {
        name: "Vertical divider",
        quantity: "dividerCount",
        length: "insideHeight - topClearance - bottomClearance",
        width: "insideDepth - frontSetback - backClearance",
        thickness: "materialThickness",
        materialGroup: "Cabinet panel",
        grain: "Vertical",
        formulaNote:
          "The panel fits inside the stated opening after explicit clearances. Dado, groove, tenon, or dowel engagement must be added from the approved joint detail.",
      },
    ],
    measurementSteps: [
      "Measure inside height at the front, middle, and back after the cabinet reference faces are defined.",
      "Measure inside depth at each divider location and identify the front and back datum surfaces.",
      "Record face-frame, door, drawer, slide, shelf-pin, back-panel, and service clearances on the elevation and section.",
      "Measure the actual divider thickness and identify any edge banding or face build-up that changes the finished opening.",
      "Template or dry-fit the first divider with its shelves, slides, or doors before releasing duplicates.",
    ],
    assumptions: [
      "The divider is a rectangular panel installed inside a rectangular clear opening.",
      "Top and bottom inputs are fit clearances only; joint engagement is excluded from the generic formula.",
      "All dividers in one model record are identical and share the same opening, material, grain, and edge treatment.",
    ],
    checks: [
      "Confirm top and bottom clearances leave the intended net divider length without weakening the selected joint.",
      "Verify front setback and back clearance preserve door, drawer, shelf, back, service, and finished-face relationships.",
      "Check divider centerlines against the required net opening widths on both sides rather than centering by habit.",
    ],
    stopConditions: [
      "Stop when the divider is load-bearing and span, material, joint, or support requirements are unresolved.",
      "Stop when doors, drawers, slides, pullouts, or shelf-pin systems do not have a frozen clearance envelope.",
    ],
    mistakes: [
      "Using one inside-height measurement in a cabinet that is twisted or out of square.",
      "Treating front setback as a decorative choice without tracing door, drawer, and hardware clearances.",
    ],
    faqs: [
      {
        question: "Does the divider formula include a dado or groove tongue?",
        answer:
          "No. The formula reports the panel inside the stated opening. Add engagement only from the approved joint detail and measured groove setup.",
      },
      {
        question: "Can every divider in a wide cabinet use one size?",
        answer:
          "Only after verifying each location shares the same opening, squareness, hardware, back, edge, and assembly conditions.",
      },
      {
        question: "How should a divider behind a face-frame stile be positioned?",
        answer:
          "Use the approved elevation and section to define its centerline and face relationship; the calculator sizes the panel but does not position it.",
      },
    ],
    relatedSlugs: [
      "stretcher-nailer-cut-list-calculator",
      "fixed-shelf-cut-list-calculator",
      "captured-back-panel-calculator",
    ],
    links: [
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Plan the cabinet box that establishes the divider opening.",
      ),
      localLink(
        "/learn/cabinet-dimension-chain-from-opening-to-parts/",
        "Cabinet Dimension Chain Guide",
        "Learn",
        "Trace clear openings, panel deductions, and reference faces.",
      ),
      localLink(
        "/shelf-spacing-calculator/",
        "Shelf Spacing Calculator",
        "Calculator",
        "Coordinate divider and shelf opening layouts.",
      ),
      localLink(
        "/checklists/material-thickness-verification/",
        "Material Thickness Verification",
        "Checklist",
        "Verify divider and mating-joint thicknesses before cutting.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE],
  }),

  defineModel({
    slug: "fixed-shelf-cut-list-calculator",
    categorySlug: "shelves-and-backs",
    name: "Fixed Shelf",
    title: "Fixed Shelf Cut List Calculator",
    description:
      "Plan fixed shelf panels from the clear cabinet opening, side-joint engagement, front and back setbacks, material thickness, and shelf count.",
    h1: "Fixed Shelf Cut List Calculator",
    intro:
      "Create an auditable fixed-shelf planning cut list with each fit allowance visible. This is a reviewable planning model, not a universal span or load standard; the approved material, load, joint, edge, and project requirements govern.",
    searchIntent: "fixed cabinet shelf cut list calculator",
    whatItBuilds:
      "Identical fixed shelf panels that engage equal-depth side dados or grooves and use explicit front and back setbacks.",
    inputs: [
      {
        id: "insideWidth",
        label: "Finished inside width",
        default: 28.5,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Clear width between the two cabinet side reference faces.",
      },
      {
        id: "insideDepth",
        label: "Finished inside depth",
        default: 23.25,
        min: 3,
        max: 60,
        step: 0.0625,
        unit: "in",
        help: "Clear depth from the front inside reference to the back inside reference.",
      },
      {
        id: "sideDadoDepth",
        label: "Dado engagement at each side",
        default: 0.25,
        min: 0,
        max: 1.5,
        step: 0.03125,
        unit: "in",
        help: "Verified shelf engagement beyond the clear opening into each side joint.",
      },
      {
        id: "frontSetback",
        label: "Front setback",
        default: 0.25,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Distance from the inside front reference to the shelf front edge.",
      },
      {
        id: "backSetback",
        label: "Back setback",
        default: 0.25,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Distance from the inside back reference to the shelf back edge.",
      },
      {
        id: "shelfThickness",
        label: "Shelf thickness",
        default: 0.75,
        min: 0.125,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished shelf thickness before any separate face build-up.",
      },
      {
        id: "shelfCount",
        label: "Fixed shelf count",
        default: 2,
        min: 1,
        max: 24,
        step: 1,
        unit: "count",
        help: "Count of identical fixed shelves in the verified opening group.",
      },
    ],
    parts: [
      {
        name: "Fixed shelf",
        quantity: "shelfCount",
        length: "insideWidth + 2 * sideDadoDepth",
        width: "insideDepth - frontSetback - backSetback",
        thickness: "shelfThickness",
        materialGroup: "Shelf panel",
        grain: "Lengthwise across cabinet width",
        formulaNote:
          "Length adds equal verified engagement into both cabinet sides; fit clearance, stopped dado ends, and assembly sequence must be resolved separately.",
      },
    ],
    measurementSteps: [
      "Measure the finished inside width at the front and back of every planned shelf elevation.",
      "Measure inside depth from named front and back reference faces, including the installed back construction.",
      "Machine and gauge the actual dado or groove depth and width on sample material from the production setup.",
      "Record front setback, back setback, edge treatment, grain direction, shelf load, and assembly sequence.",
      "Cut and dry-fit one shelf through the real insertion path before releasing identical shelves.",
    ],
    assumptions: [
      "The shelf engages equal-depth side joints and the clear inside width is measured between the jointed side faces.",
      "Front and back setbacks are independent controlled dimensions rather than one generic depth deduction.",
      "Shelf count groups only components with the same span, material, load, grain, edge treatment, and joint setup.",
    ],
    checks: [
      "Confirm clear inside width plus both measured joint engagements equals the planned shelf length.",
      "Check shelf span, load, material grade, thickness, face build-up, and support method against the approved requirements.",
      "Verify the shelf can enter the carcass and seat fully without colliding with backs, frames, stretchers, or hardware.",
    ],
    stopConditions: [
      "Stop when shelf load, acceptable deflection, material capacity, or support method is unresolved.",
      "Stop when dado depth, groove width, assembly sequence, or installed back position has not been proven on a sample.",
    ],
    mistakes: [
      "Adding nominal dado depth without measuring the groove from the actual machining setup.",
      "Sizing for the largest opening in an out-of-square cabinet and assuming the shelf can seat at every joint.",
    ],
    faqs: [
      {
        question: "Does the calculator determine whether the shelf will sag?",
        answer:
          "No. It calculates a planning blank. Evaluate span, material, thickness, load, duration, edging, and support with an approved method before release.",
      },
      {
        question: "Why is the fixed shelf longer than the clear inside width?",
        answer:
          "The formula adds the entered engagement into both side joints. Set engagement to zero only when the approved construction does not capture the shelf.",
      },
      {
        question: "Does the formula include fit clearance in the dados?",
        answer:
          "No generic fit clearance is hidden in the result. Prove the actual groove and shelf setup, then revise the controlled input or joint detail explicitly.",
      },
    ],
    relatedSlugs: [
      "adjustable-shelf-pack-calculator",
      "captured-back-panel-calculator",
      "divider-partition-cut-list-calculator",
    ],
    links: [
      localLink(
        "/shelf-spacing-calculator/",
        "Shelf Spacing Calculator",
        "Calculator",
        "Plan the shelf elevations after the blank size is controlled.",
      ),
      localLink(
        "/shelf-sag-calculator/",
        "Shelf Sag Calculator",
        "Calculator",
        "Review span and load separately from the cut-size formula.",
      ),
      localLink(
        "/learn/cabinet-dimension-chain-from-opening-to-parts/",
        "Cabinet Dimension Chain Guide",
        "Learn",
        "Trace opening width and joint engagement to the shelf blank.",
      ),
      localLink(
        "/checklists/material-thickness-verification/",
        "Material Thickness Verification",
        "Checklist",
        "Verify shelf and groove dimensions from production material.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, USDA_WOOD_HANDBOOK_SOURCE],
  }),

  defineModel({
    slug: "adjustable-shelf-pack-calculator",
    categorySlug: "shelves-and-backs",
    name: "Adjustable Shelf Pack",
    title: "Adjustable Shelf Pack Calculator",
    description:
      "Plan an adjustable shelf batch from clear opening dimensions, equal side clearances, front and back setbacks, material thickness, and quantity.",
    h1: "Adjustable Shelf Pack Calculator",
    intro:
      "Generate a reviewable pack of adjustable shelf blanks from one verified opening group. This is a planning model, not a universal fit, load, or hardware standard; pin, clip, span, material, and project data govern.",
    searchIntent: "adjustable cabinet shelf cut list calculator",
    whatItBuilds:
      "A user-counted pack of identical loose shelves with equal side clearance and separate front and back clearances.",
    inputs: [
      {
        id: "insideWidth",
        label: "Finished inside width",
        default: 28.5,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Clear width at the shelf locations after cabinet assembly.",
      },
      {
        id: "insideDepth",
        label: "Finished inside depth",
        default: 23.25,
        min: 3,
        max: 60,
        step: 0.0625,
        unit: "in",
        help: "Clear depth from the selected front datum to the inside back.",
      },
      {
        id: "sideClearance",
        label: "Clearance at each side",
        default: 0.125,
        min: 0,
        max: 1,
        step: 0.03125,
        unit: "in",
        help: "Deliberate clearance between shelf edge and each side; verify with the actual support hardware.",
      },
      {
        id: "frontSetback",
        label: "Front setback",
        default: 0.25,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Distance from the cabinet front datum to the shelf front edge.",
      },
      {
        id: "backClearance",
        label: "Back clearance",
        default: 0.25,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Clearance between the shelf back edge and installed back or obstruction.",
      },
      {
        id: "shelfThickness",
        label: "Shelf thickness",
        default: 0.75,
        min: 0.125,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness including any permanently bonded build-up.",
      },
      {
        id: "shelfCount",
        label: "Shelf quantity",
        default: 4,
        min: 1,
        max: 48,
        step: 1,
        unit: "count",
        help: "Number of identical shelves in the pack.",
      },
    ],
    parts: [
      {
        name: "Adjustable shelf",
        quantity: "shelfCount",
        length: "insideWidth - 2 * sideClearance",
        width: "insideDepth - frontSetback - backClearance",
        thickness: "shelfThickness",
        materialGroup: "Shelf panel",
        grain: "Lengthwise across cabinet width",
        formulaNote:
          "Equal side clearances are deducted from the clear opening; support-hardware projection, edge treatment, and load capacity are separate checks.",
      },
    ],
    measurementSteps: [
      "Measure inside width at several pin elevations and at the front and back of the shelf zone.",
      "Measure depth to the installed back and identify hinges, doors, frames, wiring, or other front and rear obstructions.",
      "Install or sample the exact shelf pins or clips and measure their bearing position and side projection.",
      "Record finished edge thickness, grain direction, shelf load, span, and required removal path.",
      "Cut one shelf, test it at the tightest opening and every support position, then release the pack.",
    ],
    assumptions: [
      "The same equal side clearance applies to all shelves in the modeled opening group.",
      "The inside back is installed and stable before the final shelf depth is released.",
      "Shelf pins or clips provide approved support without requiring an unmodeled notch, groove, or side projection.",
    ],
    checks: [
      "Confirm the finished shelf can be tilted or translated through the door and face-frame opening for installation and removal.",
      "Check the tightest measured opening rather than relying on the average inside width.",
      "Verify support hardware, span, load, edge treatment, and material capacity for every intended shelf elevation.",
    ],
    stopConditions: [
      "Stop when the shelf-pin or clip product and its required clearance or bearing geometry are unknown.",
      "Stop when allowable span, load, deflection, material grade, or edge reinforcement has not been approved.",
    ],
    mistakes: [
      "Using door-opening width as cabinet inside width without checking the actual shelf insertion path.",
      "Applying one side-clearance habit to support clips whose projection or adjustment range has not been measured.",
    ],
    faqs: [
      {
        question: "How much side clearance should an adjustable shelf have?",
        answer:
          "Use the entered value only after checking the actual opening, support hardware, edge treatment, movement, and desired removal fit. There is no universal value in this model.",
      },
      {
        question: "Does shelf quantity change the shelf size?",
        answer:
          "No. Quantity creates identical blanks. Use separate model records when openings, loads, materials, edges, or hardware differ.",
      },
      {
        question: "Does the shelf pack include edge-banding allowance?",
        answer:
          "No hidden allowance is added. Enter the required finished size and control any pre-band machining deduction in the production process.",
      },
    ],
    relatedSlugs: [
      "fixed-shelf-cut-list-calculator",
      "applied-back-panel-calculator",
      "captured-back-panel-calculator",
    ],
    links: [
      localLink(
        "/shelf-spacing-calculator/",
        "Shelf Spacing Calculator",
        "Calculator",
        "Plan adjustable elevations inside the verified opening.",
      ),
      localLink(
        "/shelf-sag-calculator/",
        "Shelf Sag Calculator",
        "Calculator",
        "Review span and load before approving the shelf pack.",
      ),
      localLink(
        "/material-library/",
        "Material Library",
        "Reference",
        "Compare material planning information without treating it as project approval.",
      ),
      localLink(
        "/checklists/material-thickness-verification/",
        "Material Thickness Verification",
        "Checklist",
        "Measure shelf stock before machining and hardware fit checks.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, USDA_WOOD_HANDBOOK_SOURCE],
  }),

  defineModel({
    slug: "applied-back-panel-calculator",
    categorySlug: "shelves-and-backs",
    name: "Applied Back Panel",
    title: "Applied Back Panel Calculator",
    description:
      "Plan an applied cabinet back from the outside envelope and explicit side, top, and bottom insets while keeping attachment and squaring decisions separate.",
    h1: "Applied Back Panel Calculator",
    intro:
      "Calculate a reviewable applied-back panel blank from named outside reference faces. This is a planning model, not a universal cabinet-back or attachment standard; joint, squaring, finish, service, and fastening requirements govern.",
    searchIntent: "applied cabinet back panel cut list calculator",
    whatItBuilds:
      "One or more rectangular back panels applied over the cabinet rear with equal side inset and separate top and bottom insets.",
    inputs: [
      {
        id: "cabinetWidth",
        label: "Cabinet outside width",
        default: 30,
        min: 3,
        max: 144,
        step: 0.0625,
        unit: "in",
        help: "Finished outside cabinet width at the rear application plane.",
      },
      {
        id: "cabinetHeight",
        label: "Cabinet outside height",
        default: 34.5,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Finished outside cabinet height at the rear application plane.",
      },
      {
        id: "sideInset",
        label: "Inset at each side",
        default: 0,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Equal distance from each cabinet side to the applied back edge.",
      },
      {
        id: "topInset",
        label: "Top inset",
        default: 0,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Distance from cabinet top to panel top edge.",
      },
      {
        id: "bottomInset",
        label: "Bottom inset",
        default: 0,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Distance from cabinet bottom to panel bottom edge.",
      },
      {
        id: "backThickness",
        label: "Back thickness",
        default: 0.25,
        min: 0.0625,
        max: 1.5,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness of the back panel.",
      },
      {
        id: "panelCount",
        label: "Panel quantity",
        default: 1,
        min: 1,
        max: 24,
        step: 1,
        unit: "count",
        help: "Count of identical applied backs in this verified cabinet group.",
      },
    ],
    parts: [
      {
        name: "Applied back panel",
        quantity: "panelCount",
        length: "cabinetHeight - topInset - bottomInset",
        width: "cabinetWidth - 2 * sideInset",
        thickness: "backThickness",
        materialGroup: "Cabinet back panel",
        grain: "Project-specified orientation",
        formulaNote:
          "The panel is reduced from the rear outside envelope by explicit insets; seam, rabbet, reveal, or overhang conditions need their own revision.",
      },
    ],
    measurementSteps: [
      "Define whether cabinet width and height are measured to carcass panels, finished ends, frames, or another rear reference.",
      "Measure rear width and height in several places and compare diagonals before using the back to square the cabinet.",
      "Record side, top, and bottom insets from the same approved detail and identify every visible rear edge.",
      "Map nailers, stretchers, services, ventilation, access panels, hanging hardware, and attachment zones.",
      "Cut one back, clamp it to the cabinet, verify square and attachment access, then release repeated panels.",
    ],
    assumptions: [
      "The back is a rectangular overlay on one rear plane and does not enter side, top, or bottom grooves.",
      "Equal side inset applies; unequal reveals, rabbets, overhangs, or scribe conditions require a separate model.",
      "Panel count groups only cabinets with the same rear envelope, material, grain, finish, services, and attachment pattern.",
    ],
    checks: [
      "Confirm the proposed back dimensions and cabinet diagonals allow the approved squaring and fastening sequence.",
      "Check every edge has adequate bearing and fastening distance without colliding with grooves, nailers, or hardware.",
      "Verify services, ventilation, access, wall clearance, finish, and grain orientation before cutting the panel.",
    ],
    stopConditions: [
      "Stop when the applied back is expected to brace or carry load without an approved material and attachment design.",
      "Stop when rear services, hanging hardware, nailers, access openings, or installation clearances are unresolved.",
    ],
    mistakes: [
      "Measuring the front cabinet envelope and assuming the rear is identical despite rabbets, applied ends, or frame projections.",
      "Using the back to force a cabinet square without confirming the approved squaring sequence and attachment capacity.",
    ],
    faqs: [
      {
        question: "Does zero inset mean the back is flush with every cabinet edge?",
        answer:
          "It means the formula matches the entered rear envelope. Verify what those reference faces include before treating the result as a finished flush condition.",
      },
      {
        question: "Can an applied back square the cabinet?",
        answer:
          "It may participate in squaring when the approved construction and fastening detail allows it, but this size model does not establish bracing or attachment capacity.",
      },
      {
        question: "Does the model create service cutouts?",
        answer:
          "No. Record and verify service, access, ventilation, and hardware openings separately after coordinating their exact installed locations.",
      },
    ],
    relatedSlugs: [
      "captured-back-panel-calculator",
      "finished-end-panel-calculator",
      "adjustable-shelf-pack-calculator",
    ],
    links: [
      localLink(
        "/learn/cabinet-back-construction-dimension-guide/",
        "Cabinet Back Construction Dimension Guide",
        "Learn",
        "Compare applied and captured back dimension chains.",
      ),
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Coordinate the back with the complete cabinet box.",
      ),
      localLink(
        "/worksheets/material-group-specification/",
        "Material Group Specification",
        "Worksheet",
        "Record back material, grain, finish, and lot decisions.",
      ),
      localLink(
        "/checklists/cut-list-revision-release/",
        "Cut List Revision Release",
        "Checklist",
        "Release service openings and final back dimensions under one revision.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, USDA_WOOD_HANDBOOK_SOURCE],
  }),

  defineModel({
    slug: "captured-back-panel-calculator",
    categorySlug: "shelves-and-backs",
    name: "Captured Back Panel",
    title: "Captured Back Panel Calculator",
    description:
      "Plan a captured cabinet back from the clear opening, groove engagement on four edges, total fit clearance, and measured back thickness.",
    h1: "Captured Back Panel Calculator",
    intro:
      "Calculate a traceable captured-back blank from the clear rear opening and verified groove setup. This planning model is not a universal fit or structural standard; material movement, joint geometry, assembly, and project requirements govern.",
    searchIntent: "captured cabinet back panel cut list calculator",
    whatItBuilds:
      "A rectangular back panel captured in equal-depth side grooves and equal-depth top and bottom grooves with one explicit total fit clearance.",
    inputs: [
      {
        id: "insideWidth",
        label: "Clear rear opening width",
        default: 28.5,
        min: 3,
        max: 144,
        step: 0.0625,
        unit: "in",
        help: "Clear width between the inner groove-entry reference faces.",
      },
      {
        id: "insideHeight",
        label: "Clear rear opening height",
        default: 33,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Clear height between the inner groove-entry reference faces.",
      },
      {
        id: "sideGrooveDepth",
        label: "Side groove depth",
        default: 0.25,
        min: 0,
        max: 1.5,
        step: 0.03125,
        unit: "in",
        help: "Verified engagement into each side groove.",
      },
      {
        id: "topBottomGrooveDepth",
        label: "Top and bottom groove depth",
        default: 0.25,
        min: 0,
        max: 1.5,
        step: 0.03125,
        unit: "in",
        help: "Verified engagement into both top and bottom grooves.",
      },
      {
        id: "fitClearance",
        label: "Total fit clearance",
        default: 0.0625,
        min: 0,
        max: 1,
        step: 0.03125,
        unit: "in",
        help: "Total deduction across each full panel dimension, not a per-edge value.",
      },
      {
        id: "backThickness",
        label: "Back thickness",
        default: 0.25,
        min: 0.0625,
        max: 1.5,
        step: 0.03125,
        unit: "in",
        help: "Measured panel thickness matched to the production groove width.",
      },
      {
        id: "panelCount",
        label: "Panel quantity",
        default: 1,
        min: 1,
        max: 24,
        step: 1,
        unit: "count",
        help: "Count of identical captured backs in one verified construction group.",
      },
    ],
    parts: [
      {
        name: "Captured back panel",
        quantity: "panelCount",
        length: "insideHeight + 2 * topBottomGrooveDepth - fitClearance",
        width: "insideWidth + 2 * sideGrooveDepth - fitClearance",
        thickness: "backThickness",
        materialGroup: "Cabinet back panel",
        grain: "Project-specified orientation",
        formulaNote:
          "The blank adds engagement into four grooves and deducts one total clearance from each overall dimension.",
      },
    ],
    measurementSteps: [
      "Measure the clear rear opening between the actual groove-entry faces at several locations.",
      "Machine sample grooves in the production material and measure their depth, width, runout, and corner condition.",
      "Measure the actual back thickness and test its movement and fit in the sample groove.",
      "Record assembly direction, glue strategy, panel movement requirement, grain, finish, and service openings.",
      "Dry-assemble one carcass with the captured back, check diagonals and seating, then release duplicates.",
    ],
    assumptions: [
      "Opposing side grooves have equal engagement and opposing top and bottom grooves have equal engagement.",
      "Fit clearance is a total deduction from each completed panel dimension, not a deduction at every edge.",
      "All modeled backs share the same opening, groove setup, material lot, grain, finish, and assembly sequence.",
    ],
    checks: [
      "Confirm groove-bottom dimensions minus the stated total clearance reproduce the calculated panel dimensions.",
      "Verify actual back thickness fits the production groove without forcing, rattle, damage, or blocked movement.",
      "Check the panel can enter every groove in the planned assembly sequence and still permit the carcass to square.",
    ],
    stopConditions: [
      "Stop when the groove setup, corner geometry, panel movement, glue strategy, or assembly order has not been tested.",
      "Stop when the back is expected to brace, carry, or transfer load without an approved material and joint design.",
    ],
    mistakes: [
      "Subtracting the total fit clearance at every edge and making the panel twice as loose as intended.",
      "Using nominal back thickness to choose a groove cutter without testing the actual production material.",
    ],
    faqs: [
      {
        question: "Is fit clearance entered per edge?",
        answer:
          "No. The input is the total deduction from the overall width and the total deduction from the overall height.",
      },
      {
        question: "Does the calculator allow for panel movement?",
        answer:
          "It exposes a fit-clearance input but does not select a movement allowance. Determine movement, grain, moisture, material, and glue requirements for the actual assembly.",
      },
      {
        question: "Can the captured back be used to square the carcass?",
        answer:
          "Only under the approved construction and assembly method. The model calculates size but does not establish bracing or joint capacity.",
      },
    ],
    relatedSlugs: [
      "applied-back-panel-calculator",
      "fixed-shelf-cut-list-calculator",
      "divider-partition-cut-list-calculator",
    ],
    links: [
      localLink(
        "/learn/cabinet-back-construction-dimension-guide/",
        "Cabinet Back Construction Dimension Guide",
        "Learn",
        "Review groove engagement and rear-opening reference planes.",
      ),
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Coordinate captured-back dimensions with the cabinet carcass.",
      ),
      localLink(
        "/learn/cabinet-dimension-chain-from-opening-to-parts/",
        "Cabinet Dimension Chain Guide",
        "Learn",
        "Audit the clear opening, groove engagement, and fit deduction.",
      ),
      localLink(
        "/checklists/material-thickness-verification/",
        "Material Thickness Verification",
        "Checklist",
        "Match the actual back panel to the production groove.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, USDA_WOOD_HANDBOOK_SOURCE],
  }),

  defineModel({
    slug: "filler-scribe-panel-calculator",
    categorySlug: "fronts-panels-installation",
    name: "Filler and Scribe Panel",
    title: "Filler and Scribe Panel Calculator",
    description:
      "Plan an intentionally oversized cabinet filler or scribe blank from the installed opening, nominal gap, scribe allowance, end clearances, and panel thickness.",
    h1: "Filler and Scribe Panel Calculator",
    intro:
      "Create a controlled filler or scribe blank that preserves material for field fitting. This is a reviewable planning model, not a universal installation standard; the field template, finished surfaces, sequence, and approved reveal govern.",
    searchIntent: "cabinet filler scribe panel calculator",
    whatItBuilds:
      "One or more full-height filler or scribe blanks sized to a nominal field gap plus a separate removable scribe allowance.",
    inputs: [
      {
        id: "openingHeight",
        label: "Installed opening height",
        default: 34.5,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Field-measured height between the finished top and bottom reference surfaces.",
      },
      {
        id: "nominalGap",
        label: "Nominal finished gap",
        default: 2,
        min: 0.125,
        max: 24,
        step: 0.0625,
        unit: "in",
        help: "Planning width between the cabinet reference edge and the adjacent finished surface before scribe allowance.",
      },
      {
        id: "scribeAllowance",
        label: "Removable scribe allowance",
        default: 0.75,
        min: 0,
        max: 6,
        step: 0.0625,
        unit: "in",
        help: "Extra blank width intentionally retained for field templating and trimming.",
      },
      {
        id: "topClearance",
        label: "Top clearance",
        default: 0.0625,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Deliberate finished clearance at the top of the fitted panel.",
      },
      {
        id: "bottomClearance",
        label: "Bottom clearance",
        default: 0.0625,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Deliberate finished clearance at the bottom of the fitted panel.",
      },
      {
        id: "panelThickness",
        label: "Panel thickness",
        default: 0.75,
        min: 0.125,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness of the filler or scribe material.",
      },
      {
        id: "panelCount",
        label: "Panel quantity",
        default: 1,
        min: 1,
        max: 24,
        step: 1,
        unit: "count",
        help: "Count of blanks that truly share one field condition and finish sequence.",
      },
    ],
    parts: [
      {
        name: "Filler or scribe blank",
        quantity: "panelCount",
        length: "openingHeight - topClearance - bottomClearance",
        width: "nominalGap + scribeAllowance",
        thickness: "panelThickness",
        materialGroup: "Finished filler panel",
        grain: "Vertical",
        formulaNote:
          "Width intentionally includes removable field-fit stock; the final scribe line comes from a verified template, not the formula.",
      },
    ],
    measurementSteps: [
      "Install or positively locate the cabinet and measure from its named finished edge to the adjacent finished surface.",
      "Measure the gap at the top, middle, bottom, front, and back, then identify the tightest condition and any twist.",
      "Measure opening height on both edges and record floor, ceiling, countertop, trim, caulk, and shadow-line requirements.",
      "Create a rigid template or controlled scribe reference and mark which edge remains factory straight.",
      "Cut one oversized blank, field-fit it through the approved sequence, then record the final allowance before duplicating.",
    ],
    assumptions: [
      "The nominal gap and scribe allowance describe an oversized rectangular blank, not the final irregular field edge.",
      "Top and bottom clearances are finished conditions measured between stable installed surfaces.",
      "All grouped panels share the same field geometry, grain, finish, edge treatment, attachment, and installation sequence.",
    ],
    checks: [
      "Confirm the blank width is greater than the widest required finished profile while preserving the approved visible reveal.",
      "Check doors, drawers, pulls, appliances, countertops, base, crown, caulk, and adjacent trim through their full movement and installation sequence.",
      "Verify the factory edge, finished face, grain direction, part ID, and scribe edge are unmistakably marked before trimming.",
    ],
    stopConditions: [
      "Stop when the cabinet or adjacent finished surface is not installed, stable, or located from an approved control line.",
      "Stop when the field variation exceeds the available scribe stock or would violate reveal, edge, finish, or hardware requirements.",
    ],
    mistakes: [
      "Cutting the blank to one midpoint measurement and losing the material needed at the widest part of an irregular wall.",
      "Scribing the wrong edge or face because the factory datum, grain direction, and installed orientation were not marked.",
    ],
    faqs: [
      {
        question: "Is scribe allowance the final visible filler width?",
        answer:
          "No. It is removable stock added to the nominal gap so a field template can establish the final irregular edge.",
      },
      {
        question: "Can one field measurement be used for several fillers?",
        answer:
          "Only when each location is proven identical. Walls, floors, finish build-up, and cabinet position commonly vary, so each field condition needs evidence.",
      },
      {
        question: "Does the calculator account for caulk or a shadow line?",
        answer:
          "Only if you explicitly incorporate the approved finished condition into the nominal gap or clearances. The formula does not select that detail.",
      },
    ],
    relatedSlugs: [
      "finished-end-panel-calculator",
      "face-frame-cut-list-calculator",
      "cabinet-hanging-rail-calculator",
    ],
    links: [
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Coordinate the filler datum with the installed cabinet envelope.",
      ),
      localLink(
        "/learn/cabinet-dimension-chain-from-opening-to-parts/",
        "Cabinet Dimension Chain Guide",
        "Learn",
        "Keep field gaps, finished faces, and cut sizes on one traceable chain.",
      ),
      localLink(
        "/worksheets/face-frame-assembly-record/",
        "Face Frame Assembly Record",
        "Worksheet",
        "Record the visible frame or filler relationship at the first assembly.",
      ),
      localLink(
        "/checklists/cut-list-revision-release/",
        "Cut List Revision Release",
        "Checklist",
        "Control field-fit revisions without overwriting shop blanks.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, AWI_INSTALLATION_SOURCE],
  }),

  defineModel({
    slug: "drawer-front-grid-calculator",
    categorySlug: "fronts-panels-installation",
    name: "Drawer Front Grid",
    title: "Drawer Front Grid Calculator",
    description:
      "Divide a finished opening into an equal drawer-front grid using explicit side reveals, top and bottom reveals, inter-front gaps, rows, columns, and thickness.",
    h1: "Drawer Front Grid Calculator",
    intro:
      "Plan equal drawer-front blanks and expose the complete reveal-and-gap arithmetic. This is a reviewable planning model, not a universal overlay or hardware standard; approved elevations, slide systems, adjustments, edge treatment, and manufacturer data govern.",
    searchIntent: "drawer front size grid calculator",
    whatItBuilds:
      "An equal rectangular grid of drawer fronts within one opening, using user-controlled rows, columns, perimeter reveals, and internal gaps.",
    inputs: [
      {
        id: "openingWidth",
        label: "Finished grid opening width",
        default: 30,
        min: 3,
        max: 144,
        step: 0.0625,
        unit: "in",
        help: "Finished width bounded by the approved left and right reveal reference faces.",
      },
      {
        id: "openingHeight",
        label: "Finished grid opening height",
        default: 24,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Finished height bounded by the approved top and bottom reveal reference faces.",
      },
      {
        id: "columnCount",
        label: "Equal columns",
        default: 2,
        min: 1,
        max: 12,
        step: 1,
        unit: "count",
        help: "Number of equal drawer-front columns in the modeled grid.",
      },
      {
        id: "rowCount",
        label: "Equal rows",
        default: 3,
        min: 1,
        max: 12,
        step: 1,
        unit: "count",
        help: "Number of equal drawer-front rows in the modeled grid.",
      },
      {
        id: "sideReveal",
        label: "Left and right reveal",
        default: 0.125,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Equal finished reveal at the outside left and right boundaries.",
      },
      {
        id: "topBottomReveal",
        label: "Top and bottom reveal",
        default: 0.125,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Equal finished reveal at the outside top and bottom boundaries.",
      },
      {
        id: "gap",
        label: "Gap between fronts",
        default: 0.125,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Uniform finished gap between adjacent rows and columns.",
      },
      {
        id: "frontThickness",
        label: "Drawer-front thickness",
        default: 0.75,
        min: 0.125,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness of each front including permanent build-up.",
      },
    ],
    parts: [
      {
        name: "Equal drawer front",
        quantity: "columnCount * rowCount",
        length:
          "(openingHeight - 2 * topBottomReveal - (rowCount - 1) * gap) / rowCount",
        width:
          "(openingWidth - 2 * sideReveal - (columnCount - 1) * gap) / columnCount",
        thickness: "frontThickness",
        materialGroup: "Finished drawer-front panel",
        grain: "Project-specified matched sequence",
        formulaNote:
          "Available width and height are divided equally after perimeter reveals and internal gaps; unequal fronts require a separate elevation-driven model.",
      },
    ],
    measurementSteps: [
      "Define the exact finished faces that bound the drawer-front grid and measure width and height at several locations.",
      "Record approved left, right, top, bottom, and internal gaps rather than combining them into one unexplained deduction.",
      "Overlay drawer boxes, slides, brackets, pulls, interior dividers, and adjustment ranges on the front elevation and section.",
      "Lay out grain continuity, edge treatment, part sequence, and machining datum on the selected sheet or board.",
      "Make and install one complete grid, adjust it through the hardware range, then release matched production fronts.",
    ],
    assumptions: [
      "Every row has equal finished height and every column has equal finished width.",
      "Perimeter reveals are symmetrical on opposing sides and one uniform gap applies between all adjacent fronts.",
      "The calculated dimensions are finished front sizes; pre-finish, edge-banding, profiling, or grain-match production allowances are controlled separately.",
    ],
    checks: [
      "Reconstruct the opening width and height from all fronts, gaps, and perimeter reveals to confirm the arithmetic closes.",
      "Check minimum front size, mounting screw location, bracket engagement, pull boring, and adjustment range against the exact drawer hardware.",
      "Verify grain, color, pattern, edge, and part IDs remain in the approved visual sequence after machining and finishing.",
    ],
    stopConditions: [
      "Stop when the elevation includes unequal rows, unequal columns, paired doors, false fronts, or another layout the equal-grid formula cannot represent.",
      "Stop when the exact slide, front-fixing bracket, pull, or adjustment data affecting the front has not been approved.",
    ],
    mistakes: [
      "Subtracting one gap per front instead of only the gaps that exist between adjacent fronts.",
      "Cutting matched fronts as unrelated parts and losing the intended grain, color, or pattern sequence.",
    ],
    faqs: [
      {
        question: "Can the calculator create unequal drawer-front heights?",
        answer:
          "No. It intentionally models equal rows and columns. Use an approved elevation and a separate controlled dimension chain for unequal fronts.",
      },
      {
        question: "Are the values cut sizes or finished sizes?",
        answer:
          "They are planning finished sizes. Apply only the documented production allowance required by the chosen edge, profile, finish, and machining process.",
      },
      {
        question: "Does the grid guarantee the drawer hardware will adjust into alignment?",
        answer:
          "No. Verify the exact front-fixing geometry, screw locations, adjustment range, box position, and clearances from current manufacturer information.",
      },
    ],
    relatedSlugs: [
      "filler-scribe-panel-calculator",
      "finished-end-panel-calculator",
      "cabinet-hanging-rail-calculator",
    ],
    links: [
      localLink(
        "/drawer-box-calculator/",
        "Drawer Box Calculator",
        "Calculator",
        "Coordinate drawer boxes and clearances behind the finished front grid.",
      ),
      localLink(
        "/learn/drawer-slide-clearance-to-cut-list/",
        "Drawer Slide Clearance to Cut List",
        "Learn",
        "Trace manufacturer slide data into the surrounding dimension chain.",
      ),
      localLink(
        "/worksheets/drawer-slide-installation-record/",
        "Drawer Slide Installation Record",
        "Worksheet",
        "Record slide, bracket, adjustment, and first-grid installation evidence.",
      ),
      localLink(
        "/checklists/drawer-slide-release/",
        "Drawer Slide Release",
        "Checklist",
        "Verify exact hardware before releasing front and drawer batches.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, BLUM_CONFIGURATOR_SOURCE],
  }),

  defineModel({
    slug: "finished-end-panel-calculator",
    categorySlug: "fronts-panels-installation",
    name: "Finished End Panel",
    title: "Finished End Panel Calculator",
    description:
      "Plan a finished cabinet end panel from the cabinet envelope and explicit top, bottom, front, and back extensions or insets.",
    h1: "Finished End Panel Calculator",
    intro:
      "Create a traceable finished-end panel blank without hiding visible extensions in the cabinet box size. This is a reviewable planning model, not a universal design standard; approved reveals, field conditions, grain, finish, and installation details govern.",
    searchIntent: "finished cabinet end panel size calculator",
    whatItBuilds:
      "One or more rectangular finished-end panels with independent vertical extensions, a front extension, and a rear inset.",
    inputs: [
      {
        id: "cabinetHeight",
        label: "Cabinet reference height",
        default: 34.5,
        min: 3,
        max: 120,
        step: 0.0625,
        unit: "in",
        help: "Cabinet height between the reference top and bottom before end-panel extensions.",
      },
      {
        id: "cabinetDepth",
        label: "Cabinet reference depth",
        default: 24,
        min: 3,
        max: 60,
        step: 0.0625,
        unit: "in",
        help: "Cabinet depth between the front and rear reference planes before end-panel adjustments.",
      },
      {
        id: "topExtension",
        label: "Top extension",
        default: 0,
        min: 0,
        max: 24,
        step: 0.0625,
        unit: "in",
        help: "Additional panel length beyond the cabinet top reference.",
      },
      {
        id: "bottomExtension",
        label: "Bottom extension",
        default: 0,
        min: 0,
        max: 24,
        step: 0.0625,
        unit: "in",
        help: "Additional panel length below the cabinet bottom reference.",
      },
      {
        id: "frontExtension",
        label: "Front extension",
        default: 0.75,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Additional panel width beyond the cabinet front reference.",
      },
      {
        id: "backInset",
        label: "Rear inset",
        default: 0,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Deduction from the cabinet rear reference to the finished panel back edge.",
      },
      {
        id: "panelThickness",
        label: "Finished end thickness",
        default: 0.75,
        min: 0.125,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished thickness of the end-panel assembly.",
      },
      {
        id: "panelCount",
        label: "Panel quantity",
        default: 1,
        min: 1,
        max: 24,
        step: 1,
        unit: "count",
        help: "Count of end panels sharing the exact same hand, dimensions, grain, finish, and field condition.",
      },
    ],
    parts: [
      {
        name: "Finished end panel",
        quantity: "panelCount",
        length: "cabinetHeight + topExtension + bottomExtension",
        width: "cabinetDepth + frontExtension - backInset",
        thickness: "panelThickness",
        materialGroup: "Finished exterior panel",
        grain: "Vertical",
        formulaNote:
          "The blank grows beyond the cabinet reference at the entered extensions and reduces at the rear inset; scribe and profile stock require explicit additional control.",
      },
    ],
    measurementSteps: [
      "Name the cabinet top, bottom, front, and rear reference planes and confirm what finish layers they include.",
      "Measure the installed field condition and map floor, wall, countertop, appliance, trim, base, crown, and adjacent-front relationships.",
      "Record visible top, bottom, front, and rear extensions independently on the approved elevation and section.",
      "Lay out grain, handed face, edge treatment, finish, scribe edge, attachment, and sequencing on the actual material.",
      "Template or fit one finished end with adjacent components installed before releasing matching panels.",
    ],
    assumptions: [
      "The component is a rectangular applied finished end; irregular field scribing or shaped profiles are not generated by the formula.",
      "Top, bottom, and front inputs add material beyond named cabinet references while rear inset removes material.",
      "All panels grouped under one count have the same hand, field geometry, grain, finish, edge treatment, and installation sequence.",
    ],
    checks: [
      "Confirm panel length and width close against every visible extension and inset on the approved elevation and section.",
      "Check door, drawer, pull, appliance, countertop, base, crown, wall, and adjacent-cabinet clearances through installation and use.",
      "Verify the finished face, hand, grain direction, part ID, scribe edge, and protective-film side before machining.",
    ],
    stopConditions: [
      "Stop when the cabinet, floor, wall, countertop, appliance, or trim reference is not installed or reliably controlled.",
      "Stop when grain match, hand, edge, finish, scribe, attachment, or installation sequence has not been approved.",
    ],
    mistakes: [
      "Adding a front extension to a cabinet depth that already includes the same finished projection.",
      "Batching left- and right-hand ends without preserving face orientation, grain sequence, and finished-edge identity.",
    ],
    faqs: [
      {
        question: "Does front extension mean door overlay?",
        answer:
          "Not automatically. It is material beyond the named cabinet front reference. Define that reference and verify the approved end-to-front relationship.",
      },
      {
        question: "Can the panel be cut before field installation?",
        answer:
          "A shop blank can be planned when control dimensions are reliable, but any field scribe or visible installed condition still requires the approved template and fitting sequence.",
      },
      {
        question: "Does the model include edge-banding or finish allowance?",
        answer:
          "It reports the intended finished panel size. Control process-specific machining, edging, profiling, sanding, and finish allowances separately.",
      },
    ],
    relatedSlugs: [
      "filler-scribe-panel-calculator",
      "applied-back-panel-calculator",
      "drawer-front-grid-calculator",
    ],
    links: [
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Establish the cabinet reference envelope beneath the finished end.",
      ),
      localLink(
        "/learn/cabinet-dimension-chain-from-opening-to-parts/",
        "Cabinet Dimension Chain Guide",
        "Learn",
        "Keep reference planes, extensions, and finished size auditable.",
      ),
      localLink(
        "/worksheets/material-group-specification/",
        "Material Group Specification",
        "Worksheet",
        "Record the visible material, grain, finish, and edge group.",
      ),
      localLink(
        "/checklists/cut-list-revision-release/",
        "Cut List Revision Release",
        "Checklist",
        "Release field and finish revisions under a controlled model version.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, AWI_INSTALLATION_SOURCE],
  }),

  defineModel({
    slug: "cabinet-hanging-rail-calculator",
    categorySlug: "fronts-panels-installation",
    name: "Cabinet Hanging Rail",
    title: "Cabinet Hanging Rail Calculator",
    description:
      "Plan straight hanging-rail blanks across a cabinet or run using side clearances, rail height and thickness, rail count, segment count, and segment gaps.",
    h1: "Cabinet Hanging Rail Calculator",
    intro:
      "Create a reviewable blank schedule for cabinet hanging rails or cleat stock. This planning model is not a universal structural, anchorage, or hardware standard; verified loads, substrate, rail system, fasteners, installation, and engineering govern.",
    searchIntent: "cabinet hanging rail cut list calculator",
    whatItBuilds:
      "One or more rows of equal straight rail segments distributed across a run after side clearances and explicit inter-segment gaps.",
    inputs: [
      {
        id: "runWidth",
        label: "Cabinet or run width",
        default: 30,
        min: 6,
        max: 240,
        step: 0.0625,
        unit: "in",
        help: "Total horizontal reference width available to the modeled rail row.",
      },
      {
        id: "sideClearance",
        label: "Clearance at each end",
        default: 0.25,
        min: 0,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Equal end clearance from the run boundaries to each rail row.",
      },
      {
        id: "railHeight",
        label: "Rail face height",
        default: 4,
        min: 1,
        max: 12,
        step: 0.0625,
        unit: "in",
        help: "Finished face height of the straight blank before any approved bevel or profile.",
      },
      {
        id: "railThickness",
        label: "Rail thickness",
        default: 0.75,
        min: 0.25,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Measured finished blank thickness; proprietary systems must use their exact manufacturer geometry.",
      },
      {
        id: "railCount",
        label: "Rail rows",
        default: 2,
        min: 1,
        max: 8,
        step: 1,
        unit: "count",
        help: "Number of equal horizontal rail rows from the approved attachment design.",
      },
      {
        id: "segmentCount",
        label: "Segments per row",
        default: 1,
        min: 1,
        max: 12,
        step: 1,
        unit: "count",
        help: "Equal segments in each rail row; seams must align with approved support and attachment zones.",
      },
      {
        id: "segmentGap",
        label: "Gap between segments",
        default: 0.125,
        min: 0,
        max: 3,
        step: 0.03125,
        unit: "in",
        help: "Deliberate gap between adjacent segments in the same row.",
      },
    ],
    parts: [
      {
        name: "Hanging rail segment",
        quantity: "railCount * segmentCount",
        length:
          "(runWidth - 2 * sideClearance - (segmentCount - 1) * segmentGap) / segmentCount",
        width: "railHeight",
        thickness: "railThickness",
        materialGroup: "Approved hanging-rail or cleat stock",
        grain: "Lengthwise",
        formulaNote:
          "The formula divides clear row length into equal straight blanks. It does not establish bevel, proprietary profile, hole pattern, fastener count, or load capacity.",
      },
    ],
    measurementSteps: [
      "Confirm the installed cabinet/run boundaries, elevations, and rail reference faces from approved drawings and field controls.",
      "Locate and document wall substrate, blocking, framing, services, obstructions, and allowable fastening zones.",
      "Identify the exact rail or cleat system, material, profile, mating geometry, fasteners, loads, and current manufacturer instructions.",
      "Lay out end clearances, segment seams, cabinet seams, access, leveling, and fastener positions on the installation elevation.",
      "Fabricate and test one rail-to-cabinet assembly under the approved inspection or engineering process before releasing the run.",
    ],
    assumptions: [
      "Every listed segment is a straight rectangular planning blank; bevels, hooks, proprietary profiles, holes, and slots are excluded.",
      "Equal side clearances and equal segment lengths apply to each rail row in the modeled run.",
      "Rail row count, seam positions, material, load, substrate, fasteners, spacing, and installation are approved inputs external to this size model.",
    ],
    checks: [
      "Confirm all segment lengths, gaps, and end clearances reconstruct the rail run width.",
      "Check every seam and fastener against cabinet structure, wall substrate, blocking, edge distance, services, and installation access.",
      "Verify mating profiles engage fully while preserving required leveling, locking, anti-lift, and adjustment features.",
    ],
    stopConditions: [
      "Stop when load, substrate, blocking, rail material or profile, fastener, spacing, edge distance, or engineering approval is unresolved.",
      "Stop when a proprietary rail or cabinet-hanger system lacks its exact current manufacturer installation data.",
    ],
    mistakes: [
      "Treating the calculated blank dimensions as proof of attachment or load capacity.",
      "Dividing a long rail into equal segments without locating seams over approved cabinet and substrate support zones.",
    ],
    faqs: [
      {
        question: "Does the calculator specify fastener size or spacing?",
        answer:
          "No. Use the approved project design, verified substrate information, current rail-system instructions, fastener data, and any required engineering.",
      },
      {
        question: "Does rail thickness include a French-cleat bevel?",
        answer:
          "The thickness is the rectangular blank thickness. Bevel angle, residual bearing, mating clearance, grain, and machining setup require a separate approved detail.",
      },
      {
        question: "Can a proprietary metal cabinet rail use these formulas?",
        answer:
          "Only as a rough run-layout aid. The exact manufacturer product, stock lengths, brackets, holes, joins, loads, and installation instructions govern.",
      },
    ],
    relatedSlugs: [
      "toe-kick-platform-cut-list-calculator",
      "stretcher-nailer-cut-list-calculator",
      "finished-end-panel-calculator",
    ],
    links: [
      localLink(
        "/cabinet-cut-list-calculator/",
        "Cabinet Cut List Calculator",
        "Calculator",
        "Coordinate rail blanks with the cabinet structure they attach to.",
      ),
      localLink(
        "/learn/woodworking-hardware-allowance-guide/",
        "Hardware Allowance Guide",
        "Learn",
        "Keep exact manufacturer data separate from generic planning assumptions.",
      ),
      localLink(
        "/worksheets/material-group-specification/",
        "Material Group Specification",
        "Worksheet",
        "Record the approved rail material, profile, and lot.",
      ),
      localLink(
        "/checklists/cut-list-revision-release/",
        "Cut List Revision Release",
        "Checklist",
        "Control rail, seam, and field revisions before installation.",
      ),
    ],
    sources: [AWI_CASEWORK_SOURCE, AWI_INSTALLATION_SOURCE],
  }),
];

const EXPECTED_COMPONENT_SLUGS = [
  "face-frame-cut-list-calculator",
  "toe-kick-platform-cut-list-calculator",
  "stretcher-nailer-cut-list-calculator",
  "divider-partition-cut-list-calculator",
  "fixed-shelf-cut-list-calculator",
  "adjustable-shelf-pack-calculator",
  "applied-back-panel-calculator",
  "captured-back-panel-calculator",
  "filler-scribe-panel-calculator",
  "drawer-front-grid-calculator",
  "finished-end-panel-calculator",
  "cabinet-hanging-rail-calculator",
];

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(moduleDirectory, "..");

function assertData(condition, message) {
  if (!condition) {
    throw new Error(`[cut-list-component-data] ${message}`);
  }
}

function assertString(value, context) {
  assertData(typeof value === "string" && value.trim().length > 0, `${context} must be a non-empty string`);
}

function evaluateExpression(expression, inputValues, context) {
  assertString(expression, context);
  assertData(
    /^[0-9A-Za-z_+\-*/().,\s]+$/u.test(expression),
    `${context} contains a character outside the expression whitelist`,
  );
  try {
    return evaluateCutListExpression(expression, inputValues, context);
  } catch (error) {
    throw new Error(
      `[cut-list-component-data] ${context} could not be evaluated: ${error.message}`,
    );
  }
}

function routeIndexPath(href) {
  assertData(/^\/[a-z0-9][a-z0-9-/]*\/$/u.test(href), `invalid local route "${href}"`);
  assertData(!href.includes(".."), `local route must not traverse directories: "${href}"`);
  return path.join(repositoryRoot, href.slice(1), "index.html");
}

function validateComponentData() {
  assertData(componentCategories.length === 3, "expected exactly 3 component categories");

  const categorySlugs = new Set();
  for (const category of componentCategories) {
    assertString(category.slug, "category.slug");
    assertData(!categorySlugs.has(category.slug), `duplicate category slug "${category.slug}"`);
    categorySlugs.add(category.slug);
    assertString(category.name, `${category.slug}.name`);
    assertString(category.title, `${category.slug}.title`);
    assertString(category.description, `${category.slug}.description`);
    assertData(category.workflow?.length >= 4, `${category.slug}.workflow requires at least 4 steps`);
    assertData(category.evidence?.length >= 4, `${category.slug}.evidence requires at least 4 records`);
    assertData(
      category.stopConditions?.length >= 4,
      `${category.slug}.stopConditions requires at least 4 conditions`,
    );
    for (const [field, values] of [
      ["workflow", category.workflow],
      ["evidence", category.evidence],
      ["stopConditions", category.stopConditions],
    ]) {
      values.forEach((value, index) => assertString(value, `${category.slug}.${field}[${index}]`));
    }
  }

  assertData(
    componentModels.length === EXPECTED_COMPONENT_SLUGS.length,
    `expected ${EXPECTED_COMPONENT_SLUGS.length} component models`,
  );

  const modelSlugs = new Set(componentModels.map((model) => model.slug));
  assertData(
    modelSlugs.size === componentModels.length,
    "component model slugs must be unique",
  );

  EXPECTED_COMPONENT_SLUGS.forEach((slug, index) => {
    assertData(
      componentModels[index]?.slug === slug,
      `model ${index + 1} must be "${slug}"`,
    );
  });

  for (const categorySlug of categorySlugs) {
    const count = componentModels.filter((model) => model.categorySlug === categorySlug).length;
    assertData(count === 4, `category "${categorySlug}" must contain exactly 4 models`);
  }

  for (const model of componentModels) {
    const context = model.slug;
    for (const field of [
      "slug",
      "categorySlug",
      "name",
      "title",
      "description",
      "h1",
      "intro",
      "searchIntent",
      "whatItBuilds",
      "modelVersion",
      "reviewedDate",
    ]) {
      assertString(model[field], `${context}.${field}`);
    }

    assertData(categorySlugs.has(model.categorySlug), `${context} has an unknown categorySlug`);
    assertData(
      model.intro.toLowerCase().includes("planning model") &&
        model.intro.toLowerCase().includes("universal"),
      `${context}.intro must state the planning-model and non-universal-standard boundary`,
    );
    assertData(model.modelVersion === MODEL_VERSION, `${context} has an unexpected modelVersion`);
    assertData(
      /^\d{4}-\d{2}-\d{2}$/u.test(model.reviewedDate),
      `${context}.reviewedDate must use YYYY-MM-DD`,
    );

    assertData(model.inputs?.length >= 1, `${context}.inputs must not be empty`);
    const inputIds = new Set();
    const inputValues = {};
    for (const [inputIndex, input] of model.inputs.entries()) {
      const inputContext = `${context}.inputs[${inputIndex}]`;
      assertData(
        /^[A-Za-z_][A-Za-z0-9_]*$/u.test(input.id),
        `${inputContext}.id must be a valid expression identifier`,
      );
      assertData(!inputIds.has(input.id), `${context} has duplicate input id "${input.id}"`);
      assertData(
        !cutListExpressionFunctionNames.includes(input.id),
        `${context} input id "${input.id}" collides with an allowed function`,
      );
      inputIds.add(input.id);
      assertString(input.label, `${inputContext}.label`);
      assertString(input.help, `${inputContext}.help`);
      assertData(Number.isFinite(input.default), `${inputContext}.default must be finite`);
      assertData(Number.isFinite(input.min), `${inputContext}.min must be finite`);
      assertData(Number.isFinite(input.max), `${inputContext}.max must be finite`);
      assertData(Number.isFinite(input.step) && input.step > 0, `${inputContext}.step must be positive`);
      assertData(input.min <= input.default, `${inputContext}.default is below min`);
      assertData(input.default <= input.max, `${inputContext}.default is above max`);
      assertData(
        input.unit === "in" || input.unit === "count",
        `${inputContext}.unit must be "in" or "count"`,
      );
      if (input.unit === "count") {
        assertData(
          Number.isInteger(input.default) &&
            Number.isInteger(input.min) &&
            Number.isInteger(input.max) &&
            Number.isInteger(input.step),
          `${inputContext} count bounds and defaults must be integers`,
        );
      }
      inputValues[input.id] = input.default;
    }

    assertData(model.parts?.length >= 1, `${context}.parts must not be empty`);
    for (const [partIndex, part] of model.parts.entries()) {
      const partContext = `${context}.parts[${partIndex}]`;
      assertString(part.name, `${partContext}.name`);
      assertString(part.materialGroup, `${partContext}.materialGroup`);
      assertString(part.grain, `${partContext}.grain`);
      assertString(part.formulaNote, `${partContext}.formulaNote`);

      for (const field of ["quantity", "length", "width", "thickness"]) {
        const result = evaluateExpression(
          part[field],
          inputValues,
          `${partContext}.${field}`,
        );
        assertData(result > 0, `${partContext}.${field} must be positive at default inputs`);
        if (field === "quantity") {
          assertData(
            Number.isInteger(result),
            `${partContext}.quantity must be an integer at default inputs`,
          );
        }
      }
    }

    assertData(
      model.measurementSteps?.length >= 5,
      `${context}.measurementSteps requires at least 5 steps`,
    );
    assertData(model.assumptions?.length >= 5, `${context}.assumptions requires at least 5 items`);
    assertData(model.checks?.length >= 5, `${context}.checks requires at least 5 items`);
    assertData(
      model.stopConditions?.length >= 4,
      `${context}.stopConditions requires at least 4 items`,
    );
    assertData(model.mistakes?.length >= 4, `${context}.mistakes requires at least 4 items`);
    for (const [field, values] of [
      ["measurementSteps", model.measurementSteps],
      ["assumptions", model.assumptions],
      ["checks", model.checks],
      ["stopConditions", model.stopConditions],
      ["mistakes", model.mistakes],
    ]) {
      values.forEach((value, index) => assertString(value, `${context}.${field}[${index}]`));
    }
    assertData(
      model.assumptions.some(
        (item) =>
          item.includes("Manufacturer hardware") && item.toLowerCase().includes("govern"),
      ),
      `${context}.assumptions must state that manufacturer hardware data governs`,
    );

    assertData(model.faqs?.length >= 3, `${context}.faqs requires at least 3 items`);
    model.faqs.forEach((faq, index) => {
      assertString(faq.question, `${context}.faqs[${index}].question`);
      assertString(faq.answer, `${context}.faqs[${index}].answer`);
    });

    assertData(
      model.relatedSlugs?.length === 3,
      `${context}.relatedSlugs must contain exactly 3 slugs`,
    );
    assertData(
      new Set(model.relatedSlugs).size === 3,
      `${context}.relatedSlugs must be unique`,
    );
    for (const relatedSlug of model.relatedSlugs) {
      assertData(relatedSlug !== model.slug, `${context} cannot relate to itself`);
      assertData(
        modelSlugs.has(relatedSlug),
        `${context} references unknown related slug "${relatedSlug}"`,
      );
    }

    assertData(model.links?.length >= 4, `${context}.links requires at least 4 local links`);
    const modelLinkHrefs = new Set();
    for (const [linkIndex, link] of model.links.entries()) {
      const linkContext = `${context}.links[${linkIndex}]`;
      assertString(link.href, `${linkContext}.href`);
      assertString(link.label, `${linkContext}.label`);
      assertString(link.kind, `${linkContext}.kind`);
      assertString(link.description, `${linkContext}.description`);
      assertData(!modelLinkHrefs.has(link.href), `${context} has duplicate link "${link.href}"`);
      modelLinkHrefs.add(link.href);
      const indexPath = routeIndexPath(link.href);
      assertData(
        existsSync(indexPath),
        `${linkContext}.href does not resolve to a local index.html: ${link.href}`,
      );
    }

    assertData(model.sources?.length >= 1, `${context}.sources requires at least 1 source`);
    for (const [sourceIndex, source] of model.sources.entries()) {
      const sourceContext = `${context}.sources[${sourceIndex}]`;
      assertString(source.name, `${sourceContext}.name`);
      assertData(
        typeof source.url === "string" && /^https:\/\//u.test(source.url),
        `${sourceContext}.url must be an HTTPS primary-source URL`,
      );
      assertString(source.scope, `${sourceContext}.scope`);
      assertData(
        source.scope.length >= 80,
        `${sourceContext}.scope must state a meaningful applicability boundary`,
      );
    }
  }

  const relatedInboundCounts = new Map(
    componentModels.map((model) => [model.slug, 0]),
  );
  for (const model of componentModels) {
    for (const relatedSlug of model.relatedSlugs) {
      relatedInboundCounts.set(
        relatedSlug,
        relatedInboundCounts.get(relatedSlug) + 1,
      );
    }
  }
  for (const [slug, inboundCount] of relatedInboundCounts) {
    assertData(
      inboundCount >= 2,
      `${slug} needs at least two related-model inbound links; found ${inboundCount}`,
    );
  }
}

validateComponentData();
