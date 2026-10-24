// Research explainers, not reports of shop experiments. Examples are deterministic
// calculations; the sources and assumptions are published alongside each article.
export function equilibriumMoisture(temperatureC, relativeHumidityPercent) {
  const T = temperatureC;
  const h = relativeHumidityPercent / 100;
  const W = 349 + 1.29 * T + 0.0135 * T ** 2;
  const K = 0.805 + 0.000736 * T - 0.00000273 * T ** 2;
  const K1 = 6.27 - 0.00938 * T - 0.000303 * T ** 2;
  const K2 = 1.91 + 0.0407 * T - 0.000293 * T ** 2;
  const x = K * h;
  return (1800 / W) * (x / (1 - x) + (K1 * x + 2 * K1 * K2 * x ** 2) / (1 + K1 * x + K1 * K2 * x ** 2));
}

export function bendingDeflection({ span, depth, thickness, modulus, lineLoad }) {
  const I = depth * thickness ** 3 / 12;
  return 5 * lineLoad * span ** 4 / (384 * modulus * I);
}

export function glueBatchSchedule(joints) {
  // One operator: spread all joints at 45 s each, mate in the same order at
  // 15 s each, then spend 60 s applying pressure to the complete assembly.
  return { longestOpenSeconds: 45 * joints + 15, totalSeconds: 60 * joints + 60 };
}

