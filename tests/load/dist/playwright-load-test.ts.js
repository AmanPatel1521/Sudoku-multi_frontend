var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// Aman/Sudoku/Sudoku-multi_frontend/tests/load/playwright-load-test.ts
var playwright_load_test_exports = {};
__export(playwright_load_test_exports, {
  config: () => config,
  scenarios: () => scenarios,
  testFunction: () => testFunction
});
module.exports = __toCommonJS(playwright_load_test_exports);
var config = {
  target: "https://multiplayersudoku.in",
  phases: [
    {
      duration: 60,
      arrivalCount: 5,
      // Simulating 5 real users over 1 minute (safe smoke test)
      name: "initial_smoke_test"
    }
  ],
  engines: {
    playwright: {}
  }
};
var testFunction = async (page, vuContext, events, test) => {
  const targetUrl = config.target;
  await test.step("1. Load Multiplayer Sudoku Homepage", async () => {
    await page.goto(targetUrl);
    await page.waitForLoadState("networkidle");
  });
  await test.step("2. Setup Player Profile", async () => {
    await page.waitForSelector("#player-name-input");
    const randomName = "TestBot_" + Math.floor(Math.random() * 1e3);
    await page.fill("#player-name-input", randomName);
  });
  await test.step("3. Start Solo Game", async () => {
    await page.click("#play-solo-btn");
    await page.waitForSelector("#game-container", { state: "visible", timeout: 1e4 });
  });
  await test.step("4. Interact with the Grid", async () => {
    await page.waitForSelector(".cell");
    const firstCell = await page.locator(".cell").first();
    await firstCell.click();
  });
};
var scenarios = [
  {
    name: "User Journey: Lobby to Active Solo Match",
    engine: "playwright",
    testFunction: "testFunction"
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  scenarios,
  testFunction
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGxheXdyaWdodC1sb2FkLXRlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgQ29uZmlnLCBTY2VuYXJpbywgUGxheXdyaWdodFRlc3RGdW5jdGlvbiB9IGZyb20gXCJhcnRpbGxlcnlcIjtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZzogQ29uZmlnID0ge1xuICB0YXJnZXQ6IFwiaHR0cHM6Ly9tdWx0aXBsYXllcnN1ZG9rdS5pblwiLFxuICBwaGFzZXM6IFtcbiAgICB7XG4gICAgICBkdXJhdGlvbjogNjAsXG4gICAgICBhcnJpdmFsQ291bnQ6IDUsICAvLyBTaW11bGF0aW5nIDUgcmVhbCB1c2VycyBvdmVyIDEgbWludXRlIChzYWZlIHNtb2tlIHRlc3QpXG4gICAgICBuYW1lOiBcImluaXRpYWxfc21va2VfdGVzdFwiLFxuICAgIH0sXG4gIF0sXG4gIGVuZ2luZXM6IHtcbiAgICBwbGF5d3JpZ2h0OiB7fSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCB0ZXN0RnVuY3Rpb246IFBsYXl3cmlnaHRUZXN0RnVuY3Rpb24gPSBhc3luYyAocGFnZSwgdnVDb250ZXh0LCBldmVudHMsIHRlc3QpID0+IHtcbiAgY29uc3QgdGFyZ2V0VXJsID0gY29uZmlnLnRhcmdldCBhcyBzdHJpbmc7XG5cbiAgYXdhaXQgdGVzdC5zdGVwKFwiMS4gTG9hZCBNdWx0aXBsYXllciBTdWRva3UgSG9tZXBhZ2VcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHBhZ2UuZ290byh0YXJnZXRVcmwpO1xuICAgIGF3YWl0IHBhZ2Uud2FpdEZvckxvYWRTdGF0ZShcIm5ldHdvcmtpZGxlXCIpO1xuICB9KTtcblxuICBhd2FpdCB0ZXN0LnN0ZXAoXCIyLiBTZXR1cCBQbGF5ZXIgUHJvZmlsZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gV2FpdCBmb3IgdGhlIGxvYmJ5IGNhcmQgdG8gYXBwZWFyXG4gICAgYXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IoXCIjcGxheWVyLW5hbWUtaW5wdXRcIik7XG4gICAgXG4gICAgLy8gRmlsbCBpbiBhIHJhbmRvbSBuYW1lXG4gICAgY29uc3QgcmFuZG9tTmFtZSA9IFwiVGVzdEJvdF9cIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xuICAgIGF3YWl0IHBhZ2UuZmlsbChcIiNwbGF5ZXItbmFtZS1pbnB1dFwiLCByYW5kb21OYW1lKTtcbiAgfSk7XG5cbiAgYXdhaXQgdGVzdC5zdGVwKFwiMy4gU3RhcnQgU29sbyBHYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICAvLyBDbGljayBQbGF5IFNvbG8gYnV0dG9uXG4gICAgYXdhaXQgcGFnZS5jbGljayhcIiNwbGF5LXNvbG8tYnRuXCIpO1xuICAgIFxuICAgIC8vIFdhaXQgZm9yIHRoZSBnYW1lIGNvbnRhaW5lciB0byBzaG93IHVwXG4gICAgLy8gSW4gb3VyIGFwcCwgZ2FtZS1jb250YWluZXIgdmlzaWJpbGl0eSBpcyB0b2dnbGVkIHdoZW4gdGhlIGdhbWUgc3RhcnRzXG4gICAgYXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IoXCIjZ2FtZS1jb250YWluZXJcIiwgeyBzdGF0ZTogXCJ2aXNpYmxlXCIsIHRpbWVvdXQ6IDEwMDAwIH0pO1xuICB9KTtcblxuICBhd2FpdCB0ZXN0LnN0ZXAoXCI0LiBJbnRlcmFjdCB3aXRoIHRoZSBHcmlkXCIsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXYWl0IGZvciBjZWxscyB0byBiZSByZW5kZXJlZFxuICAgIGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKFwiLmNlbGxcIik7XG4gICAgXG4gICAgLy8gU2ltdWxhdGUgYSB1c2VyIGNsaWNraW5nIG9uIHRoZSBmaXJzdCBlbXB0eSBjZWxsXG4gICAgLy8gKE9wdGlvbmFsOiB0aGlzIGp1c3QgY29uZmlybXMgdGhlIGdyaWQgaXMgaW50ZXJhY3RpdmUpXG4gICAgY29uc3QgZmlyc3RDZWxsID0gYXdhaXQgcGFnZS5sb2NhdG9yKFwiLmNlbGxcIikuZmlyc3QoKTtcbiAgICBhd2FpdCBmaXJzdENlbGwuY2xpY2soKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc2NlbmFyaW9zOiBTY2VuYXJpb1tdID0gW1xuICB7XG4gICAgbmFtZTogXCJVc2VyIEpvdXJuZXk6IExvYmJ5IHRvIEFjdGl2ZSBTb2xvIE1hdGNoXCIsXG4gICAgZW5naW5lOiBcInBsYXl3cmlnaHRcIixcbiAgICB0ZXN0RnVuY3Rpb246IFwidGVzdEZ1bmN0aW9uXCIsXG4gIH0sXG5dO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRU8sSUFBTSxTQUFpQjtBQUFBLEVBQzVCLFFBQVE7QUFBQSxFQUNSLFFBQVE7QUFBQSxJQUNOO0FBQUEsTUFDRSxVQUFVO0FBQUEsTUFDVixjQUFjO0FBQUE7QUFBQSxNQUNkLE1BQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsWUFBWSxDQUFDO0FBQUEsRUFDZjtBQUNGO0FBRU8sSUFBTSxlQUF1QyxPQUFPLE1BQU0sV0FBVyxRQUFRLFNBQVM7QUFDM0YsUUFBTSxZQUFZLE9BQU87QUFFekIsUUFBTSxLQUFLLEtBQUssdUNBQXVDLFlBQVk7QUFDakUsVUFBTSxLQUFLLEtBQUssU0FBUztBQUN6QixVQUFNLEtBQUssaUJBQWlCLGFBQWE7QUFBQSxFQUMzQyxDQUFDO0FBRUQsUUFBTSxLQUFLLEtBQUssMkJBQTJCLFlBQVk7QUFFckQsVUFBTSxLQUFLLGdCQUFnQixvQkFBb0I7QUFHL0MsVUFBTSxhQUFhLGFBQWEsS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLEdBQUk7QUFDL0QsVUFBTSxLQUFLLEtBQUssc0JBQXNCLFVBQVU7QUFBQSxFQUNsRCxDQUFDO0FBRUQsUUFBTSxLQUFLLEtBQUssc0JBQXNCLFlBQVk7QUFFaEQsVUFBTSxLQUFLLE1BQU0sZ0JBQWdCO0FBSWpDLFVBQU0sS0FBSyxnQkFBZ0IsbUJBQW1CLEVBQUUsT0FBTyxXQUFXLFNBQVMsSUFBTSxDQUFDO0FBQUEsRUFDcEYsQ0FBQztBQUVELFFBQU0sS0FBSyxLQUFLLDZCQUE2QixZQUFZO0FBRXZELFVBQU0sS0FBSyxnQkFBZ0IsT0FBTztBQUlsQyxVQUFNLFlBQVksTUFBTSxLQUFLLFFBQVEsT0FBTyxFQUFFLE1BQU07QUFDcEQsVUFBTSxVQUFVLE1BQU07QUFBQSxFQUN4QixDQUFDO0FBQ0g7QUFFTyxJQUFNLFlBQXdCO0FBQUEsRUFDbkM7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLGNBQWM7QUFBQSxFQUNoQjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
