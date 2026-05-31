---
title: "Scoring System & Penalties - Multiplayer Sudoku Documentation"
description: "Detailed breakdown of the Multiplayer Sudoku scoring system. Understand how points are awarded, time bonuses, and the penalty system for incorrect guesses."
url: "https://multiplayersudoku.in/scoring-system.html"
---

# Scoring System & Penalties - Multiplayer Sudoku Documentation

Scoring System
Understanding points, time bonuses, and error penalties.
⬅ Back to Home
The Goal: Speed and Accuracy
In traditional Sudoku, the only metric that matters is whether you eventually solve the puzzle. In
Multiplayer Sudoku
, scoring is determined by two critical factors: how fast you solve, and how accurately you place your numbers.
The scoring system is designed to reward deliberate, logical play while harshly punishing random guessing.
Match Points (In-Game Scoring)
During an active multiplayer match, you and your opponent are racing to reach a score of 100%. The progression is strictly based on the number of correct cells filled.
Correct Placement:
When you successfully deduce and place a correct digit, your progress bar increments. The exact percentage depends on the number of empty cells at the start of the match.
Note Placements:
Placing pencil marks (notes) does not impact your score. Notes are purely for personal organization and strategy.
The Penalty System (Strikes)
The most important element of our scoring engine is the Penalty System. To prevent players from spamming numbers until one works, we enforce severe consequences for guessing.
The 3-Strike Rule:
You are allowed a maximum of two mistakes per match. If you submit a third incorrect number, you instantly lose the match.
Strike 1:
Visual warning. Your opponent gains a psychological advantage as they see your mistake register.
Strike 2:
Final warning. You must now play flawlessly for the remainder of the match.
Strike 3:
Immediate Elimination. The match ends, your opponent is declared the winner, and you lose Elo rating points (if playing Ranked).
Time and Speed Metrics
While the primary win condition is finishing first, the system tracks your total solve time down to the millisecond. This data is used to calculate your average solve speed across different difficulty levels.
In the event of a highly improbable simultaneous finish (where both players submit the final correct digit within the same server tick), the server will calculate the overall average time between correct placements (APM - Actions Per Minute) to determine the absolute winner.
Learn about Elo Rankings 📈
