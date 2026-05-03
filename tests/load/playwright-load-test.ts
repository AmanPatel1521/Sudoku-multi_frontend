import type { Config, Scenario, PlaywrightTestFunction } from "artillery";

export const config: Config = {
  target: "https://multiplayersudoku.in",
  phases: [
    {
      duration: 60,
      arrivalCount: 5,  // Simulating 5 real users over 1 minute (safe smoke test)
      name: "initial_smoke_test",
    },
  ],
  engines: {
    playwright: {},
  },
};

export const testFunction: PlaywrightTestFunction = async (page, vuContext, events, test) => {
  const targetUrl = config.target as string;

  await test.step("1. Load Multiplayer Sudoku Homepage", async () => {
    await page.goto(targetUrl);
    await page.waitForLoadState("networkidle");
  });

  await test.step("2. Setup Player Profile", async () => {
    // Wait for the lobby card to appear
    await page.waitForSelector("#player-name-input");
    
    // Fill in a random name
    const randomName = "TestBot_" + Math.floor(Math.random() * 1000);
    await page.fill("#player-name-input", randomName);
  });

  await test.step("3. Start Solo Game", async () => {
    // Click Play Solo button
    await page.click("#play-solo-btn");
    
    // Wait for the game container to show up
    // In our app, game-container visibility is toggled when the game starts
    await page.waitForSelector("#game-container", { state: "visible", timeout: 10000 });
  });

  await test.step("4. Interact with the Grid", async () => {
    // Wait for cells to be rendered
    await page.waitForSelector(".cell");
    
    // Simulate a user clicking on the first empty cell
    // (Optional: this just confirms the grid is interactive)
    const firstCell = await page.locator(".cell").first();
    await firstCell.click();
  });
};

export const scenarios: Scenario[] = [
  {
    name: "User Journey: Lobby to Active Solo Match",
    engine: "playwright",
    testFunction: "testFunction",
  },
];
