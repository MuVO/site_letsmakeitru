const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

document.querySelector('#current-year').textContent = new Date().getFullYear();

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

const contactDialog = document.querySelector('#contact-dialog');
const contactForm = document.querySelector('#lead-form');

if (contactDialog && contactForm) {
  const emailInput = contactForm.elements.email;
  const phoneInput = contactForm.elements.phone;
  const emailOptionalHint = emailInput.closest('label').querySelector('.optional-hint');
  const phoneOptionalHint = phoneInput.closest('label').querySelector('.optional-hint');
  const updateContactRequirements = () => {
    const emailIsValid = emailInput.value.trim() !== '' && emailInput.validity.valid;
    const phoneDigits = phoneInput.value.replace(/\D/g, '').length;
    const phoneIsValid = phoneInput.value.trim() !== '' && phoneInput.validity.valid && phoneDigits >= 7;

    emailInput.required = !phoneIsValid;
    phoneInput.required = !emailIsValid;
    emailOptionalHint.hidden = !phoneIsValid;
    phoneOptionalHint.hidden = !emailIsValid;
  };

  emailInput.addEventListener('input', updateContactRequirements);
  emailInput.addEventListener('change', updateContactRequirements);
  phoneInput.addEventListener('input', updateContactRequirements);
  phoneInput.addEventListener('change', updateContactRequirements);
  updateContactRequirements();

  document.querySelectorAll('[data-open-contact]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      contactDialog.showModal();
    });
  });

  contactDialog.querySelector('[data-close-contact]').addEventListener('click', () => {
    contactDialog.close();
  });

  contactDialog.addEventListener('click', (event) => {
    if (event.target === contactDialog) contactDialog.close();
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = contactForm.querySelector('.form-status');
    const alternatives = contactForm.querySelector('#form-alternatives');
    status.classList.add('is-visible');
    alternatives.hidden = true;
    const endpoint = contactForm.dataset.submitUrl;

    if (!endpoint) {
      status.textContent = contactForm.dataset.unavailableMessage;
      return;
    }

    const submitButton = contactForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    status.textContent = contactForm.dataset.sendingMessage;

    try {
      const fields = new FormData(contactForm);
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
      status.textContent = contactForm.dataset.successMessage;
      contactForm.reset();
      updateContactRequirements();
    } catch (_error) {
      status.textContent = contactForm.dataset.errorMessage;
      alternatives.hidden = !alternatives.querySelector('a:not([hidden])');
    } finally {
      submitButton.disabled = false;
    }
  });
}
