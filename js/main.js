/** 사용자 이벤트 → STATE 변경 → render 함수 → 화면 갱신 */
const header = document.querySelector('.header');
const menuButton = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeButton = document.querySelector('.theme-toggle');
const scrollTopButton = document.querySelector('#scroll-top');
const projectStatus = document.querySelector('#project-status');
const projectList = document.querySelector('#project-list');
const projectFilters = document.querySelector('#project-filters');
const contactForm = document.querySelector('#contact-form');
const fields = {
  name: document.querySelector('#name'),
  email: document.querySelector('#email'),
  message: document.querySelector('#message'),
};
const formSuccess = document.querySelector('#form-success');
const savedTheme = localStorage.getItem('theme');

// 화면 상태의 기준은 STATE이며, DOM은 각 render 함수에서 갱신합니다.
const STATE = {
  theme: savedTheme === 'dark' ? 'dark' : 'light',
  menuOpen: false,
  scrollPosition: window.scrollY,
  projects: { status: 'idle', repositories: [], language: 'all', error: '' },
  form: { errors: { name: '', email: '', message: '' }, success: false },
};

const renderMenu = () => {
  navMenu.classList.toggle('active', STATE.menuOpen);
  menuButton.setAttribute('aria-expanded', String(STATE.menuOpen));
  menuButton.setAttribute('aria-label', STATE.menuOpen ? '메뉴 닫기' : '메뉴 열기');
  menuButton.textContent = STATE.menuOpen ? '✕' : '☰';
};
const renderTheme = () => {
  document.documentElement.dataset.theme = STATE.theme;
  themeButton.textContent = STATE.theme === 'dark' ? 'Light' : 'Dark';
  themeButton.setAttribute('aria-label', STATE.theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경');
};
const renderScroll = () => {
  header.classList.toggle('scrolled', STATE.scrollPosition >= 60);
  scrollTopButton.classList.toggle('visible', STATE.scrollPosition >= 300);
};
menuButton.addEventListener('click', () => {
  STATE.menuOpen = !STATE.menuOpen;
  renderMenu();
});
document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    STATE.menuOpen = false;
    renderMenu();
  });
});
themeButton.addEventListener('click', () => {
  STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', STATE.theme);
  renderTheme();
});
window.addEventListener('scroll', () => {
  STATE.scrollPosition = window.scrollY;
  renderScroll();
});
scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const GITHUB_USERNAME = 'L-jy16';
const getLanguage = (repository) => repository.language ?? '언어 미지정';
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const renderProjectFilters = () => {
  projectFilters.replaceChildren();
  if (!['success', 'empty'].includes(STATE.projects.status) || !STATE.projects.repositories.length) return;
  const languages = ['all', ...new Set(STATE.projects.repositories.map(getLanguage))];
  languages.forEach((language) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = language === 'all' ? '전체' : language;
    button.setAttribute('aria-pressed', String(STATE.projects.language === language));
    button.addEventListener('click', () => {
      STATE.projects.language = language;
      renderProjects();
      // 필터를 다시 그린 뒤에도 선택 버튼의 키보드 포커스를 유지합니다.
      const index = languages.indexOf(language);
      projectFilters.children[index].focus();
    });
    projectFilters.append(button);
  });
};

const renderProjects = () => {
  const { status, repositories, language, error } = STATE.projects;
  projectStatus.textContent = '';
  projectList.innerHTML = '';
  renderProjectFilters();
  if (status === 'loading') {
    projectStatus.textContent = '프로젝트를 불러오는 중...';
    return;
  }
  if (status === 'error') {
    projectStatus.textContent = error;
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.className = 'retry-button';
    retryButton.textContent = '다시 시도';
    retryButton.addEventListener('click', loadProjects);
    projectStatus.append(retryButton);
    return;
  }
  if (status === 'idle') return;
  // 원본 배열은 유지하고 선택한 언어에 맞는 프로젝트만 표시합니다.
  const visibleRepositories = repositories.filter((repository) =>
    language === 'all' || getLanguage(repository) === language
  );
  if (!visibleRepositories.length) {
    projectStatus.textContent = repositories.length
      ? '선택한 언어의 프로젝트가 없습니다.' : '표시할 프로젝트가 없습니다.';
    return;
  }
  projectStatus.textContent = `${visibleRepositories.length}개의 프로젝트`;
  projectList.innerHTML = visibleRepositories.map((repository) => {
    const { name, description, html_url, stargazers_count } = repository;
    const url = new URL(html_url);
    const safeURL = url.protocol === 'https:' && url.hostname === 'github.com' ? url.href : 'https://github.com/';
    return `<article class="project-card">
      <h3>${escapeHTML(name)}</h3>
      <p class="project-description">${escapeHTML(description ?? '프로젝트 설명이 없습니다.')}</p>
      <div class="project-info"><span>Language: ${escapeHTML(getLanguage(repository))}</span><br />
      <span>Stars: ${escapeHTML(stargazers_count)}</span></div>
      <a class="project-link" href="${escapeHTML(safeURL)}" target="_blank" rel="noopener noreferrer">GitHub에서 보기 →</a>
    </article>`;
  }).join('');
};

const loadProjects = async () => {
  STATE.projects.status = 'loading';
  STATE.projects.error = '';
  renderProjects();
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
    if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);
    const repositories = await response.json();
    if (!Array.isArray(repositories)) throw new Error('잘못된 저장소 응답');
    STATE.projects.repositories = repositories;
    STATE.projects.language = 'all';
    STATE.projects.status = repositories.length ? 'success' : 'empty';
    renderProjects();
  } catch (error) {
    console.error('GitHub API Error:', error);
    STATE.projects.status = 'error';
    STATE.projects.error = '프로젝트를 불러올 수 없습니다. 네트워크 연결 또는 GitHub API 이용 제한을 확인한 뒤 다시 시도해주세요.';
    renderProjects();
  }
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const renderForm = () => {
  Object.entries(fields).forEach(([name, input]) => {
    document.querySelector(`#${name}-error`).textContent = STATE.form.errors[name];
    input.setAttribute('aria-invalid', String(Boolean(STATE.form.errors[name])));
    input.setAttribute('aria-describedby', `${name}-error`);
  });
  formSuccess.textContent = STATE.form.success ? '문의가 정상적으로 작성되었습니다.' : '';
};
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = fields.name.value.trim();
  const email = fields.email.value.trim();
  const message = fields.message.value.trim();
  STATE.form.errors = {
    name: name ? '' : '이름을 입력해주세요.',
    email: !email ? '이메일을 입력해주세요.' : validateEmail(email) ? '' : '올바른 이메일 형식을 입력해주세요.',
    message: message ? '' : '메시지를 입력해주세요.',
  };
  STATE.form.success = !Object.values(STATE.form.errors).some(Boolean);
  renderForm();
  if (STATE.form.success) contactForm.reset();
  else fields[Object.keys(fields).find((key) => STATE.form.errors[key])].focus();
});
Object.entries(fields).forEach(([name, input]) => {
  input.addEventListener('input', () => {
    STATE.form.errors[name] = '';
    STATE.form.success = false;
    renderForm();
  });
});
renderMenu();
renderTheme();
renderScroll();
renderForm();
loadProjects();
