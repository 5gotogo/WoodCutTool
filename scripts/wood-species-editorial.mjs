// Reviewed descriptions for existing high-interest routes; values are not stock certifications.
export const woodSpeciesEditorial = {
  maple: {
    title: 'Maple Wood: Hard vs Soft Maple, Weight & Uses',
    description: 'Compare hard and soft maple for cabinets and furniture. Understand the 1,450 lbf hard-maple reference, estimate board weight, and check your actual stock.',
    lead: 'Maple is used for cabinets, furniture, and work surfaces, but hard maple and soft maple are not interchangeable specifications. The 1,450 lbf hardness reference here describes hard maple; identify your stock before using it to compare dent resistance or estimate weight.',
    heading: 'Hard maple or soft maple: what should you order?',
    paragraphs: [
      'Ask the supplier for the species and moisture condition, not just “maple.” Hard maple commonly refers to sugar maple. Red maple is one of the soft maples: the USDA describes its wood as lighter and softer than sugar maple. A single hardness figure does not cover every maple board.',
      'For visible cabinet doors, compare color and grain across the whole set before cutting. Make the finish sample from the same stock: the Maple Flooring Manufacturers Association notes that sugar maple does not stain uniformly. For painted parts, evaluate the sample finish instead of buying on hardness alone.',
      'Example weight estimate: a finished board 48 × 12 × 0.75 inches occupies 0.25 ft³. With an assumed density of 42 lb/ft³, its estimated weight is 10.5 lb. This is a worked assumption, not a measured weight or a value for all maple species.'
    ],
    sources: [
      ['MFMA: sugar maple physical properties', 'https://www.maplefloor.org/en/physical-properties-and-characteristics/'],
      ['USDA Forest Service: red maple wood characteristics', 'https://research.fs.usda.gov/silvics/red-maple']
    ],
    links: [['/wood/hard-maple/', 'Hard maple profile'], ['/wood/soft-maple/', 'Soft maple profile'], ['/wood-weight-calculator/', 'Estimate your board weight'], ['/cabinet-door-calculator/', 'Size cabinet doors']],
    faqs: [
      ['Is soft maple a softwood?', 'No. “Soft maple” is a trade grouping within the hardwood maples. Its name compares it with hard maple; it does not make it a coniferous softwood. Confirm the species with your supplier.'],
      ['Does every maple have a Janka hardness of 1,450 lbf?', 'No. The 1,450 lbf reference used here is for hard maple. Soft maple species have different properties, so the supplier’s species identification matters.'],
      ['How do I estimate the weight of a maple board?', 'Multiply actual length, width, and thickness in inches, divide by 1,728, then multiply by density in lb/ft³ and quantity. Use a density for the actual species and moisture condition.']
    ]
  },
  'red-oak': {
    title: 'Red Oak Wood: Weight, Hardness & Cabinet Uses',
    description: 'Plan red oak cabinets and furniture with species-specific weight guidance, a board-weight example, Janka hardness, and links to door and lumber calculators.',
    lead: 'Red oak is used for flooring, cabinets, tables, and stairs. Northern red oak is the reference behind the 1,290 lbf hardness value on this page. For weight, identify the species and moisture condition: dry furniture stock and green lumber can differ substantially.',
    heading: 'Estimate red oak weight before sizing the parts',
    paragraphs: [
      'USDA Hardwoods of North America lists northern red oak (Quercus rubra) at about 44 lb/ft³ at 12% moisture content and 63 lb/ft³ green. Those are reference averages for different conditions, not an allowable load or a guaranteed supplier specification.',
      'Example: a finished board 48 × 12 × 0.75 inches occupies 0.25 ft³. At 44 lb/ft³ it weighs about 11 lb; at the green reference of 63 lb/ft³ the same volume would be about 15.75 lb. Measure the actual dimensions and choose the appropriate density before multiplying by quantity.',
      'For cabinet doors, settle the opening size, inset or overlay, and the center gap before ordering parts. Keep the solid-wood frame and center-panel construction separate in the cut list; finished door size is not automatically a rail or panel cutting dimension.'
    ],
    sources: [
      ['USDA: Hardwoods of North America, oak weight tables', 'https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr83.pdf'],
      ['Menominee Tribal Enterprises: northern red oak', 'https://www.mtewood.com/LumberProducts/NorthernRedOak']
    ],
    links: [['/wood-weight-calculator/', 'Calculate red oak weight'], ['/cabinet-door-calculator/', 'Calculate finished door sizes'], ['/board-foot-calculator/', 'Estimate lumber volume'], ['/wood/white-oak/', 'Compare white oak']],
    faqs: [
      ['How much does red oak weigh per cubic foot?', 'The USDA reference for northern red oak is about 44 lb/ft³ at 12% moisture content and 63 lb/ft³ green. Check species and moisture before applying either value to your stock.'],
      ['How hard is northern red oak?', 'The Janka reference used here is 1,290 lbf for northern red oak. Hardness describes resistance to indentation; it is not a shelf-span or structural load rating.'],
      ['Can I use a red oak board weight for red oak plywood?', 'Do not assume the same density. A veneered panel contains a core and adhesive as well as the face veneer. Use the panel manufacturer’s density or weigh a known-size sample.']
    ]
  }
};
