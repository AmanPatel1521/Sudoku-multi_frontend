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

// tests/load/playwright-load-test.ts
var playwright_load_test_exports = {};
__export(playwright_load_test_exports, {
  config: () => config,
  playSudokuTest: () => playSudokuTest,
  scenarios: () => scenarios
});
module.exports = __toCommonJS(playwright_load_test_exports);
var config = {
  target: "https://multiplayersudoku.in",
  phases: [
    {
      duration: 60,
      arrivalCount: 5,
      name: "initial_smoke_test"
    }
  ],
  engines: {
    playwright: {
      // Launch options to ensure it works in all environments
      launchOptions: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      }
    }
  }
};
async function playSudokuTest(page, vuContext, events, test) {
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
    await page.waitForSelector("#game-container", { state: "visible", timeout: 15e3 });
  });
  await test.step("4. Confirm Grid Rendered", async () => {
    await page.waitForSelector(".cell", { timeout: 5e3 });
  });
}
var scenarios = [
  {
    name: "User Journey: Lobby to Active Solo Match",
    engine: "playwright",
    testFunction: "playSudokuTest"
    // This matches the function name above
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  playSudokuTest,
  scenarios
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGxheXdyaWdodC1sb2FkLXRlc3QudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgQ29uZmlnLCBTY2VuYXJpbywgUGxheXdyaWdodFRlc3RGdW5jdGlvbiB9IGZyb20gXCJhcnRpbGxlcnlcIjtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZzogQ29uZmlnID0ge1xuICB0YXJnZXQ6IFwiaHR0cHM6Ly9tdWx0aXBsYXllcnN1ZG9rdS5pblwiLFxuICBwaGFzZXM6IFtcbiAgICB7XG4gICAgICBkdXJhdGlvbjogNjAsXG4gICAgICBhcnJpdmFsQ291bnQ6IDUsXG4gICAgICBuYW1lOiBcImluaXRpYWxfc21va2VfdGVzdFwiLFxuICAgIH0sXG4gIF0sXG4gIGVuZ2luZXM6IHtcbiAgICBwbGF5d3JpZ2h0OiB7XG4gICAgICAvLyBMYXVuY2ggb3B0aW9ucyB0byBlbnN1cmUgaXQgd29ya3MgaW4gYWxsIGVudmlyb25tZW50c1xuICAgICAgbGF1bmNoT3B0aW9uczoge1xuICAgICAgICBhcmdzOiBbJy0tbm8tc2FuZGJveCcsICctLWRpc2FibGUtc2V0dWlkLXNhbmRib3gnXVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG59O1xuXG4vLyBXZSBkZWZpbmUgdGhlIGZ1bmN0aW9uIGFuZCB0aGVuIGV4cG9ydCBpdCBjbGVhcmx5XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGxheVN1ZG9rdVRlc3QocGFnZTogYW55LCB2dUNvbnRleHQ6IGFueSwgZXZlbnRzOiBhbnksIHRlc3Q6IGFueSkge1xuICBjb25zdCB0YXJnZXRVcmwgPSBcImh0dHBzOi8vbXVsdGlwbGF5ZXJzdWRva3UuaW5cIjtcblxuICBhd2FpdCB0ZXN0LnN0ZXAoXCIxLiBMb2FkIEhvbWVwYWdlXCIsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBwYWdlLmdvdG8odGFyZ2V0VXJsKTtcbiAgICBhd2FpdCBwYWdlLndhaXRGb3JMb2FkU3RhdGUoXCJuZXR3b3JraWRsZVwiKTtcbiAgfSk7XG5cbiAgYXdhaXQgdGVzdC5zdGVwKFwiMi4gRW50ZXIgTmFtZVwiLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IoXCIjcGxheWVyLW5hbWUtaW5wdXRcIik7XG4gICAgY29uc3QgcmFuZG9tTmFtZSA9IGBCb3RfJHtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA5OTk5KX1gO1xuICAgIGF3YWl0IHBhZ2UuZmlsbChcIiNwbGF5ZXItbmFtZS1pbnB1dFwiLCByYW5kb21OYW1lKTtcbiAgfSk7XG5cbiAgYXdhaXQgdGVzdC5zdGVwKFwiMy4gU3RhcnQgU29sbyBHYW1lXCIsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBwYWdlLmNsaWNrKFwiI3BsYXktc29sby1idG5cIik7XG4gICAgLy8gV2FpdCBmb3IgdGhlIGdhbWUgY29udGFpbmVyIHRvIGJlY29tZSB2aXNpYmxlXG4gICAgYXdhaXQgcGFnZS53YWl0Rm9yU2VsZWN0b3IoXCIjZ2FtZS1jb250YWluZXJcIiwgeyBzdGF0ZTogXCJ2aXNpYmxlXCIsIHRpbWVvdXQ6IDE1MDAwIH0pO1xuICB9KTtcblxuICBhd2FpdCB0ZXN0LnN0ZXAoXCI0LiBDb25maXJtIEdyaWQgUmVuZGVyZWRcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKFwiLmNlbGxcIiwgeyB0aW1lb3V0OiA1MDAwIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHNjZW5hcmlvczogU2NlbmFyaW9bXSA9IFtcbiAge1xuICAgIG5hbWU6IFwiVXNlciBKb3VybmV5OiBMb2JieSB0byBBY3RpdmUgU29sbyBNYXRjaFwiLFxuICAgIGVuZ2luZTogXCJwbGF5d3JpZ2h0XCIsXG4gICAgdGVzdEZ1bmN0aW9uOiBcInBsYXlTdWRva3VUZXN0XCIsIC8vIFRoaXMgbWF0Y2hlcyB0aGUgZnVuY3Rpb24gbmFtZSBhYm92ZVxuICB9LFxuXTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVPLElBQU0sU0FBaUI7QUFBQSxFQUM1QixRQUFRO0FBQUEsRUFDUixRQUFRO0FBQUEsSUFDTjtBQUFBLE1BQ0UsVUFBVTtBQUFBLE1BQ1YsY0FBYztBQUFBLE1BQ2QsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUE7QUFBQSxNQUVWLGVBQWU7QUFBQSxRQUNiLE1BQU0sQ0FBQyxnQkFBZ0IsMEJBQTBCO0FBQUEsTUFDbkQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBR0EsZUFBc0IsZUFBZSxNQUFXLFdBQWdCLFFBQWEsTUFBVztBQUN0RixRQUFNLFlBQVk7QUFFbEIsUUFBTSxLQUFLLEtBQUssb0JBQW9CLFlBQVk7QUFDOUMsVUFBTSxLQUFLLEtBQUssU0FBUztBQUN6QixVQUFNLEtBQUssaUJBQWlCLGFBQWE7QUFBQSxFQUMzQyxDQUFDO0FBRUQsUUFBTSxLQUFLLEtBQUssaUJBQWlCLFlBQVk7QUFDM0MsVUFBTSxLQUFLLGdCQUFnQixvQkFBb0I7QUFDL0MsVUFBTSxhQUFhLE9BQU8sS0FBSyxNQUFNLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQztBQUMxRCxVQUFNLEtBQUssS0FBSyxzQkFBc0IsVUFBVTtBQUFBLEVBQ2xELENBQUM7QUFFRCxRQUFNLEtBQUssS0FBSyxzQkFBc0IsWUFBWTtBQUNoRCxVQUFNLEtBQUssTUFBTSxnQkFBZ0I7QUFFakMsVUFBTSxLQUFLLGdCQUFnQixtQkFBbUIsRUFBRSxPQUFPLFdBQVcsU0FBUyxLQUFNLENBQUM7QUFBQSxFQUNwRixDQUFDO0FBRUQsUUFBTSxLQUFLLEtBQUssNEJBQTRCLFlBQVk7QUFDdEQsVUFBTSxLQUFLLGdCQUFnQixTQUFTLEVBQUUsU0FBUyxJQUFLLENBQUM7QUFBQSxFQUN2RCxDQUFDO0FBQ0g7QUFFTyxJQUFNLFlBQXdCO0FBQUEsRUFDbkM7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLGNBQWM7QUFBQTtBQUFBLEVBQ2hCO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