const date = "2026-10-24";
const moistureValues = [30, 50, 70].map((rh) => [rh, equilibriumMoisture(21, rh)]);
const baseline = { span: 800, depth: 300, thickness: 18, modulus: 8000, lineLoad: 0.375 };
const shelfVariants = [
  ["800 mm / 18 mm", baseline],
  ["600 mm / 18 mm", { ...baseline, span: 600 }],
  ["800 mm / 24 mm", { ...baseline, thickness: 24 }],
];
const mm = (value) => `${value.toFixed(3)} mm`;
const minutes = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export const blogBatch20261024 = [
  {
    slug: "wood-equilibrium-moisture-hysteresis-research",
    category: "CutList",
    title: "Wood Equilibrium Moisture: Why Humidity History Matters",
    seoTitle: "Wood Moisture and Sorption Hysteresis",
    description: "A research-based explanation of equilibrium moisture, sorption hysteresis, and why a humidity reading cannot prove that wood is ready for final machining.",
    kicker: "Wood science · Research explainer",
    readTime: "10 min",
    accent: "cutlist",
    useGenericTranslation: false,
    publishedDate: date,
    modifiedDate: date,
    researchBrief: {
      question: "Can room humidity and a fixed acclimation period establish that a board is ready for final sizing?",
      insight: "Room conditions estimate a destination for moisture exchange. Repeated wood measurements and its moisture history provide the evidence for a machining decision.",
      metrics: ["Air temperature and RH", "Repeated wood MC", "Measurement location", "Expected service range"],
    },
    sections: [
      ["The Research Question and Evidence", "Two boards can occupy the same room without having the same moisture content. One may have arrived from damp storage; the other may be gaining moisture after a dry winter. This article explains that difference using Glass and Zelinka's 2021 Wood Handbook chapter, particularly Equation 4–5 and the discussion of sorption hysteresis on printed pages 4–3 through 4–5. The calculations below illustrate the published equilibrium model. They are not measurements of a supplied board, a drying simulation, or a new laboratory study. Oregon State University's Wood and Moisture Relationships provides an additional explanation of the underlying wood–water relationship."],
      ["Equilibrium Describes a Condition, Not a Countdown", "Equilibrium moisture content, or EMC, is the moisture content at which wood neither gains nor loses moisture under specified surrounding conditions. It is different from the board's present moisture content. A room sensor measures air temperature and relative humidity; a wood moisture meter estimates a property of the material at its measurement location. Writing down 50% RH does not establish that the middle of a thick board has reached the corresponding EMC. The handbook also distinguishes short surface responses from slower changes through the piece. This is why a delivery date plus an arbitrary number of days is weak evidence for final machining."],
      ["Why the Previous Environment Still Matters", "Sorption hysteresis means the equilibrium relationship depends on whether the wood approached the condition by drying or by taking up moisture. The handbook shows different desorption and absorption paths. A single averaged equation cannot encode all of that history. In practice, ask where the material was stored and whether it recently became wetter or drier. Keep that answer with the readings. It helps explain why two nominally similar boards disagree without assuming that one meter must be broken. Hysteresis is a material behavior; a moisture gradient is a spatial difference within the piece. They can occur together, but they are not interchangeable explanations."],
      ["A Reproducible Humidity Sensitivity Example", "For a fixed air temperature T = 21 °C, evaluate Wood Handbook Equation 4–5 at h = 0.30, 0.50, and 0.70, where h is RH expressed as a fraction. Define x = K × h. Then EMC (%) = (1800/W) × [x/(1−x) + (K1×x + 2×K1×K2×x²)/(1 + K1×x + K1×K2×x²)]. The temperature coefficients are W = 349 + 1.29T + 0.0135T²; K = 0.805 + 0.000736T − 0.00000273T²; K1 = 6.27 − 0.00938T − 0.000303T²; and K2 = 1.91 + 0.0407T − 0.000293T². The table and chart use this equation and round only the final output to one decimal place. That rounding is for comparing scenarios, not a claim of measurement accuracy."],
      ["What the Example Can and Cannot Establish", `At 21 °C, moving from 30% to 70% RH changes the model's equilibrium estimate from ${moistureValues[0][1].toFixed(1)}% to ${moistureValues[2][1].toFixed(1)}% MC. That difference makes a useful question for a project review: will the finished item experience a similar environmental range? It does not tell us how many days a particular board needs, its actual movement in millimeters, or its internal moisture distribution. The handbook explicitly warns that its tabulated tenth-percent precision should not be interpreted as real precision, and identifies limitations in using the underlying data for scientific model evaluation. Use this as a practical sensitivity example rather than a validated prediction for an individual specimen.`],
      ["Build a Measurement Record That Can Change the Decision", "For a small furniture job, assign an ID to each critical board and mark repeatable measurement locations away from damaged ends and hardware. Record date, room conditions, instrument model, selected species setting, material temperature where required by the meter, and the actual readings. Follow the instrument's instructions for depth, contact, calibration checks, and corrections. Repeat the same locations instead of replacing yesterday's low reading with today's convenient high reading. Use multiple pieces rather than selecting the one that agrees with the desired schedule. If the readings disagree, preserve the spread in the record; an average alone can hide the material that still needs attention."],
      ["Turn Observations Into a Machining Release", "Write the release rule before looking at the newest readings. It should state the destination conditions, the material-specific target range, how much change is acceptable relative to the instrument's capability, and what happens if readings remain inconsistent. Those are project decisions; this article does not prescribe one universal threshold. Store material with suitable support and exposure to the controlled environment, then recheck after rough machining when internal material becomes accessible. If a critical panel is still changing, postpone its final fit or preserve a defined machining allowance. Keep rough size, finished size, and any later trimming operation separate in the cut list so an allowance cannot silently become a finished dimension."],
      ["Separate Solid Wood From Engineered Panels", "The sorption equation is not a direct plywood movement formula. A plywood layup, adhesive system, coating, and panel construction introduce additional variables. Likewise, a solid-wood movement calculation needs the board width, grain direction, a suitable coefficient, and an intended service moisture range. Do not paste the EMC percentage into a dimensional allowance or treat it as percent swelling. Use the Wood Movement workflow linked below for supported solid-wood scenarios, preserving its input limits and attachment review. Keep panel-specific instructions with plywood work. The useful output of this article is a better environmental and measurement record, not a universal expansion gap."],
      ["A Small Follow-Up Study for Your Own Shop", "To improve a local policy, follow several identified boards through storage and machining. Keep species, thickness, previous storage, measurement positions, support method, and room history visible in the log. Decide the observation interval in advance and note any changes in heating or ventilation. Compare the time series rather than only the first and last values. Report the number of boards and missing readings if you publish the result. An observation from one board can guide that board's handling; it does not establish a general acclimation duration. The same discipline makes a later disagreement useful evidence instead of an undocumented exception."],
    ],
    chart: {
      title: "Calculated equilibrium moisture at 21 °C",
      unit: "%",
      bars: moistureValues.map(([rh, value]) => [`${rh}% RH`, Number(value.toFixed(1))]),
      caption: "Illustrative outputs of Wood Handbook Equation 4–5. These are equilibrium estimates, not observed board readings or drying times.",
      source: "USDA Wood Handbook (2021), Chapter 4, Equation 4–5; calculations by WoodCutTool.",
    },
    checklist: ["Record the previous storage environment and expected service conditions.", "Repeat measurements on identified boards at the same marked locations.", "Apply the meter manufacturer's species, depth, and temperature instructions.", "Keep modeled EMC separate from measured wood moisture content.", "Use a written release rule and preserve unresolved differences before final fitting."],
    deepDive: {
      comparisonTitle: "Illustrative equilibrium scenarios, not an acclimation schedule",
      comparisonColumns: ["Air temperature", "Relative humidity", "Calculated EMC", "Interpretation"],
      comparisonRows: moistureValues.map(([rh, value]) => ["21 °C", `${rh}%`, `${value.toFixed(1)}% MC`, "A model estimate of equilibrium; current wood MC may differ"]),
      faqs: [
        ["Can I use a room humidity meter instead of a wood moisture meter?", "They measure different quantities. Room conditions help describe the environment; a suitable wood meter helps track the material. Neither reading alone proves an entire board is uniform."],
        ["Does a steady reading mean the wood will stop moving forever?", "It only describes the observed material under the conditions and measurement method used. Seasonal service conditions can still change."],
      ],
      sources: [
        ["Glass and Zelinka (2021): Wood Handbook, Chapter 4", "https://research.fs.usda.gov/treesearch/62243", "Primary technical reference. Equation 4–5, EMC precision limitations, sorption hysteresis, and moisture exchange. Sources checked October 24, 2026."],
        ["Oregon State University Extension: Wood and Moisture Relationships", "https://extension.oregonstate.edu/catalog/em-8600-wood-moisture-relationships", "University extension explanation of bound water, moisture content, and dimensional response."],
        ["Wood Movement: moisture readings and service range", "/wood-movement/moisture-readings-and-service-range/", "Apply a documented moisture range to the supported solid-wood planning workflow."],
        ["Wood Movement review", "/wood-movement/", "Review supported grain directions, dimensional assumptions, and attachment constraints."],
      ],
    },
  },
  {
    slug: "shelf-creep-load-duration-research",
    category: "CutList",
    title: "Shelf Creep: Why a Short Load Test Cannot Predict Years of Sag",
    seoTitle: "Shelf Creep and Long-Term Sag Research",
    description: "Understand time-dependent shelf deflection with primary wood-science references, reproducible beam calculations, and clearly labeled creep sensitivity scenarios.",
    kicker: "Material mechanics · Research explainer",
    readTime: "10 min",
    accent: "cutlist",
    useGenericTranslation: false,
    publishedDate: date,
    modifiedDate: date,
    researchBrief: {
      question: "What does a shelf's initial deflection tell us about its behavior under a sustained load?",
      insight: "Initial bending provides a baseline. Duration, moisture, material construction, and support behavior require additional evidence before interpreting long-term sag.",
      metrics: ["Clear support span", "Load distribution", "Initial deflection", "Time and humidity history"],
    },
    sections: [
      ["Start With the Difference Between Bending and Creep", "A shelf may appear satisfactory during a brief loading check and continue deflecting while the same objects remain on it. The Wood Handbook's 2021 Mechanical Properties of Wood chapter calls this additional time-dependent deformation creep. Its Time Under Load discussion, on printed page 5–39, also distinguishes deformation from eventual failure under sustained stress. This article combines that research explanation with elementary bending calculations from Chapter 9. It does not report a shelf endurance experiment, assign a shelf load rating, or predict a service life from a few hours of observation."],
      ["What the Literature Actually Supports", "Senalik and Farber describe creep even at low stresses and discuss the effects of service temperature and humidity. They note that additional deformation after years can be comparable to initial elastic deformation in typical design environments. That statement explains why duration deserves attention; it is not a universal instruction to double every shelf calculator result. The chapter's clear-wood evidence also cannot supply a product-specific multiplier for MDF, particleboard, or every plywood layup. Material construction, moisture history, stress level, and connection behavior matter. Keep that distinction explicit whenever a research summary becomes a number in a design sheet."],
      ["Define an Initial Bending Model Before Adding Time", "For a simply supported rectangular beam with a uniformly distributed line load w, the bending component of midspan deflection is δb = 5wL⁴/(384EI), with I = bh³/12. Here L is support span, b is the shelf's front-to-back depth, h is thickness, and E is the modulus along the span. Use N and mm consistently so E is in N/mm² and w is in N/mm. The formula assumes small elastic deformation and idealized supports. Chapter 9 also includes shear deformation; the calculations here omit it deliberately to expose bending sensitivity. They therefore are not a full panel analysis or a complete deflection prediction."],
      ["Reproduce the Baseline Calculation", `Choose hypothetical inputs L = 800 mm, b = 300 mm, h = 18 mm, E = 8,000 N/mm², and w = 0.375 N/mm. These are teaching assumptions, not a claimed plywood grade or a recommended load. Total distributed force is wL = 300 N, treated here as including all supported weight. The rectangular second moment is 145,800 mm⁴. Substitution gives a bending component of ${mm(bendingDeflection(baseline))}. Record the source of a real panel's stiffness separately; an assumed modulus is not certified material data. A concentrated appliance, unsupported back edge, or different support arrangement requires a different model.`],
      ["Compare Geometry Under the Same Line Load", `Keep w and E unchanged while reducing span to 600 mm. The bending component becomes ${mm(bendingDeflection({ ...baseline, span: 600 }))}, or 31.6% of the baseline, because (600/800)⁴ = 0.3164. This comparison holds load per unit length constant, so the shorter shelf carries 225 N rather than 300 N. If instead total force stayed constant, the span dependence would be cubic. Increasing thickness from 18 to 24 mm at the original span gives ${mm(bendingDeflection({ ...baseline, thickness: 24 }))}, or 42.2% of the baseline, from (18/24)³. These ratios compare ideal bending only. They do not prove that two real panels share the same stiffness or that a thicker shelf solves a weak support.`],
      ["Use Creep Scenarios Without Inventing a Forecast", `To see how an uncertain time effect changes a decision, define an illustrative ratio c = additional creep deflection / initial deflection and calculate δscenario = δb × (1 + c). For c = 0.5, 1.0, and 2.0, the baseline gives ${mm(bendingDeflection(baseline) * 1.5)}, ${mm(bendingDeflection(baseline) * 2)}, and ${mm(bendingDeflection(baseline) * 3)}. These are deliberately selected sensitivity cases. No probability, calendar duration, material class, or design-code factor is attached to them. If a decision changes across this range, obtain product-specific long-term information or revise the geometry rather than choosing the most convenient multiplier.`],
      ["Design a Local Observation That Answers a Narrow Question", "A useful shop observation starts before loading. Record the unloaded shape, actual span, thickness at several positions, support hardware, material identity, and where the load will sit. Use a stable external reference so movement of the cabinet is not mistaken for movement of the shelf. Record the loaded change after placement, then at planned intervals with temperature and humidity. Keep force and distribution unchanged and document any interruption. If you unload later, record recovery as a separate series. This can reveal a trend in that assembly. It cannot establish a safe capacity for all shelves of the same nominal thickness, especially from one specimen."],
      ["Check the Load Path Before Optimizing the Cut List", "A divider can reduce clear span, but its own connection and support below must transfer the load. A front strip only behaves as an effective stiffener when its geometry and attachment transfer the required forces; decorative edging should not automatically be counted as a composite beam. Shelf pins, sockets, side panels, backs, and cabinet restraint can move or fail independently of the shelf's bending stiffness. Document those details before reducing a thickness to improve sheet yield. Once the support arrangement is established, update shelf quantities, divider sizes, material groups, and grain orientation in the cut list. Yield is a later decision than the load path."],
      ["Set Review Criteria and State the Remaining Uncertainty", "Define the acceptable appearance and function before the observation begins: visible sag, clearance to a door, and a binding drawer below may control different projects. Record the source of any required engineering limit instead of inventing a universal span ratio. A rapidly changing shape, damaged support, or unexpected movement calls for unloading and investigation; simply collecting more readings does not repair the assembly. Use the Shelf Sag Calculator as a preliminary comparison tool within its stated model, and use supplier data or appropriate design review when capacity must be established. The research takeaway is a distinction between an initial stiffness estimate, a time-dependent observation, and a verified product design."],
    ],
    chart: {
      title: "Illustrative initial bending: geometry comparison",
      unit: " mm",
      bars: shelfVariants.map(([label, inputs]) => [label, Number(bendingDeflection(inputs).toFixed(3))]),
      caption: "Same assumed E = 8,000 N/mm², depth = 300 mm, and line load = 0.375 N/mm. Labels show span / thickness. Shear, creep, and support movement excluded.",
      source: "Wood Handbook (2021), Chapter 9, Equations 9–2 and 9–3 and Table 9–1; illustrative inputs by WoodCutTool.",
    },
    checklist: ["Use actual clear support span and measured thickness.", "Distinguish uniform line load from fixed total or concentrated load.", "Label assumed stiffness and creep ratios as assumptions.", "Observe support and cabinet movement separately from shelf bending.", "Carry any support or thickness revision into the final cut list."],
    deepDive: {
      comparisonTitle: "Illustrative creep sensitivity, with no assigned service duration",
      comparisonColumns: ["Assumed additional / initial ratio c", "Initial bending component", "Scenario total", "Status"],
      comparisonRows: [0.5, 1, 2].map((c) => [String(c), mm(bendingDeflection(baseline)), mm(bendingDeflection(baseline) * (1 + c)), "Chosen sensitivity case; not a product rating"]),
      faqs: [
        ["Does low initial sag prove long-term capacity?", "It describes initial stiffness under the measured conditions. It does not establish long-term deflection, connection capacity, or strength."],
        ["Can I apply these examples to particleboard or plywood?", "The arithmetic can illustrate sensitivity, but the assumed modulus and creep ratios are not product data. Obtain properties for the actual panel and loading direction."],
      ],
      sources: [
        ["Senalik and Farber (2021): Wood Handbook, Chapter 5", "https://research.fs.usda.gov/treesearch/62244", "Primary technical reference: Time Under Load and creep discussion, printed pages 5–38 to 5–41. Sources checked October 24, 2026."],
        ["Lo Ricco, Amini, and Rammer (2021): Wood Handbook, Chapter 9", "https://research.fs.usda.gov/treesearch/62251", "Equations 9–2 and 9–3 and Table 9–1 distinguish bending, shear, cross section, and support assumptions."],
        ["Shelf Sag Calculator", "/shelf-sag-calculator/", "Compare preliminary elastic scenarios within the tool's supported assumptions."],
        ["Shelf span and plywood thickness guide", "/learn/shelf-span-and-plywood-thickness-guide/", "Connect span and material decisions to the cabinet plan."],
      ],
    },
  },
  {
    slug: "wood-glue-assembly-window-research",
    category: "CutList",
    title: "Wood Glue Assembly Time: A Research-Based Batch Planning Method",
    seoTitle: "Wood Glue Assembly Time and Batch Size",
    description: "Separate open time, total assembly time, and cure time using adhesive research, current manufacturer guidance, and a reproducible batch timing example.",
    kicker: "Adhesion science · Research explainer",
    readTime: "10 min",
    accent: "cutlist",
    useGenericTranslation: false,
    publishedDate: date,
    modifiedDate: date,
    researchBrief: {
      question: "Why can a glue-up exceed its useful process window even when the final clamp is applied before the stated total assembly time?",
      insight: "Each spread surface has an exposure history. Check its open interval separately from the assembly's time to pressure, then rehearse the sequence under the actual conditions.",
      metrics: ["First spread timestamp", "Each joint's mating time", "Effective pressure time", "Glue and material temperature"],
    },
    sections: [
      ["Study the Process Window, Not a Glue Ranking", "A complicated assembly can consume time while every individual action looks reasonable. Spreading, rotating a panel, finding a caul, checking diagonals, and reaching the last clamp all belong in the process. This article uses Frihart and Hunt's 2021 Wood Handbook chapter to explain the bonding mechanism and uses the current Titebond Original manufacturer sheet as one specific worked reference. The batch timings are constructed examples, not measured shop performance or bond-strength experiments. The purpose is to expose a schedule conflict before adhesive is applied; the method does not certify a joint."],
      ["Why Exposed Adhesive Changes While You Work", "The handbook's Assembly and Pressing section, printed pages 10–14 through 10–16, describes viscosity, wetting, flow, penetration, and transfer to the opposing surface. After spreading, a waterborne adhesive can lose water through evaporation and absorption into wood. Bringing the faces together reduces exposed evaporation but does not stop absorption. Consequently, time spent with a coated surface exposed differs from time spent with the joint mated but awaiting pressure. The mechanism also explains why surface preparation, wood absorbency, temperature, and surrounding air conditions belong in the record. A stopwatch is useful only when the events it times are defined."],
      ["Define Four Separate Events", "For this planning method, start each joint's clock when spreading begins on that joint. Mark when its mating surfaces come together and when the assembly receives the intended pressure. Record clamp release and permission for subsequent work separately, following the adhesive maker's instructions. The interval from spread to mating is the open exposure used in the example. The interval from the earliest spread to completed pressure is its total assembly interval. These clocks overlap. Do not add a stated open window to a stated total window, and do not treat time to clamp release as time to full cure. If a supplier defines the events differently, use and record that definition."],
      ["Read the Conditions Attached to the Published Numbers", "As checked on October 24, 2026, Titebond Original lists 4–6 minutes open assembly time and 10–15 minutes total assembly time at 70 °F and 50% RH. Its application guidance requires temperatures above 50 °F (10 °C), including attention to glue and material temperature. The sheet limits this product's use and excludes structural or load-bearing applications. These figures describe this product under stated conditions; they are not a general schedule for all wood adhesives. For the arithmetic below, choose the lower ends—240 seconds open and 600 seconds total—as illustrative review thresholds. Even meeting those thresholds does not establish adequate bonding in a different environment."],
      ["Reproduce a Single-Operator Schedule", "Assume an assembly with N joints. One operator spreads the joints in order, taking 45 seconds per joint; only after all spreading is finished does the operator mate them in the same order, taking 15 seconds each. Applying pressure to the completed assembly then takes 60 seconds. For joint i, numbered from zero, spreading starts at 45i seconds and mating finishes at 45N + 15(i + 1) seconds. Its open exposure is therefore 45N + 15 − 30i seconds. The earliest joint waits longest. The assembly reaches pressure at 60N + 60 seconds. These rules intentionally include spreading time and use completed mating as the endpoint; they describe the hypothetical sequence, not a physical adhesive model."],
      ["Why Four and Eight Joints Give Different Decisions", `With four joints, the longest open exposure is ${minutes(glueBatchSchedule(4).longestOpenSeconds)} and time to pressure is ${minutes(glueBatchSchedule(4).totalSeconds)}. With eight joints, those intervals become ${minutes(glueBatchSchedule(8).longestOpenSeconds)} and ${minutes(glueBatchSchedule(8).totalSeconds)}. The eight-joint assembly is within the chosen ten-minute total threshold but exceeds even the published six-minute upper end for open time. Passing one clock therefore cannot compensate for failing another. Two independent four-joint subassemblies would each repeat the shorter local cycle, taking ten minutes of sequential operator time overall. That split is available only if the construction sequence permits independent subassemblies without compromising fit or later joints.`],
      ["Use a Dry Rehearsal to Replace the Assumed Times", "Label parts and rehearse the complete motion with the actual clamps, cauls, bench space, and helpers. Identify each joint so timestamps remain meaningful after panels are turned over. Record repeated runs, including the slowest ordinary run and any interruption, rather than choosing a single best time. Replace 45, 15, and 60 seconds with observations, or log every event when durations differ greatly among joints. Dry rehearsal can estimate handling time, but spreading real adhesive adds work and changes friction. Include a conservative allowance and confirm the intended process on representative scrap before committing valuable parts. Keep people clear of a rushed assembly sequence by making the batch smaller when its timing is uncertain."],
      ["Check Temperature and Transfer Alongside the Clock", "Measure conditions near the work and consider stock that has just arrived from a cold vehicle or storage space. The room thermostat does not establish the temperature of the material or the adhesive. Retain the technical sheet for the exact product and formulation; a longer stated open window on another product is only useful if that product suits the intended application. Inspect representative joints for contact and adhesive transfer using the supplier's method. Visible squeeze-out alone is not a measurement of joint strength. Increasing clamp force is not a documented way to reverse a skinned or dried film, and forcing a poor-fitting joint closed adds another uncontrolled variable."],
      ["Release and Record the Assembly as a Separate Decision", "Once pressure is applied, preserve the required clamp and cure conditions before machining or loading. Obtain those intervals from the current product instructions rather than the example schedule. Record product identification, material and surface preparation, environmental conditions, spread and pressure events, deviations, and release time with the project revision. If a process limit is exceeded, stop repeating that sequence and seek the manufacturer's recovery guidance or remake the affected joint as appropriate. Do not relabel an overrun as acceptable because the finished assembly looks square. The Glue-Up planner linked below can hold a rehearsal schedule and batch split; it does not measure bond quality or override adhesive instructions."],
    ],
    chart: {
      title: "Illustrative longest open exposure by batch size",
      unit: " s",
      bars: [4, 8].map((n) => [`${n} joints`, glueBatchSchedule(n).longestOpenSeconds]),
      caption: "Constructed single-operator sequence: 45 s spreading per joint, then 15 s mating per joint in the same order. The example's conservative open-time threshold is 240 s.",
      source: "WoodCutTool schedule arithmetic; manufacturer time windows are separate reference conditions, not measured results.",
    },
    checklist: ["Archive the exact product sheet and its environmental conditions.", "Timestamp each joint's spreading and mating, then completed pressure.", "Check open and total intervals separately; do not add their limits.", "Rehearse the assembly and split it only where construction permits.", "Record clamp release and cure requirements separately from assembly time."],
    deepDive: {
      comparisonTitle: "Constructed schedules against illustrative 4 min / 10 min thresholds",
      comparisonColumns: ["Sequence", "Longest open interval", "First spread to pressure", "Timing interpretation only"],
      comparisonRows: [
        ["4 joints", minutes(glueBatchSchedule(4).longestOpenSeconds), minutes(glueBatchSchedule(4).totalSeconds), "Within both selected thresholds; bond quality unverified"],
        ["8 joints", minutes(glueBatchSchedule(8).longestOpenSeconds), minutes(glueBatchSchedule(8).totalSeconds), "Open threshold exceeded despite total time being within threshold"],
        ["Two independent 4-joint batches", "3:15 per batch", "5:00 per batch; 10:00 overall", "Only feasible when the joint and construction sequence permit a split"],
      ],
      faqs: [
        ["Can I add the open time to the total assembly time?", "No. In this method, total time starts at first spreading, so it already contains open exposure. Follow the specific manufacturer's event definitions."],
        ["Does a dry rehearsal demonstrate bond strength?", "No. It measures handling and sequencing. Surface contact, adhesive transfer, material condition, pressure, and cure still need the appropriate controls."],
      ],
      sources: [
        ["Frihart and Hunt (2021): Wood Handbook, Chapter 10", "https://research.fs.usda.gov/treesearch/62250", "Primary technical reference for viscosity, wetting, open/closed assembly, pressure, and post-cure conditioning. Sources checked October 24, 2026."],
        ["Titebond Original: official application guidelines", "https://www.titebond.com/print/product/d4d28015-603f-4dfc-a7d9-f684acc71207", "Product-specific open and total times at 70 °F / 50% RH, minimum application temperature, and usage limitations. Recheck before use."],
        ["Glue-Up: open and total assembly time", "/glue-up/open-and-total-assembly-time/", "Define the separate intervals before building a schedule."],
        ["Glue-Up planner", "/glue-up/", "Record a rehearsal, identify timing conflicts, and review feasible batch splits."],
      ],
    },
  },
];

if (blogBatch20261024.length !== 3 || new Set(blogBatch20261024.map(({ slug }) => slug)).size !== 3) {
  throw new Error("Expected exactly three unique research explainers for October 24, 2026");
}
