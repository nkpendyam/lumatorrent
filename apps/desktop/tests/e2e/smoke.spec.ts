import { expect, test } from "@playwright/test";

test("dashboard renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("LumaTorrent")).toBeVisible();
  await expect(page.getByRole("button", { name: /add torrent/i })).toBeVisible();
});
