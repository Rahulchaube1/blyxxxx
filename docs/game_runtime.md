# Blyx Game Runtime Foundation

Blyx now has a small deterministic game-state layer in `library/blyx-std/src/game.rs`.

## Why this design

The alpha compiler currently parses Blyx source but does not yet generate native code or execute programs. The `blyxc` command therefore cannot honestly claim that a `.blyx` game is playable yet.

The game layer is intentionally independent of rendering. It models the important part first: **state + validated actions + deterministic transitions**. A future terminal, desktop, web, or network frontend can drive the same state machine.

## Coin Dash

`examples/games/coin_dash.blyx` is the first game-oriented Blyx source example. It demonstrates functions, typed parameters/returns, conditionals, local bindings, calls, arithmetic, and output using syntax already present in the project.

The Rust-side state engine exposes:

- `CoinDash::new()` — creates a three-lane game with three coins.
- `CoinDash::step(Action)` — applies one deterministic action.
- `CoinDash::render()` — produces a compact terminal representation.
- `GameAction` — move left, move right, or collect.
- `GameDirection` — left or right.

## Next compiler milestone

To make `coin_dash.blyx` itself executable, the compiler needs a runtime bridge that lowers Blyx calls to standard-library operations and provides a real `blyxc run` execution path. The existing CLI deliberately reports that native build/run is not implemented; this document does not change that claim.

The game state API is kept small so that this bridge can later be reused by a graphical runtime without changing game rules.
