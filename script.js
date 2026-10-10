const translations = {
    English: {
        pageTitle: "Ashmat Nassimi",
        navHome: "Home",
        navProjects: "Projects",
        languageLabel: "Language",
        subtitle: "Computer Science student · Full stack developer",
        bioP1: "I'm a second-year Computer Science student at Satbayev University and a full stack developer. I'm learning by building real projects in web development and software engineering.",
        bioP2: "I started programming with Python at 15, after getting my first PC. I enjoy experimenting with new technologies, solving problems, and collaborating with others to bring ideas to life.",
        projectsTitle: "Projects",
        projectsText: "Experiments, practice work, and ideas as they grow into better software.",
        projectsMore: "All projects →",
        skillsTitle: "Skills",
        linksTitle: "Elsewhere",
        footerText: "Open to collaboration and practical project work."
    },
    Kazakh: {
        pageTitle: "Ашмат Насими",
        navHome: "Басты бет",
        navProjects: "Жобалар",
        languageLabel: "Тіл",
        subtitle: "Компьютерлік ғылымдар студенті · Full stack әзірлеуші",
        bioP1: "Мен Сәтбаев университетінің Компьютерлік ғылымдар мамандығының екінші курс студентімін және full stack әзірлеушімін. Веб әзірлеу мен бағдарламалық инженерияны нақты жобалар жасау арқылы үйреніп жүрмін.",
        bioP2: "15 жасымда бірінші компьютерімді алғаннан кейін Python тілінде бағдарламалауды бастадым. Жаңа технологияларды сынап көру, мәселелерді шешу және идеяларды жүзеге асыру үшін басқалармен бірге жұмыс істеу маған ұнайды.",
        projectsTitle: "Жобалар",
        projectsText: "Тәжірибелер, практикалық жұмыстар және жақсы бағдарламаларға айналып жатқан идеялар.",
        projectsMore: "Барлық жобалар →",
        skillsTitle: "Дағдылар",
        linksTitle: "Байланыс",
        footerText: "Ынтымақтастыққа және практикалық жобаларға ашықпын."
    },
    Russian: {
        pageTitle: "Ашмат Насими",
        navHome: "Главная",
        navProjects: "Проекты",
        languageLabel: "Язык",
        subtitle: "Студент Computer Science · Full stack разработчик",
        bioP1: "Я студент второго курса Computer Science в Университете Сатпаева и full stack разработчик. Изучаю веб-разработку и software engineering на реальных проектах.",
        bioP2: "Я начал программировать на Python в 15 лет, когда купил свой первый ПК. Мне нравится экспериментировать с новыми технологиями, решать задачи и вместе с другими воплощать идеи в жизнь.",
        projectsTitle: "Проекты",
        projectsText: "Эксперименты, практические работы и идеи, которые постепенно становятся лучше.",
        projectsMore: "Все проекты →",
        skillsTitle: "Навыки",
        linksTitle: "Ссылки",
        footerText: "Открыт к сотрудничеству и практической проектной работе."
    }
};

const languageSelect = document.getElementById("language");
const translatedNodes = document.querySelectorAll("[data-i18n]");

function updateLanguage(lang) {
    const dictionary = translations[lang] || translations.English;

    translatedNodes.forEach((node) => {
        const key = node.dataset.i18n;
        if (dictionary[key]) {
            node.textContent = dictionary[key];
        }
    });

    document.documentElement.lang = lang === "Russian" ? "ru" : lang === "Kazakh" ? "kk" : "en";
    document.title = dictionary.pageTitle;
}

function initialLanguage() {
    try {
        const saved = localStorage.getItem("language");
        if (translations[saved]) {
            return saved;
        }
    } catch (error) {}

    const browserLanguages = navigator.languages || [navigator.language || ""];
    for (const code of browserLanguages) {
        const base = code.toLowerCase().split("-")[0];
        if (base === "kk") return "Kazakh";
        if (base === "ru") return "Russian";
        if (base === "en") return "English";
    }

    return "Russian";
}

languageSelect.addEventListener("change", (event) => {
    updateLanguage(event.target.value);
    try {
        localStorage.setItem("language", event.target.value);
    } catch (error) {}
});

const themeToggle = document.getElementById("theme-toggle");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function activeTheme() {
    return document.documentElement.dataset.theme || (darkQuery.matches ? "dark" : "light");
}

function syncThemeToggle() {
    const theme = activeTheme();
    document.documentElement.dataset.themeActive = theme;
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

themeToggle.addEventListener("click", () => {
    const next = activeTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
        localStorage.setItem("theme", next);
    } catch (error) {}
    syncThemeToggle();
});

darkQuery.addEventListener("change", syncThemeToggle);
syncThemeToggle();

document.getElementById("year").textContent = new Date().getFullYear();

languageSelect.value = initialLanguage();
updateLanguage(languageSelect.value);
