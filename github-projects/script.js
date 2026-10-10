document.addEventListener("DOMContentLoaded", () => {
    const loadBtn = document.getElementById("load");
    const projectsContainer = document.getElementById("project-list");
    const projectsStatus = document.getElementById("projects-status");

    const form = document.querySelector("form");
    const submitBtn = form.querySelector("button[type='submit']");
    const feedbackSuccess = document.getElementById("feedback-success");
    const formMessage = document.getElementById("form-message");

    const username = "Vinbe0";

    function setProjectsStatus(text, type = "info") {
        projectsStatus.textContent = text;
        projectsStatus.className = "status-message";
        projectsStatus.classList.add(`form-${type}`);
    }

    function showFormMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = "";
        formMessage.classList.add(`form-${type}`);
        formMessage.style.display = "block";
    }

    function formatDate(value) {
        return new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }).format(new Date(value));
    }

    function renderRepo(repo) {
        const card = document.createElement("article");
        card.className = "repo-card";

        const language = repo.language || "Code";
        const description = repo.description || "No description added yet.";

        const body = document.createElement("div");
        const title = document.createElement("h3");
        const summary = document.createElement("p");
        title.textContent = repo.name;
        summary.textContent = description;
        body.append(title, summary);

        const meta = document.createElement("div");
        meta.className = "repo-meta";
        meta.setAttribute("aria-label", "Repository metadata");

        [language, `${repo.stargazers_count} stars`, `Updated ${formatDate(repo.updated_at)}`].forEach((text) => {
            const item = document.createElement("span");
            item.textContent = text;
            meta.appendChild(item);
        });

        const link = document.createElement("a");
        link.href = repo.html_url;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = "Open repo";

        card.append(body, meta, link);

        return card;
    }

    async function loadProjects() {
        loadBtn.disabled = true;
        loadBtn.textContent = "Loading...";
        projectsContainer.innerHTML = "";
        setProjectsStatus("Loading repositories from GitHub...", "info");

        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);

            if (!response.ok) {
                throw new Error(`GitHub returned ${response.status}`);
            }

            const repos = await response.json();

            if (!Array.isArray(repos) || repos.length === 0) {
                setProjectsStatus("No public repositories were found for this GitHub profile.", "error");
                loadBtn.disabled = false;
                loadBtn.textContent = "Try again";
                return;
            }

            const fragment = document.createDocumentFragment();
            repos.forEach((repo) => {
                fragment.appendChild(renderRepo(repo));
            });
            projectsContainer.appendChild(fragment);

            setProjectsStatus(`Loaded ${repos.length} public repositories from GitHub.`, "success");
            loadBtn.textContent = "Projects loaded";
        } catch (error) {
            console.error("Error loading projects:", error);
            setProjectsStatus("Could not load GitHub projects. Check the username or try again later.", "error");
            loadBtn.disabled = false;
            loadBtn.textContent = "Try again";
        }
    }

    loadBtn.addEventListener("click", loadProjects);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (
            !form.name.value.trim() ||
            !form.email.value.trim() ||
            !form.message.value.trim()
        ) {
            showFormMessage("Please fill in all fields.", "error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        showFormMessage("Sending your feedback...", "info");

        const formData = new FormData(form);
        formData.set("access_key", "9587df79-2d5b-438d-8807-06b0e6f88028");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                form.style.display = "none";
                formMessage.style.display = "none";
                feedbackSuccess.style.display = "block";
            } else {
                showFormMessage("Submission failed. Please try again.", "error");
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit feedback";
            }
        } catch (error) {
            console.error(error);
            showFormMessage("Network error. Try again later.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit feedback";
        }
    });
});
