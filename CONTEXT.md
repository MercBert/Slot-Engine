# Slot Engine

A cluster-pays, cascading slot game. The engine resolves a player's Spin on a Grid of weighted Symbols, paying out Clusters and chaining Cascades until no Clusters remain.

## Language

**Spin**:
A single staked play: a fresh Grid plus the full chain of Cascades it produces and the resulting Total Win.
_Avoid_: round, turn, roll

**Grid**:
The 7×6 field of Cells a Spin is resolved on.
_Avoid_: board, reels, matrix

**Cell**:
One position on the Grid holding a Symbol, identified by a stable key used for animation tracking.
_Avoid_: tile, square

**Symbol**:
One of the eight weighted icon types that occupy Cells. Weight sets how often it appears; Tier sets its value.
_Avoid_: icon, item

**Tier**:
A Symbol's value rank from 1 (most valuable, rarest) to 8 (least valuable, most common). A Cluster's payout multiplier is `9 − tier`.
_Avoid_: rank, level

**Cluster**:
A group of five or more identical Symbols connected up/down/left/right. The unit that pays.
_Avoid_: match, combo, line, payline

**Cascade**:
One resolution round after Clusters pay: clustered Cells are removed, surviving Cells fall down their columns, and new Symbols refill from the top. Cascades repeat while new Clusters form.
_Avoid_: tumble, avalanche, chain reaction

**Step Win**:
The amount a single Cascade pays: for each Cluster, bet × size payout × Tier multiplier.
_Avoid_: cascade win, partial win

**Total Win**:
The sum of all Step Wins across a Spin's Cascades.
_Avoid_: payout, winnings

**Bet**:
The amount staked on one Spin, chosen from the configured bet options.
_Avoid_: wager, stake
