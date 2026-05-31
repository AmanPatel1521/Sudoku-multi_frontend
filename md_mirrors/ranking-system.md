---
title: "Ranking System & Elo Tiers - Multiplayer Sudoku Documentation"
description: "Understand how the Multiplayer Sudoku ranking system works. Learn about Elo rating distribution, winning and losing points, and our competitive tier breakdown."
url: "https://multiplayersudoku.in/ranking-system.html"
---

# Ranking System & Elo Tiers - Multiplayer Sudoku Documentation

Ranking System & Tiers
Documentation on how the Multiplayer Sudoku Elo system works.
⬅ Back to Home
How Elo Ratings Work
When you participate in
Ranked Matchmaking
(Quick Play), your performance is measured using a modified Elo rating system. This is the same statistical framework used by chess grandmasters and modern competitive e-sports to gauge relative skill levels.
Every player starts with a base rating of
1000 Elo
. From there, your rating will fluctuate based purely on match outcomes:
Winning a Match:
You will gain points. The exact number of points depends on the rating difference between you and your opponent.
Losing a Match:
You will lose points. Losing to a much higher-rated player results in a minor point deduction, while losing to a lower-rated player will heavily penalize your score.
Draws/Disconnects:
If the server registers a simultaneous finish, it is a draw with zero point changes. If a player disconnects, they immediately forfeit the match and lose points.
Gaining and Losing Points (The Math)
The system is designed to dynamically balance itself. If a 1500-rated player beats a 1000-rated player, the system expected that outcome. Therefore, the higher-rated player will only gain a minimal amount of points (e.g., +2 or +3), while the lower-rated player will only lose a few points.
However, if the 1000-rated player achieves an upset and wins, the system recognizes a significant skill discrepancy. The lower-rated player might gain +25 points, while the 1500-rated player will suffer a -25 point penalty.
To prevent ranking inflation, the point exchange is usually a zero-sum calculation. The points you win are directly subtracted from your opponent.
Competitive Tier Breakdown
To give players milestones to strive for, the Elo ratings are grouped into distinct skill tiers. As you cross these thresholds, your badge and status on the global leaderboards will update.
Tier Name
Elo Range
Skill Description
Bronze
0 - 999
Beginners learning basic rules and row/column scanning.
Silver
1000 - 1199
The starting tier. Players who understand cross-hatching.
Gold
1200 - 1399
Intermediate players. Comfortable with fast placements and notes.
Platinum
1400 - 1599
Advanced competitors with high APM (Actions Per Minute) and accuracy.
Diamond
1600 - 1799
Experts who utilize visual slicing and complex chaining strategies.
Master
1800+
The top 1% of players worldwide. Found on the global leaderboards.
Rating Decay
To ensure the global leaderboards remain active and reflect current skill levels, accounts in the
Diamond
and
Master
tiers are subject to rating decay. If a player in these tiers does not participate in a ranked match for 14 consecutive days, they will slowly lose Elo points every week until they drop back into Platinum.
Play a Ranked Match 📈
