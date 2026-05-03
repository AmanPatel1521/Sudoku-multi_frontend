async function playSudokuTest(page, vuContext, events, test) {
  const targetUrl = "https://multiplayersudoku.in";

  await test.step("1. Load Homepage", async () => {
    await page.goto(targetUrl);
    await page.waitForLoadState("networkidle");
  });

  await test.step("2. Handle Daily Reward Modal", async () => {
    // The daily reward modal often pops up and blocks clicks.
    // We check if the claim button is visible and click it to clear the way.
    const claimBtn = page.locator("#claim-reward-btn");
    try {
      // Give it a small window to appear
      await claimBtn.waitFor({ state: "visible", timeout: 5000 });
      await claimBtn.click();
      // Wait for the modal backdrop to disappear
      await page.waitForSelector(".modal-backdrop", { state: "detached", timeout: 5000 });
    } catch (e) {
      // If it doesn't appear, that's fine, continue with the test
      console.log("Daily Reward modal did not appear or was already closed.");
    }
  });

  await test.step("3. Enter Name", async () => {
    await page.waitForSelector("#player-name-input");
    const randomName = `Bot_${Math.floor(Math.random() * 9999)}`;
    await page.fill("#player-name-input", randomName);
  });

  await test.step("4. Start Solo Game", async () => {
    await page.click("#play-solo-btn");
    await page.waitForSelector("#game-container", { state: "visible", timeout: 15000 });
  });

  await test.step("5. Confirm Grid Rendered", async () => {
    await page.waitForSelector(".cell", { timeout: 5000 });
  });
}

module.exports = { playSudokuTest };
