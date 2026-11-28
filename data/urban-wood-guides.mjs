export const guides = [
  {
    slug: "urban-log-intake",
    title: "Intake for Urban Tree Logs",
    description: "Screen an already-removed city tree log for a mill by recording its source, dimensions, defects, and destination before dispatch.",
    intro: "A tree removed during street maintenance or storm cleanup can become lumber if a mill can use the actual log and a drying facility can take the resulting boards. The intake decision starts with the tree crew’s record and ends with a named recipient who has agreed to take the material.",
    sections: [
      ["Keep the source attached to the log", "Confirm who can release the wood and ask the removal crew for the work order reference, removal date and reason, site or municipal tree ID, and reported species. Label the log before material from another site reaches the staging area. Record who identified the species and leave it as unknown if identification is unresolved. Check movement restrictions for the origin, species, and destination with the relevant plant health authority before dispatch when a pest or regulated area may be involved."],
      ["Send enough detail for the mill to decide", "Record the length, small-end diameter, how you measured it, and the number of logs. Send a side photo and both end photos with the ID visible. Mark pronounced curvature, splits, cavities, decay, soil, and any history of fence wire or hardware. A clean exterior can hide embedded metal. Pass the concern to the receiving mill for its screening process and keep the log on hold while the mill decides whether it can take it. Ask the mill for its actual size limits and unloading arrangements."],
      ["Match the destination to the likely product", "A short, curved trunk may be suitable for short stock even when it cannot supply the long, straight boards a buyer needs. In a Nebraska Forest Service study, staff milled 25 ash logs from Lincoln and compared industrial cants, rough boards, and live-edge slabs. The product choice affected value, and moving green logs and slabs required suitable handling capacity. Ask the mill what could come out of the log and where green lumber will go next before committing the load."],
      ["Example intake decision", "The city offers a storm-cleanup maple as lot UW-014. The log is 8 ft long and 17 in. across the small end over bark. The tree crew reports old fence wire near the butt, so receiving records a hold and sends the work order and photos to the mill. The mill agrees to take the log for inspection under its own process. The sender records the accepting mill, date, and condition of transfer. The destination is the mill’s inspection queue, with any sawing decision recorded afterward."],
    ],
    sources: [
      ["Nebraska Forest Service: Urban Lumber Production and the Lincoln study", "https://nfs.unl.edu/forest-products-utilization-nebraska/urban-lumber-production/"],
      ["University of Illinois Extension: Urban Wood Utilization", "https://extension.illinois.edu/blogs/good-growing/2026-11-20-urban-wood-utilization-second-life-community-trees"],
      ["USDA APHIS: Asian longhorned beetle and movement of host material", "https://www.aphis.usda.gov/plant-pests-diseases/alb"],
    ],
  },
  {
    slug: "reclaimed-lumber-intake",
    title: "Intake for Reclaimed Building Wood",
    description: "Record a salvaged lumber lot’s original use, condition, and evidence so a reuse yard can decide what to accept, hold, or decline.",
    intro: "Salvaged floorboards, timbers, and siding often arrive with very different histories, even from one building. A receiving record ties each bundle to its original use and shows which questions need to be resolved before it goes to a buyer or processor.",
    sections: [
      ["Create a lot for each known source and use", "Ask the supplier for the building or project reference, the room or area, original use, salvage date, and relevant assessment or treatment records. Write down the source of each statement. For example, record the supplier’s description of a floor separately from an attached site assessment. Keep floorboards, painted exterior trim, and former ground-contact stock in separate lots so one documented bundle can move forward while another stays on hold."],
      ["Record the condition in terms a buyer can use", "Count the pieces, note the measured length range and cross-section, and photograph representative faces, ends, and labels. Record nail holes, visible fasteners, splits, rot, coatings, and signs of water damage. Keep the observed length range separate from the clear lengths available after excluding damage. When a grade stamp survives, photograph it and put any intended structural use through the project’s review process with a qualified grading or design professional. Removal damage and past service affect what the wood can be used for."],
      ["Hold bundles with unresolved treatment or coating history", "Flag old painted material, suspected preservative treatment, or unknown industrial exposure for qualified assessment before processing or offering it for reuse. Keep wood with possible lead-based paint on hold and have a qualified professional assess it before disturbing the coating. In the United States, EPA’s Renovation, Repair and Painting Rule can apply to partial deconstruction that disturbs painted surfaces in covered housing or child-occupied facilities. Check the EPA guidance for the activity and site involved. Ask what stock a recipient can receive and what evidence it needs. For example, EPA identifies chromated arsenicals in some older outdoor structures and advises against using that material as mulch or burning it in a residential setting. Record the eventual disposition and supporting evidence on the same lot ID."],
      ["Example intake decision", "A reuse yard receives 24 floorboards and eight painted trim pieces from the same renovation. It opens lot RW-027 for the floorboards, matches them to the documented interior room and assessment, and accepts them into nonstructural stock with a fastener inspection pending before processing. The trim gets its own lot and stays on hold for coating assessment. Each tag carries its lot ID, decision, and next responsible person, keeping the two bundles separate in inventory."],
    ],
    sources: [
      ["US EPA: Reuse and deconstruction of building materials", "https://www.epa.gov/smm/best-practices-reducing-reusing-and-recycling-construction-and-demolition-materials"],
      ["US EPA: Lead-based paint in deconstruction and salvage", "https://www.epa.gov/lead/frequent-questions-about-renovations-covered-rrp-rule"],
      ["US EPA: Chromated arsenicals in treated wood", "https://www.epa.gov/ingredients-used-pesticide-products/chromated-arsenicals-cca"],
      ["US Forest Products Laboratory: Framing lumber recovered from building removal", "https://research.fs.usda.gov/treesearch/45113"],
    ],
  },
  {
    slug: "lot-traceability",
    title: "Track Recovered Wood from Source to Batch",
    description: "Link a recovered wood lot to its source, custody transfers, and output bundles using tags, quantities, and a simple handoff record.",
    intro: "One log can turn into multiple bundles and one delivery can contain material from several sites. A batch ID lets a yard follow a board back to the source and locate affected stock if a concern surfaces after a transfer.",
    sections: [
      ["Start with one identifier per traceable lot", "Write the same ID on the physical tag and the record. Store the source reference, date, reported species or material, quantity and unit, condition, and who supplied the information. Set the tracking unit according to what you can keep together. Use separate log IDs for distinct trees if buyers need a tree-specific origin, or separate bundle IDs for reclaimed stock from different rooms. Record missing provenance as unknown and retain any photos and supporting documents with the lot record."],
      ["Carry the identifier through each transfer", "Record who sent and received the material, both locations, the transfer date, the count and unit, and any holds or scope limits. Ask the recipient to acknowledge the count and condition on arrival. If the count differs, leave the dispatched quantity visible and record the received quantity and discrepancy as a new event. Use separate entries for the mill, drying facility, storage yard, and buyer when each takes custody."],
      ["Record parent lots when a batch splits or merges", "When a mill turns one log into two bundles, give each bundle its own ID, parent lot reference, date, count, and processing state. Where source batches are mixed, list each input lot on the new record and constrain any later provenance claim to what those records support. Use the same unit to reconcile quantities during a same-stage transfer. When the unit changes from logs to boards, identify both quantities and timestamp each stage to distinguish the conversion from an inventory discrepancy."],
      ["Example handoff and inventory check", "The mill clears maple lot UW-014 for processing and tags its green output as UW-014-A with six wide boards and UW-014-B with ten narrower boards. Both tags point back to the original city record. The dryer acknowledges six boards in A and nine in B. The yard records one board missing from B, keeps the transfer open for reconciliation, and leaves the original counts visible. A buyer gets the verified source description for the bundles it actually receives. Use the applicable certification program and its audit records for any certified claim."],
    ],
    sources: [
      ["USRW Certified Wood Standards: Service-specific handoff documentation", "https://www.usrwcertified.com/standards/1-3-service-specific-requirements"],
      ["USRW Certified Wood Standards: Processing, splitting and merging bundles", "https://www.usrwcertified.com/standards/2-5-post-drying-processing-or-remanufacturing-requirements"],
    ],
  },
];
