/**
 * =========================================
 *    DOM Elements
 * =========================================
 *
 * @format
 */

const header = document.querySelector(".header");

const menuButton = document.querySelector(".menu-toggle");

const navMenu = document.querySelector(".nav-menu");

const navLinks = document.querySelectorAll(".nav-menu a");

const themeButton = document.querySelector(".theme-toggle");

const scrollTopButton = document.querySelector("#scroll-top");

const projectStatus = document.querySelector("#project-status");

const projectList = document.querySelector("#project-list");

const contactForm = document.querySelector("#contact-form");

const nameInput = document.querySelector("#name");

const emailInput = document.querySelector("#email");

const messageInput = document.querySelector("#message");

const nameError = document.querySelector("#name-error");

const emailError = document.querySelector("#email-error");

const messageError = document.querySelector("#message-error");

const formSuccess = document.querySelector("#form-success");

/* =========================================
   1. Hamburger Menu
========================================= */

menuButton.addEventListener("click", () => {
  /*
      사용자 클릭
      ↓
      active 클래스 상태 변경
      ↓
      메뉴 화면 변경
    */

  navMenu.classList.toggle("active");

  const isOpen = navMenu.classList.contains("active");

  menuButton.setAttribute("aria-expanded", isOpen);

  menuButton.textContent = isOpen ? "✕" : "☰";
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.textContent = "☰";
  });
});

/* =========================================
   2. Dark Mode
========================================= */

// 기존 테마 가져오기
const savedTheme = localStorage.getItem("theme");

// 저장된 페이지가 있다면 적용함
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}

// 테마에 맞게 변경
const updateThemeButton = () => {
  const currentTheme = document.documentElement.dataset.theme;

  themeButton.textContent = currentTheme === "dark" ? "Light" : "Dark";
};

updateThemeButton();

themeButton.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;

  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;

  localStorage.setItem("theme", nextTheme);

  updateThemeButton();
});

/* =========================================
   3. Scroll Event
========================================= */

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  // 60px 이상 스크롤하면 Header 스타일 변경

  if (scrollPosition >= 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // 300px 이상 스크롤하면 Scroll Top 버튼 표시

  if (scrollPosition >= 300) {
    scrollTopButton.classList.add("visible");
  } else {
    scrollTopButton.classList.remove("visible");
  }
});

/* =========================================
   4. Scroll Top
========================================= */

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* =========================================
   5. Scroll Animation
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },

  {
    // 과제 요구사항에 맞춰 threshold 0.2 사용

    threshold: 0.2,
  }
);

revealElements.forEach((element) => {
  observer.observe(element);
});

/* =========================================
   6. GitHub API
========================================= */

const GITHUB_USERNAME = "L-jy16";

const loadProjects = async () => {
  projectStatus.textContent = "프로젝트를 불러오는 중...";

  projectList.innerHTML = "";

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`
    );

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }
    const repositories = await response.json();

    if (repositories.length === 0) {
      projectStatus.textContent = "표시할 프로젝트가 없습니다.";

      return;
    }

    projectStatus.textContent = "";

    const projectHTML = repositories
      .map((repository) => {
        const { name, description, html_url, language, stargazers_count } =
          repository;

        return `
            <article class="project-card">

              <h3>
                ${name}
              </h3>

              <p class="project-description">
                ${description ?? "프로젝트 설명이 없습니다."}
              </p>

              <div class="project-info">

                <span>
                  Language:
                  ${language ?? "None"}
                </span>

                <br />

                <span>
                  Stars:
                  ${stargazers_count}
                </span>

              </div>

              <a
                class="project-link"
                href="${html_url}"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub에서 보기 →
              </a>

            </article>
          `;
      })
      .join("");

    projectList.innerHTML = projectHTML;
  } catch (error) {
    console.error("GitHub API Error:", error);

    projectStatus.innerHTML = `
      프로젝트를 불러올 수 없습니다.

      <button
        id="retry-button"
        class="retry-button"
        type="button"
      >
        다시 시도
      </button>
    `;

    const retryButton = document.querySelector("#retry-button");
    ㄴ;
    retryButton.addEventListener("click", loadProjects);
  }
};

loadProjects();

/* =========================================
   7. Contact Form Validation
========================================= */

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
};

const clearErrors = () => {
  nameError.textContent = "";

  emailError.textContent = "";

  messageError.textContent = "";

  formSuccess.textContent = "";
};

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  clearErrors();

  let isValid = true;

  const name = nameInput.value.trim();

  const email = emailInput.value.trim();

  const message = messageInput.value.trim();

  /* -------------------------------
       Name Validation
    -------------------------------- */

  if (!name) {
    nameError.textContent = "이름을 입력해주세요.";

    isValid = false;
  }

  /* -------------------------------
       Email Validation
    -------------------------------- */

  if (!email) {
    emailError.textContent = "이메일을 입력해주세요.";

    isValid = false;
  } else if (!validateEmail(email)) {
    emailError.textContent = "올바른 이메일 형식을 입력해주세요.";

    isValid = false;
  }

  /* -------------------------------
       Message Validation
    -------------------------------- */

  if (!message) {
    messageError.textContent = "메시지를 입력해주세요.";

    isValid = false;
  }

  if (isValid) {
    formSuccess.textContent = "문의가 정상적으로 작성되었습니다.";
    ㄴ;

    contactForm.reset();
  }
});

/* =========================================
   8. Input Event
========================================= */

nameInput.addEventListener("input", () => {
  nameError.textContent = "";

  formSuccess.textContent = "";
});

emailInput.addEventListener("input", () => {
  emailError.textContent = "";

  formSuccess.textContent = "";
});

messageInput.addEventListener("input", () => {
  messageError.textContent = "";

  formSuccess.textContent = "";
});
