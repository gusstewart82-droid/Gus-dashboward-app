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

const grid = document.getElementById("agent-grid");
const detailTitle = document.getElementById("agent-detail-name");
const detailNode = document.getElementById("agent-detail");

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
  card.addEventListener("click", () => setActiveAgent(agent.id));
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

agents.forEach((agent) => grid.appendChild(renderCard(agent)));
setActiveAgent(agents[0].id);
