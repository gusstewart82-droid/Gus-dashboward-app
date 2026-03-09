const agents = [
  {
    id: "command-centre",
    name: "Command Centre",
    role: "Primary orchestrator",
    icon: "🧭",
    status: "Coordinating daily game plan",
    focus: "Prioritizing tasks and dispatching missions to each specialist.",
    quickLinks: [
      { label: "Control docs", url: "https://docs.google.com/" },
      { label: "Strategy board", url: "https://miro.com/" }
    ]
  },
  {
    id: "builder",
    name: "Builder",
    role: "Apps + Web",
    icon: "🛠️",
    status: "Drafting Gus dashboard layout",
    focus: "Turns specs from Command Centre into working products.",
    quickLinks: [
      { label: "Latest build", url: "https://github.com/gusstewart82-droid/Gus-dashboward-app" }
    ]
  },
  {
    id: "researcher",
    name: "Researcher",
    role: "Insights + Specs",
    icon: "🔍",
    status: "Comparing CRM automations",
    focus: "Provides briefs, user research, and reference material.",
    quickLinks: [
      { label: "Knowledge base", url: "https://www.notion.so" }
    ]
  },
  {
    id: "ops",
    name: "Ops",
    role: "Automation + Monitoring",
    icon: "⚙️",
    status: "Checking cron + alerting",
    focus: "Keeps infrastructure healthy and alerts when attention is needed.",
    quickLinks: [
      { label: "Status page", url: "https://status.openclaw.ai" }
    ]
  }
];

let projectData = [
  {
    id: "client-loop",
    name: "Client Loyalty OS",
    status: "Discovery",
    owner: "Builder",
    summary: "Map retention journeys + upsell touchpoints for detailing clients."
  },
  {
    id: "automation",
    name: "Automation Backbone",
    status: "Build",
    owner: "Ops",
    summary: "Wire Supabase + cron runners so agents can trigger workflows."
  },
  {
    id: "playbook",
    name: "Agent Playbook",
    status: "Drafting",
    owner: "Researcher",
    summary: "Document what each agent owns, SLAs, and success metrics."
  }
];

const grid = document.getElementById("agent-grid");
const detailTitle = document.getElementById("agent-detail-name");
const detailNode = document.getElementById("agent-detail");
const navButtons = document.querySelectorAll(".sidebar__btn[data-view]");
const panels = document.querySelectorAll("[data-panel]");
const projectGrid = document.getElementById("project-grid");
const addProjectBtn = document.getElementById("add-project");

const renderCard = (agent) => {
  const card = document.createElement("button");
  card.className = "agent-card";
  card.setAttribute("data-agent", agent.id);
  card.innerHTML = `
    <span class="agent-card__icon">${agent.icon}</span>
    <h3 class="agent-card__name">${agent.name}</h3>
    <p class="agent-card__role">${agent.role}</p>
    <p class="agent-card__status">${agent.status}</p>
  `;
  card.addEventListener("click", () => {
    document.querySelectorAll(".agent-card").forEach((node) => node.classList.remove("active"));
    card.classList.add("active");
    setActiveAgent(agent.id);
  });
  return card;
};

const setActiveAgent = (agentId) => {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return;
  detailTitle.textContent = agent.name;
  detailNode.innerHTML = `
    <div class="agent-detail__status">${agent.icon} ${agent.status}</div>
    <p>${agent.focus}</p>
    <div>
      <p class="eyebrow">Quick links</p>
      <div class="quick-links">
        ${agent.quickLinks
          .map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`)
          .join("")}
      </div>
    </div>
  `;
};

const renderProjects = () => {
  if (!projectGrid) return;
  projectGrid.innerHTML = "";

  if (!projectData.length) {
    projectGrid.innerHTML = '<div class="empty-state">No projects yet. Add one to get started.</div>';
    return;
  }

  projectData.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <button type="button" aria-label="Remove ${project.name}" data-remove="${project.id}">✖</button>
      <h3 class="project-card__title">${project.name}</h3>
      <div class="project-card__meta">
        <span class="tag">${project.status}</span>
        <span>${project.owner}</span>
      </div>
      <p class="project-card__summary">${project.summary}</p>
    `;

    const removeBtn = card.querySelector("[data-remove]");
    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      removeProject(project.id);
    });

    projectGrid.appendChild(card);
  });
};

const removeProject = (projectId) => {
  projectData = projectData.filter((project) => project.id !== projectId);
  renderProjects();
};

const handleAddProject = () => {
  const name = window.prompt("Project name?");
  if (!name || !name.trim()) return;

  const summary = window.prompt("What is this project about?", "Quick description...") || "Description coming soon.";
  const owner = window.prompt("Who leads it?", "Unassigned") || "Unassigned";

  projectData = [
    {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      status: "Backlog",
      owner: owner.trim(),
      summary: summary.trim()
    },
    ...projectData
  ];

  renderProjects();
};

const setView = (view) => {
  navButtons.forEach((btn) => {
    if (btn.dataset.view === view) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  panels.forEach((panel) => {
    if (panel.dataset.panel === view) {
      panel.classList.add("is-active");
    } else {
      panel.classList.remove("is-active");
    }
  });
};

navButtons.forEach((btn) => btn.addEventListener("click", () => setView(btn.dataset.view)));
if (addProjectBtn) {
  addProjectBtn.addEventListener("click", handleAddProject);
}

grid && agents.forEach((agent) => grid.appendChild(renderCard(agent)));
setActiveAgent(agents[0].id);
renderProjects();
