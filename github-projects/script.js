const projectList = document.getElementById("project-list");
const projectsStatus = document.getElementById("projects-status");
const form = document.querySelector(".feedback-form");
const submitBtn = document.getElementById("submit");
const formMessage = document.getElementById("form-message");

let allRepos = null;

function setStatus(node, key, type = "info") {
    node.hidden = false;
    node.dataset.i18n = key;
    node.dataset.state = type;
    node.textContent = t(key);
}

function renderRepo(repo) {
    const item = document.createElement("li");
    const header = document.createElement("div");
    const title = document.createElement("a");
    const meta = document.createElement("span");

    header.className = "project-header";
    title.href = repo.html_url;
    title.target = "_blank";
    title.rel = "noreferrer";
    title.textContent = repo.name;

    meta.className = "row-meta";
    const parts = [repo.language, formatDate(repo.pushed_at, { day: true })];
    if (repo.stargazers_count > 0) {
        parts.push(`★ ${repo.stargazers_count}`);
    }
    meta.textContent = parts.filter(Boolean).join(" · ");

    header.append(title, meta);
    item.appendChild(header);

    if (repo.description) {
        const description = document.createElement("p");
        description.className = "project-description";
        description.textContent = repo.description;
        item.appendChild(description);
    }

    return item;
}

function renderRepos() {
    if (!allRepos) {
        return;
    }
    projectList.replaceChildren(...allRepos.map(renderRepo));
}

async function loadRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=100`);
        if (!response.ok) {
            throw new Error(`GitHub returned ${response.status}`);
        }

        const repos = await response.json();
        allRepos = repos.filter((repo) => !repo.fork && !HIDDEN_REPOS.includes(repo.name));

        if (allRepos.length === 0) {
            setStatus(projectsStatus, "projectsEmpty");
            return;
        }

        projectsStatus.hidden = true;
        renderRepos();
    } catch (error) {
        console.error("Error loading projects:", error);
        setStatus(projectsStatus, "projectsError", "error");
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.name.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
        setStatus(formMessage, "formMissing", "error");
        return;
    }

    if (!form.email.checkValidity()) {
        setStatus(formMessage, "formInvalidEmail", "error");
        return;
    }

    submitBtn.disabled = true;
    setStatus(formMessage, "formSending");

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        });
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Submission failed");
        }

        form.hidden = true;
        setStatus(formMessage, "formSuccess", "success");
    } catch (error) {
        console.error(error);
        setStatus(formMessage, "formError", "error");
        submitBtn.disabled = false;
    }
});

document.addEventListener("sitelanguagechange", renderRepos);

loadRepos();
