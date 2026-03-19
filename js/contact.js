export function initContactPage() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("[data-contact-status]");
  const nameInput = document.querySelector("#contact-name");

  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput?.value.trim();
    status.textContent = name
      ? `Thanks, ${name}. Your request has been received. A follow-up may be sent by phone or email based on the details you shared.`
      : "Thanks. Your request has been received. A follow-up may be sent by phone or email based on the details you shared.";
    form.reset();
  });
}
