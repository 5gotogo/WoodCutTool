export const fields = {
  width: "Package width",
  height: "Package height",
  face: "Moulding face width",
  lip: "Rabbet lip width",
  clearance: "Fitting clearance per edge",
  depth: "Usable rabbet depth",
  stack: "Total stack thickness",
  reserve: "Depth reserved for retainers",
  stick: "Length per stick",
  trim: "Total end loss per stick",
  gap: "Loss between adjacent parts"
};

export const sample = {
  width: 280, height: 355, face: 35, lip: 9, clearance: 1.5,
  depth: 12, stack: 8, reserve: 2, stick: 800, trim: 30, gap: 6
};

const epsilon = 1e-8;
const positive = new Set(["width", "height", "face", "lip", "depth", "stack", "stick"]);

function stockPlan(parts, capacity, gap) {
  // Enumerate the partitions of four labeled parts. A stick's effective length
  // includes inter-part loss only between parts. End losses are reserved first.
  function choose(remaining) {
    if (remaining === 0) return [];
    const first = remaining & -remaining;
    let best = null;
    for (let group = remaining; group; group = (group - 1) & remaining) {
      if (!(group & first)) continue;
      const members = parts.filter((_, index) => group & (1 << index));
      const used = members.reduce((total, part) => total + part.long, 0) + (members.length - 1) * gap;
      if (used > capacity + epsilon) continue;
      const rest = choose(remaining ^ group);
      if (rest && (!best || rest.length + 1 < best.length)) {
        best = [{ members, used, remaining: Math.max(0, capacity - used) }, ...rest];
      }
    }
    return best;
  }

  return choose((1 << parts.length) - 1);
}

export function planFrame(input) {
  for (const [key, label] of Object.entries(fields)) {
    const value = input[key];
    if (!Number.isFinite(value) || value < 0 || value > 100000 || (positive.has(key) && value === 0)) {
      return { error: label + " needs " + (positive.has(key) ? "a positive" : "a nonnegative") + " measurement within the input range." };
    }
  }

  const {width, height, face, lip, clearance, depth, stack, reserve, stick, trim, gap} = input;
  if (lip >= face) return { error: "Rabbet lip width must be smaller than the moulding face." };
  if (trim >= stick) return { error: "Total end loss must be smaller than the stick length." };

  const rabbet = [width, height].map(size => size + 2 * clearance);
  const sight = rabbet.map(size => size - 2 * lip);
  if (sight.some(size => size <= epsilon)) return { error: "The lip closes the sight opening. Check the package and profile measurements." };

  const outside = sight.map(size => size + 2 * face);
  const parts = ["Top", "Bottom", "Left", "Right"].map((name, index) => {
    const axis = index < 2 ? 0 : 1;
    return { name, long: outside[axis], rabbet: rabbet[axis], short: sight[axis] };
  });
  const capacity = stick - trim;
  const sticks = stockPlan(parts, capacity, gap);
  const depthRemaining = depth - stack - reserve;
  const minimumOverlap = lip - 2 * clearance;
  const ready = Boolean(sticks && depthRemaining >= -epsilon && minimumOverlap > epsilon);

  return { rabbet, sight, outside, parts, capacity, sticks, depthRemaining, minimumOverlap, ready };
}

export function frameCsv(plan, unit) {
  if (!plan.ready || !["mm", "in"].includes(unit)) return null;
  const size = value => (value / (unit === "in" ? 25.4 : 1)).toFixed(6).replace(/\.?0+$/, "");
  const header = "stick,part,unit,long_point,rabbet_shoulder,short_point,miter_degrees,stick_remainder";
  return [
    header,
    ...plan.sticks.flatMap(({members, remaining}, index) => members.map(({name, long, rabbet, short}) =>
      [index + 1, name, unit, size(long), size(rabbet), size(short), 45, size(remaining)].join(",")
    )),
    ""
  ].join("\r\n");
}
