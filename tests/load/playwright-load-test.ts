import type { Config, Scenario, PlaywrightTestFunction } from "artillery";

export const config: Config = {
  target: "https://multiplayersudoku.in",
  phases: [
    {
      duration: 60,
      arrivalCount: 5,
      name: "initial_smoke_test",
    },
  ],
  engines: {
    playwright: {
      // Launch options to ensure it works in all environments
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },
  },
};

// We define the function and then export it clearly
export async function playSudokuTest(page: any, vuContext: any, events: any, test: any) {
  const targetUrl = "https://multiplayersudoku.in";

  await test.step("1. Load Homepage", async () => {
    await page.goto(targetUrl);
    await page.waitForLoadState("networkidle");
  });

  await test.step("2. Enter Name", async () => {
    await page.waitForSelector("#player-name-input");
    const randomName = `Bot_${Math.floor(Math.random() * 9999)}`;
    await page.fill("#player-name-input", randomName);
  });

  await test.step("3. Start Solo Game", async () => {
    await page.click("#play-solo-btn");
    // Wait for the game container to become visible
    await page.waitForSelector("#game-container", { state: "visible", timeout: 15000 });
  });

  await test.step("4. Confirm Grid Rendered", async () => {
    await page.waitForSelector(".cell", { timeout: 5000 });
  });
}

export const scenarios: Scenario[] = [
  {
    name: "User Journey: Lobby to Active Solo Match",
    engine: "playwright",
    testFunction: "playSudokuTest", // This matches the function name above
  },
];
