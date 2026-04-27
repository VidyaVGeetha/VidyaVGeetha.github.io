const GITHUB_REPOS_API = "https://api.github.com/users/VidyaVGeetha/repos?per_page=100&sort=updated";

let projects = [];

const projectGrid = document.querySelector("#projectGrid");
const visibleCount = document.querySelector("#visibleCount");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const techFilter = document.querySelector("#techFilter");
const categoryOverview = document.querySelector("#categoryOverview");
const toolGroups = document.querySelector("#toolGroups");
const totalProjects = document.querySelector("#totalProjects");

function classifyProject(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes("powerbi") || text.includes("power bi") || text.includes("cognos")) return "BI dashboards";
  if (text.includes("sql") || text.includes("sqlite") || text.includes("crime") || text.includes("school") || text.includes("socioeconomic")) return "SQL and public data";
  if (text.includes("regression") || text.includes("prediction") || text.includes("cost") || text.includes("salary") || text.includes("outlier") || text.includes("machine")) return "Predictive analytics";
  if (text.includes("api") || text.includes("scraping") || text.includes("requests") || text.includes("email") || text.includes("linkedin")) return "APIs and automation";
  if (text.includes("dashboard") || text.includes("dash") || text.includes("streamlit") || text.includes("plotly")) return "Python dashboards";
  if (text.includes("visual") || text.includes("wordcloud") || text.includes("waffle") || text.includes("folium") || text.includes("map") || text.includes("immigration")) return "Data visualization";
  return "Business analytics";
}

function inferTechnology(repo) {
  const text = `${repo.name} ${repo.description || ""}`.toLowerCase();
  if (text.includes("powerbi") || text.includes("power bi")) return "Power BI";
  if (text.includes("cognos")) return "IBM Cognos";
  if (text.includes("testing")) return "Testing";
  if (text.includes("portfolio")) return "Portfolio";
  return repo.language || "Analytics";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

async function fetchGitHubProjects() {
  const repos = [];
  let page = 1;

  while (true) {
    const response = await fetch(`${GITHUB_REPOS_API}&page=${page}`);
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const pageRepos = await response.json();
    repos.push(...pageRepos);
    if (pageRepos.length < 100) break;
    page += 1;
  }

  return repos
    .filter((repo) => !repo.private && !repo.fork)
    .map((repo) => {
      const description = repo.description || "GitHub portfolio project.";
      return {
        name: repo.name,
        description,
        url: repo.html_url,
        tech: inferTechnology(repo),
        updated: (repo.pushed_at || repo.updated_at || repo.created_at || "").slice(0, 10),
        category: classifyProject(repo.name, description)
      };
    });
}

function setOptions(select, values, firstLabel) {
  const currentValue = select.value;
  select.innerHTML = `<option value="All">${firstLabel}</option>`;
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  select.value = values.includes(currentValue) ? currentValue : "All";
}

function refreshFilters() {
  const categories = [...new Set(projects.map((project) => project.category))].sort();
  const technologies = [...new Set(projects.map((project) => project.tech))].sort();
  setOptions(categoryFilter, categories, "All classifications");
  setOptions(techFilter, technologies, "All technologies");
}

function renderToolGroups() {
  const grouped = projects.reduce((groups, project) => {
    groups[project.tech] ||= [];
    groups[project.tech].push(project);
    return groups;
  }, {});

  const tools = Object.entries(grouped)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

  toolGroups.innerHTML = tools.map(([tool, toolProjects]) => {
    const topProjects = toolProjects.slice(0, 5);
    return `
      <article class="tool-group">
        <div class="tool-group-header">
          <div>
            <span>${escapeHTML(tool)}</span>
            <h3>${escapeHTML(tool)} Projects</h3>
          </div>
          <strong>${toolProjects.length}</strong>
        </div>
        <ul>
          ${topProjects.map((project) => `
            <li>
              <a href="${escapeHTML(project.url)}" target="_blank" rel="noreferrer">${escapeHTML(project.name.replaceAll("-", " "))}</a>
            </li>
          `).join("")}
        </ul>
        <button class="tool-filter-button" type="button" data-tool="${escapeHTML(tool)}">Show ${escapeHTML(tool)} projects</button>
      </article>
    `;
  }).join("");

  toolGroups.querySelectorAll(".tool-filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      techFilter.value = button.dataset.tool;
      categoryFilter.value = "All";
      searchInput.value = "";
      renderProjects();
      document.querySelector("#projects").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderCategoryOverview() {
  const categories = [...new Set(projects.map((project) => project.category))].sort();
  categoryOverview.innerHTML = categories.map((category) => {
    const count = projects.filter((project) => project.category === category).length;
    return `
      <article>
        <strong>${count}</strong>
        <span>${escapeHTML(category)}</span>
      </article>
    `;
  }).join("");
}

function renderProjects() {
  const search = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedTech = techFilter.value;

  const filtered = projects.filter((project) => {
    const searchText = `${project.name} ${project.description} ${project.tech} ${project.category}`.toLowerCase();
    const matchesSearch = !search || searchText.includes(search);
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesTech = selectedTech === "All" || project.tech === selectedTech;
    return matchesSearch && matchesCategory && matchesTech;
  });

  visibleCount.textContent = `Showing ${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
  projectGrid.innerHTML = filtered.map((project) => `
    <article class="project-card">
      <div class="project-meta">
        <span>${escapeHTML(project.category)}</span>
        <time datetime="${escapeHTML(project.updated)}">${escapeHTML(project.updated)}</time>
      </div>
      <h3>${escapeHTML(project.name.replaceAll("-", " "))}</h3>
      <p>${escapeHTML(project.description)}</p>
      <div class="card-footer">
        <span>${escapeHTML(project.tech)}</span>
        <a href="${escapeHTML(project.url)}" target="_blank" rel="noreferrer">View project</a>
      </div>
    </article>
  `).join("") || `<p class="empty">No matching projects found.</p>`;
}

function updateProjectData(nextProjects) {
  projects = nextProjects;
  totalProjects.textContent = projects.length;
  refreshFilters();
  renderCategoryOverview();
  renderToolGroups();
  renderProjects();
}

[searchInput, categoryFilter, techFilter].forEach((control) => {
  control.addEventListener("input", renderProjects);
});

projectGrid.innerHTML = `<p class="empty">Loading live GitHub projects...</p>`;

fetchGitHubProjects()
  .then(updateProjectData)
  .catch(() => {
    totalProjects.textContent = "Live";
    visibleCount.textContent = "GitHub projects unavailable";
    projectGrid.innerHTML = `<p class="empty">GitHub projects could not be loaded right now. Please refresh the page later.</p>`;
  });
