(() => {
  "use strict";

  const STORE_VERSION = 1;
  const STORE_KEY = `woodcuttool.projectPlaybooks.v${STORE_VERSION}`;
  let memoryStore = { version: STORE_VERSION, projects: {} };
  let persistentStorageAvailable = false;

  function probePersistentStorage() {
    const probeKey = `${STORE_KEY}.probe`;
    try {
      window.localStorage.setItem(probeKey, "1");
      window.localStorage.removeItem(probeKey);
      persistentStorageAvailable = true;
    } catch {
      persistentStorageAvailable = false;
    }
  }

  function emptyStore() {
    return { version: STORE_VERSION, projects: {} };
  }

  function safeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function readStore() {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return memoryStore;
      const parsed = JSON.parse(raw);
      if (parsed?.version !== STORE_VERSION) return memoryStore;
      memoryStore = {
        version: STORE_VERSION,
        projects: safeObject(parsed.projects),
      };
      return memoryStore;
    } catch {
      persistentStorageAvailable = false;
      return memoryStore;
    }
  }

  function writeStore(store) {
    memoryStore = store;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
      persistentStorageAvailable = true;
    } catch {
      persistentStorageAvailable = false;
    }
  }

  function projectState(slug, metadata = {}) {
    const store = readStore();
    const current = safeObject(store.projects[slug]);
    return {
      slug,
      title: String(metadata.title || current.title || slug),
      route: String(metadata.route || current.route || `/projects/${slug}/`),
      category: String(metadata.category || current.category || "Project"),
      phaseCount: Number(metadata.phaseCount || current.phaseCount || 0),
      started: Boolean(current.started),
      phases: safeObject(current.phases),
      decisions: safeObject(current.decisions),
      brief: safeObject(current.brief),
      lastTouched: String(current.lastTouched || ""),
    };
  }

  function saveProject(state) {
    const store = readStore();
    state.lastTouched = new Date().toISOString();
    store.projects[state.slug] = state;
    writeStore(store);
    return state;
  }

  function removeProject(slug) {
    const store = readStore();
    delete store.projects[slug];
    writeStore(store);
  }

  function completedPhaseCount(state) {
    return Object.values(safeObject(state.phases)).filter(Boolean).length;
  }

  function hasActivity(state) {
    const decisionActivity = Object.values(safeObject(state.decisions)).some((value) => {
      const decision = safeObject(value);
      return Boolean(decision.selected || decision.revealed);
    });
    return Boolean(
      state.started ||
      completedPhaseCount(state) ||
      decisionActivity ||
      Object.values(safeObject(state.brief)).some((value) => String(value || "").trim())
    );
  }

  function updateStorageNote(root) {
    const note = root.querySelector("[data-project-storage-note]");
    if (!note) return;
    note.textContent = persistentStorageAvailable
      ? "Progress stays in this browser only. No account is required; this feature does not send your brief or progress."
      : "Browser storage is unavailable, so progress will last only until this page is closed. Printing and CSV downloads still work.";
    note.dataset.projectStorage = persistentStorageAvailable ? "persistent" : "temporary";
  }

  function csvCell(value) {
    return `"${String(value ?? "").replaceAll('"', '""')}"`;
  }

  function downloadText(filename, text, status) {
    try {
      const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.hidden = true;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      if (status) status.textContent = `Downloaded ${filename}.`;
    } catch {
      if (status) status.textContent = "The progress CSV could not be created in this browser. Use Print or the blank CSV instead.";
    }
  }

  function initHub(root) {
    const cards = [...root.querySelectorAll("[data-project-card]")];
    const search = root.querySelector("[data-project-search]");
    const category = root.querySelector("[data-project-category-filter]");
    const difficulty = root.querySelector("[data-project-difficulty-filter]");
    const sessions = root.querySelector("[data-project-sessions-filter]");
    const status = root.querySelector("[data-project-filter-status]");
    const randomButton = root.querySelector("[data-project-random]");
    const resumeList = root.querySelector("[data-project-resume-list]");

    const visibleCards = () => cards.filter((card) => !card.hidden);
    const applyFilters = () => {
      const query = String(search?.value || "").trim().toLowerCase();
      const categoryValue = String(category?.value || "");
      const difficultyValue = String(difficulty?.value || "");
      const sessionsValue = String(sessions?.value || "");
      let visible = 0;

      cards.forEach((card) => {
        const matches = (
          (!query || String(card.dataset.projectSearch || "").includes(query)) &&
          (!categoryValue || card.dataset.projectCategory === categoryValue) &&
          (!difficultyValue || card.dataset.projectDifficulty === difficultyValue) &&
          (!sessionsValue || card.dataset.projectSessions === sessionsValue)
        );
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      if (status) {
        status.textContent = `Showing ${visible} of ${cards.length} project playbooks.`;
      }
      if (randomButton) randomButton.disabled = visible === 0;
    };

    [search, category, difficulty, sessions].filter(Boolean).forEach((control) => {
      control.addEventListener(control === search ? "input" : "change", applyFilters);
    });

    randomButton?.addEventListener("click", () => {
      const choices = visibleCards();
      if (!choices.length) return;
      const chosen = choices[Math.floor(Math.random() * choices.length)];
      const route = chosen.dataset.projectRoute;
      if (route) window.location.assign(route);
    });

    if (resumeList) {
      const projects = Object.values(readStore().projects)
        .map((value) => projectState(String(value?.slug || ""), value))
        .filter((state) => state.slug && hasActivity(state))
        .sort((a, b) => String(b.lastTouched).localeCompare(String(a.lastTouched)))
        .slice(0, 6);

      resumeList.replaceChildren();
      if (!projects.length) {
        const empty = document.createElement("p");
        empty.className = "project-resume-empty";
        empty.textContent = "No saved playbook yet. Start any project below and this area will offer a private resume shortcut.";
        resumeList.append(empty);
      } else {
        projects.forEach((state) => {
          const link = document.createElement("a");
          link.className = "project-resume-card";
          link.href = state.route;

          const eyebrow = document.createElement("span");
          eyebrow.className = "project-resume-category";
          eyebrow.textContent = state.category;

          const title = document.createElement("strong");
          title.className = "project-resume-title";
          title.textContent = state.title;

          const progress = document.createElement("span");
          progress.className = "project-resume-progress";
          progress.textContent = `${completedPhaseCount(state)} of ${state.phaseCount || 6} phases complete`;

          link.append(eyebrow, title, progress);
          resumeList.append(link);
        });
      }
    }

    applyFilters();
    updateStorageNote(root);
  }

  function initPlaybook(root) {
    const slug = String(root.dataset.projectSlug || "");
    if (!slug) return;

    const metadata = {
      title: root.dataset.projectTitle,
      route: root.dataset.projectRoute,
      category: root.dataset.projectCategory,
      phaseCount: Number(root.dataset.projectPhaseCount || 0),
    };
    let state = projectState(slug, metadata);
    const phaseInputs = [...root.querySelectorAll("[data-project-phase]")];
    const briefFields = [...root.querySelectorAll("[data-project-brief-field]")];
    const decisionBlocks = [...root.querySelectorAll("[data-project-decision]")];
    const progress = root.querySelector("[data-project-progress]");
    const progressText = root.querySelector("[data-project-progress-text]");
    const startButton = root.querySelector("[data-project-start]");
    const resumeButton = root.querySelector("[data-project-resume]");
    const clearButton = root.querySelector("[data-project-clear]");
    const downloadButton = root.querySelector("[data-project-download-progress]");
    const status = root.querySelector("[data-project-live-status]");

    const persist = () => {
      state = saveProject(state);
      updateStorageNote(root);
    };

    const updateProgress = () => {
      const complete = phaseInputs.filter((input) => input.checked).length;
      const total = phaseInputs.length;
      if (progress) {
        progress.max = total;
        progress.value = complete;
      }
      if (progressText) {
        progressText.textContent = `${complete} of ${total} phases complete`;
        progressText.dataset.projectComplete = complete === total ? "true" : "false";
      }
      const active = hasActivity(state);
      if (startButton) startButton.hidden = active;
      if (resumeButton) {
        resumeButton.hidden = !active;
        resumeButton.textContent = complete === total && total
          ? "Review completed playbook"
          : (complete ? `Resume at phase ${Math.min(complete + 1, total)}` : "Resume project brief");
      }
    };

    phaseInputs.forEach((input) => {
      const id = String(input.dataset.projectPhase || input.value || "");
      input.checked = Boolean(state.phases[id]);
      input.addEventListener("change", () => {
        state.started = true;
        state.phases[id] = input.checked;
        persist();
        updateProgress();
        if (status) status.textContent = input.checked ? "Phase marked complete and saved locally." : "Phase reopened and saved locally.";
      });
    });

    briefFields.forEach((field) => {
      const id = String(field.dataset.projectBriefField || field.name || "");
      field.value = String(state.brief[id] || "");
      field.addEventListener("input", () => {
        state.started = true;
        state.brief[id] = field.value;
        persist();
        updateProgress();
      });
    });

    const renderDecision = (block, decisionState) => {
      const reveal = block.querySelector("[data-project-decision-result]");
      const revealButton = block.querySelector("[data-project-decision-reveal]");
      const selected = block.querySelector("[data-project-decision-choice]:checked");
      const selectedValue = String(selected?.value || "");
      if (revealButton) revealButton.disabled = !selectedValue;
      if (revealButton) revealButton.setAttribute("aria-expanded", decisionState.revealed ? "true" : "false");
      if (reveal) reveal.hidden = !decisionState.revealed;
      block.querySelectorAll("[data-project-decision-outcome]").forEach((outcome) => {
        outcome.hidden = !(decisionState.revealed && outcome.dataset.projectDecisionOutcome === selectedValue);
      });
    };

    decisionBlocks.forEach((block) => {
      const id = String(block.dataset.projectDecision || "");
      const stored = safeObject(state.decisions[id]);
      state.decisions[id] = { selected: String(stored.selected || ""), revealed: Boolean(stored.revealed) };
      const choices = [...block.querySelectorAll("[data-project-decision-choice]")];
      const savedChoice = choices.find((choice) => choice.value === state.decisions[id].selected);
      if (savedChoice) savedChoice.checked = true;

      choices.forEach((choice) => {
        choice.addEventListener("change", () => {
          state.started = true;
          state.decisions[id] = { selected: choice.value, revealed: false };
          persist();
          renderDecision(block, state.decisions[id]);
          updateProgress();
          if (status) status.textContent = "Decision selected. Reveal the planning consequence when you are ready.";
        });
      });

      block.querySelector("[data-project-decision-reveal]")?.addEventListener("click", () => {
        const selected = block.querySelector("[data-project-decision-choice]:checked");
        if (!selected) return;
        state.started = true;
        state.decisions[id] = { selected: selected.value, revealed: true };
        persist();
        renderDecision(block, state.decisions[id]);
        updateProgress();
        const result = block.querySelector("[data-project-decision-result]");
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        result?.focus({ preventScroll: true });
        result?.scrollIntoView({ behavior, block: "nearest" });
        if (status) status.textContent = "Planning consequence revealed and saved locally.";
      });

      renderDecision(block, state.decisions[id]);
    });

    const moveToWork = ({ preferBrief = false } = {}) => {
      state.started = true;
      persist();
      updateProgress();
      const firstIncomplete = phaseInputs.find((input) => !input.checked);
      const brief = root.querySelector("[data-project-brief]");
      const target = preferBrief || completedPhaseCount(state) === 0
        ? brief
        : (firstIncomplete?.closest("[data-project-phase-block]") || brief);
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior, block: "start" });
      if (status) status.textContent = "Playbook started. Progress will stay in this browser.";
    };

    startButton?.addEventListener("click", () => moveToWork({ preferBrief: true }));
    resumeButton?.addEventListener("click", () => moveToWork());

    root.querySelector("[data-project-print]")?.addEventListener("click", () => window.print());

    clearButton?.addEventListener("click", () => {
      const approved = window.confirm("Clear the saved brief, phase progress, and decision choices for this playbook on this browser?");
      if (!approved) return;
      removeProject(slug);
      state = projectState(slug, metadata);
      phaseInputs.forEach((input) => { input.checked = false; });
      briefFields.forEach((field) => { field.value = ""; });
      decisionBlocks.forEach((block) => {
        block.querySelectorAll("[data-project-decision-choice]").forEach((choice) => { choice.checked = false; });
        const id = String(block.dataset.projectDecision || "");
        state.decisions[id] = { selected: "", revealed: false };
        renderDecision(block, state.decisions[id]);
      });
      updateProgress();
      updateStorageNote(root);
      if (status) status.textContent = "Saved playbook progress cleared from this browser.";
    });

    downloadButton?.addEventListener("click", () => {
      const rows = [
        ["Record type", "Order", "Status / choice", "Item", "Project value / note"],
        ["Project", "", "", metadata.title || slug, metadata.route || ""],
      ];

      briefFields.forEach((field, index) => {
        const label = field.labels?.[0]?.textContent?.trim() || field.name;
        rows.push(["Brief", index + 1, field.value.trim() ? "Recorded" : "Open", label, field.value]);
      });
      phaseInputs.forEach((input, index) => {
        const heading = input.closest("[data-project-phase-block]")?.querySelector("h3")?.textContent?.trim();
        const label = heading || input.labels?.[0]?.textContent?.trim() || `Phase ${index + 1}`;
        rows.push(["Phase", index + 1, input.checked ? "Complete" : "Open", label, ""]);
      });
      decisionBlocks.forEach((block, index) => {
        const id = String(block.dataset.projectDecision || "");
        const heading = block.querySelector("[data-project-decision-title]")?.textContent?.trim() || `Decision ${index + 1}`;
        const selected = block.querySelector("[data-project-decision-choice]:checked");
        const label = selected?.dataset.projectDecisionLabel || "";
        rows.push(["Decision", index + 1, state.decisions[id]?.revealed ? "Reviewed" : (selected ? "Selected" : "Open"), heading, label]);
      });

      const csv = `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
      downloadText(`${slug}-progress.csv`, csv, status);
    });

    updateProgress();
    updateStorageNote(root);
  }

  probePersistentStorage();
  const hub = document.querySelector("[data-project-hub]");
  const playbook = document.querySelector("[data-project-playbook]");
  if (hub) initHub(hub);
  if (playbook) initPlaybook(playbook);
})();
