const checks = [
  "keyboard navigation",
  "visible focus",
  "dialog focus trap",
  "icon button labels",
  "reduced motion",
  "non-color-only status",
  "contrast review"
];

console.log("Accessibility audit checklist:");
for (const check of checks) console.log(`- ${check}`);
