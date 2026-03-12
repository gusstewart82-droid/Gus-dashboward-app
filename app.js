import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://npxnficupvqsieritzzg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5weG5maWN1cHZxc2llcml0enpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTUzNjUsImV4cCI6MjA4ODYzMTM2NX0.7DKdO9oU2H0sx6OsJ4myprQr0Bs4qcFkdbol0cKp5Xo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const grid = document.getElementById("agent-grid");
const detailTitle = document.getElementById("agent-detail-name");
const detailNode = document.getElementById("agent-detail");
const navButtons = document.querySelectorAll(".sidebar__btn[data-view]");
const panels = document.querySelectorAll("[data-panel]");
const projectGrid = document.getElementById("project-grid");
const addProjectBtn = document.getElementById("add-project");
const statusBadge = document.getElementById("live-status");

let agentData = [];
let projectData = [];

const setStatus = (text) => {
  if (!statusBadge) return;
  statusBadge.textContent = text;
};

const fetchAgents = async () => {
  setStatus("Syncing Supabase data…");
  const { data, error } = await supabase.from("agents").select("*").order("order_index", { ascending: true });
  if (error) {
    console.error(error);
    setStatus("Failed to load agents");
    return;
  }
  agentData = data || [];
  renderAgents();
  setStatus(`Last sync ${new Date().toLocaleTimeString()}`);
};

const fetchProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*").order("priority", { ascending: true });
  if (error) {
    console.error(error);
    setStatus("Failed to load projects");
    return;
  }
  projectData = data || [];
  renderProjects();
};

const renderAgents = () => {
  if (!grid) return;
  grid.innerHTML = "";
  agentData.forEach((agent, index) => {
    const card = document.createElement("button");
    card.className = "agent-card";
    card.setAttribute("data-agent", agent.slug);
    card.innerHTML = `
      <span class="agent-card__icon">${agent.icon || "🧠"}</span>
      <h3 class="agent-card__name">${agent.name}</h3>
      <p class="agent-card__role">${agent.role || ""}</p>
      <p class="agent-card__status">${agent.status || ""}</p>
    `;
    card.addEventListener("click", () => {
      document.querySelectorAll(".agent-card").forEach((node) => node.classList.remove("active"));
      card.classList.add("active");
      setActiveAgent(agent.slug);
    });
    grid.appendChild(card);
    if (index === 0) {
      card.classList.add("active");
      setActiveAgent(agent.slug);
    }
  });
};

const setActiveAgent = (slug) => {
  const agent = agentData.find((a) => a.slug === slug);
  if (!agent) return;
  detailTitle.textContent = agent.name;
  const quickLinks = Array.isArray(agent.quick_links)
    ? agent.quick_links
    : JSON.parse(agent.quick_links || "[]");
  detailNode.innerHTML = `
    <div class="agent-detail__status">${agent.icon || "🧠"} ${agent.status || "Status"}</div>
    <p>${agent.focus || ""}</p>
    <div>
      <p class="eyebrow">Quick links</p>
      <div class="quick-links">
        ${quickLinks.length
          ? quickLinks
              .map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`)
              .join("")
          : "<span>No links yet.</span>"}
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
    const updated = project.last_update ? new Date(project.last_update).toLocaleDateString() : "";
    card.className = "project-card";
    card.innerHTML = `
      <button type="button" aria-label="Remove ${project.name}" data-remove="${project.id}">✖</button>
      <h3 class="project-card__title">${project.name}</h3>
      <div class="project-card__meta">
        <span class="tag">${project.status || "Status"}</span>
        <span>${project.owner || "Unassigned"}</span>
      </div>
      <p class="project-card__summary">${project.summary || ""}</p>
      <p class="project-card__timestamp">Last update: ${updated}</p>
    `;
    card.querySelector("[data-remove]").addEventListener("click", (event) => {
      event.stopPropagation();
      removeProject(project.id);
    });
    projectGrid.appendChild(card);
  });
};

const removeProject = async (projectId) => {
  const confirmed = window.confirm("Remove this project from the board?");
  if (!confirmed) return;
  await supabase.from("projects").delete().eq("id", projectId);
  fetchProjects();
};

const handleAddProject = async () => {
  const name = window.prompt("Project name?");
  if (!name || !name.trim()) return;
  const summary =
    window.prompt("What is this project about?", "Quick description...") || "Description coming soon.";
  const owner = window.prompt("Who leads it?", "Unassigned") || "Unassigned";
  await supabase.from("projects").insert({
    slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
    name: name.trim(),
    summary: summary.trim(),
    owner: owner.trim(),
    status: "Backlog",
    priority: 5,
    last_update: new Date().toISOString()
  });
  fetchProjects();
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

(async function init() {
  await Promise.all([fetchAgents(), fetchProjects()]);
  setInterval(() => {
    fetchAgents();
    fetchProjects();
  }, 60 * 1000);
})();
