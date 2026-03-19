export function initServicePage() {
  const chips = document.querySelectorAll("[data-stage]");
  const status = document.querySelector("[data-service-status]");
  const serviceName = document.body.dataset.serviceName || "this solar project";

  if (!chips.length || !status) {
    return;
  }

  const updateStatus = (value) => {
    chips.forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.stage === value);
    });

    status.textContent = `Best next step for ${serviceName.toLowerCase()}: compare providers that match your ${value.toLowerCase()} stage.`;
  };

  updateStatus(chips[0].dataset.stage);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => updateStatus(chip.dataset.stage));
  });
}
