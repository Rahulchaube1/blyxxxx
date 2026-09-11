//! Small deterministic game primitives for Blyx programs.
//!
//! This module intentionally contains no rendering framework or global state.
//! It provides the reusable state-transition layer that a future graphical
//! runtime can drive from keyboard, window, or network events.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Direction {
    Left,
    Right,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Action {
    Move(Direction),
    Collect,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CoinDash {
    pub player: usize,
    pub coins: [bool; 3],
    pub score: u32,
    pub over: bool,
}

impl Default for CoinDash {
    fn default() -> Self {
        Self::new()
    }
}

impl CoinDash {
    pub fn new() -> Self {
        Self {
            player: 1,
            coins: [true, true, true],
            score: 0,
            over: false,
        }
    }

    pub fn step(&mut self, action: Action) -> bool {
        if self.over {
            return false;
        }

        match action {
            Action::Move(Direction::Left) => {
                self.player = self.player.saturating_sub(1);
            }
            Action::Move(Direction::Right) => {
                self.player = (self.player + 1).min(2);
            }
            Action::Collect => {
                if self.coins[self.player] {
                    self.coins[self.player] = false;
                    self.score += 10;
                }
            }
        }

        self.over = self.coins.iter().all(|coin| !coin);
        true
    }

    pub fn render(&self) -> String {
        let mut cells = String::new();
        for lane in 0..3 {
            if lane > 0 {
                cells.push_str(" | ");
            }
            let marker = if self.player == lane { 'P' } else if self.coins[lane] { 'C' } else { '.' };
            cells.push(marker);
        }
        format!("[{}] score={}{}", cells, self.score, if self.over { "  YOU WIN!" } else { "" })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn player_stays_inside_three_lanes() {
        let mut game = CoinDash::new();
        game.step(Action::Move(Direction::Left));
        game.step(Action::Move(Direction::Left));
        game.step(Action::Move(Direction::Left));
        assert_eq!(game.player, 0);

        game.step(Action::Move(Direction::Right));
        game.step(Action::Move(Direction::Right));
        game.step(Action::Move(Direction::Right));
        assert_eq!(game.player, 2);
    }

    #[test]
    fn collecting_a_coin_adds_ten_points_once() {
        let mut game = CoinDash::new();
        game.step(Action::Collect);
        game.step(Action::Collect);
        assert_eq!(game.score, 10);
        assert!(!game.coins[1]);
    }

    #[test]
    fn collecting_all_coins_ends_the_game() {
        let mut game = CoinDash::new();
        game.step(Action::Collect);
        game.step(Action::Move(Direction::Left));
        game.step(Action::Collect);
        game.step(Action::Move(Direction::Right));
        game.step(Action::Move(Direction::Right));
        game.step(Action::Collect);
        assert!(game.over);
        assert_eq!(game.score, 30);
    }
}
