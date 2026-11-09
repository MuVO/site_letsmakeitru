function initializeCurrentYear() {
  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();
}

function initializeNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
}

function initializeContactDialog() {
  const dialog = document.querySelector('#contact-dialog');
  const form = document.querySelector('#lead-form');
  if (!dialog || !form) return;

  const emailInput = form.elements.email;
  const phoneInput = form.elements.phone;
  const emailHint = emailInput.closest('label').querySelector('.optional-hint');
  const phoneHint = phoneInput.closest('label').querySelector('.optional-hint');

  function updateContactRequirements() {
    const emailIsValid = emailInput.value.trim() !== '' && emailInput.validity.valid;
    const phoneDigitCount = phoneInput.value.replace(/\D/g, '').length;
    const phoneIsValid = phoneInput.value.trim() !== '' && phoneInput.validity.valid && phoneDigitCount >= 7;

    emailInput.required = !phoneIsValid;
    phoneInput.required = !emailIsValid;
    emailHint.hidden = !phoneIsValid;
    phoneHint.hidden = !emailIsValid;
  }

  emailInput.addEventListener('input', updateContactRequirements);
  phoneInput.addEventListener('input', updateContactRequirements);
  updateContactRequirements();

  document.querySelectorAll('[data-open-contact]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-close-contact]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  form.addEventListener('submit', (event) => submitContactForm(event, form, updateContactRequirements));
}

async function submitContactForm(event, form, updateContactRequirements) {
  event.preventDefault();

  const status = form.querySelector('.form-status');
  const alternatives = form.querySelector('#form-alternatives');
  const submitButton = form.querySelector('[type="submit"]');
  const endpoint = form.dataset.submitUrl;

  status.classList.add('is-visible');
  alternatives.hidden = true;

  if (!endpoint) {
    status.textContent = form.dataset.unavailableMessage;
    return;
  }

  submitButton.disabled = true;
  status.textContent = form.dataset.sendingMessage;

  try {
    const fields = new FormData(form);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fields.get('name'),
        email: fields.get('email'),
        phone: fields.get('phone'),
        project: fields.get('project'),
        consent: fields.get('consent') === 'on',
        locale: document.documentElement.lang,
      }),
    });

    if (!response.ok) throw new Error('request_failed');
    status.textContent = form.dataset.successMessage;
    form.reset();
    updateContactRequirements();
  } catch {
    status.textContent = form.dataset.errorMessage;
    alternatives.hidden = !alternatives.querySelector('a:not([hidden])');
  } finally {
    submitButton.disabled = false;
  }
}

initializeCurrentYear();
initializeNavigation();
initializeContactDialog();
