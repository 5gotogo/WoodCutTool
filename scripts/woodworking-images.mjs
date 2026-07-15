export const woodworkingImages = [
  {
    src: "/assets/images/woodworking/wood-01-plywood-cut-layout.webp",
    alt: "Plywood sheet with an organized cut layout and measured parts",
    caption: "Plan plywood parts and sheet layout before the first cut."
  },
  {
    src: "/assets/images/woodworking/wood-02-cabinet-hardware.webp",
    alt: "Cabinet door components, wood samples, hinges, and hardware on a worktable",
    caption: "Coordinate cabinet parts, hardware, and visible wood surfaces."
  },
  {
    src: "/assets/images/woodworking/wood-03-track-saw-planning.webp",
    alt: "Track saw positioned on plywood beside measuring and planning tools",
    caption: "Confirm dimensions, kerf, and cut order before breaking down a sheet."
  },
  {
    src: "/assets/images/woodworking/wood-04-joinery-samples.webp",
    alt: "Wood joinery samples arranged for a woodworking project review",
    caption: "Choose joinery and test fit details before final assembly."
  },
  {
    src: "/assets/images/woodworking/wood-05-material-selection.webp",
    alt: "Wood and plywood samples arranged for material selection",
    caption: "Compare material, grain, thickness, and finish before purchasing."
  },
  {
    src: "/assets/images/woodworking/wood-06-drawer-assembly.webp",
    alt: "Drawer box parts and tools prepared for cabinet assembly",
    caption: "Check drawer clearances, part quantities, and assembly order."
  },
  {
    src: "/assets/images/woodworking/wood-07-workshop-bench.webp",
    alt: "Organized woodworking bench with lumber, tools, and project parts",
    caption: "Keep the cut list and labeled parts organized at the workbench."
  },
  {
    src: "/assets/images/woodworking/wood-08-edge-banding.webp",
    alt: "Plywood edge-banding materials and trimming tools on a workbench",
    caption: "Include edge treatment and trimming allowances in the cut plan."
  },
  {
    src: "/assets/images/woodworking/wood-09-closet-planning.webp",
    alt: "Closet shelving and cabinet components laid out for project planning",
    caption: "Group repeated shelves, cabinet panels, and storage components."
  },
  {
    src: "/assets/images/woodworking/wood-10-offcut-storage.webp",
    alt: "Organized plywood and lumber offcuts stored for reuse",
    caption: "Label useful offcuts so future projects can reuse the material."
  },
  {
    src: "/assets/images/woodworking/wood-11-table-saw-planning.webp",
    alt: "Table saw workspace prepared for a measured wood cutting sequence",
    caption: "Review the cutting sequence and support each part safely."
  },
  {
    src: "/assets/images/woodworking/wood-12-site-measurement.webp",
    alt: "Carpentry site measurements, notebook, and wood samples for project planning",
    caption: "Verify field measurements before estimating material or cutting parts."
  }
];

function stableHash(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function topicImageIndexes(value) {
  const text = String(value || "").toLowerCase();
  if (/offcut|scrap|waste|leftover/.test(text)) return [9, 0, 6];
  if (/edge.?band|edge treatment|melamine/.test(text)) return [7, 1, 4];
  if (/join|dowel|mortise|tenon|pocket.?hole/.test(text)) return [3, 1, 6];
  if (/drawer/.test(text)) return [5, 1, 3];
  if (/workbench|workshop|shop|tool chest|router table/.test(text)) return [6, 10, 2];
  if (/closet|wardrobe|shelv|storage|pantry/.test(text)) return [8, 1, 6];
  if (/cabinet|hinge|door|overlay|inset|hardware/.test(text)) return [1, 3, 5, 7, 8];
  if (/track.?saw|circular.?saw|sheet breakdown/.test(text)) return [2, 0, 10];
  if (/table.?saw|cut sequence|repeat cut/.test(text)) return [10, 2, 0];
  if (/measure|estimate|site|stair|rise|run|stringer/.test(text)) return [11, 4, 6];
  if (/material|lumber|wood species|grade|thickness/.test(text)) return [4, 0, 6];
  if (/plywood|sheet|cut.?list|kerf|layout|optimizer/.test(text)) return [0, 2, 10, 9];
  const start = stableHash(text) % woodworkingImages.length;
  return woodworkingImages.map((_, index) => (start + index) % woodworkingImages.length);
}

export function woodworkingImageFor(key, offset = 0) {
  const indexes = topicImageIndexes(key);
  const position = ((offset % indexes.length) + indexes.length) % indexes.length;
  return woodworkingImages[indexes[position]];
}
