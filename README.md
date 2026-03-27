# 🧩 MyPicross: React Picross/Nonogram App

Like most Picross apps, this one has two game modes: Live Validation and No Live Validation. It can be played through the **[web version](https://sevaa25.github.io/picross/)** or installed and played locally, whichever option suits you more.

## Game features:

* **Intelligent Pseudorandom Solution Generator:** The engine procedurally generates a new puzzle layout every time a game begins. It takes a blank grid and populates it with varied clusters of randomly placed filled blocks and empty spaces, while making sure to stick to the mathematical rules of Picross.
* **Hint Generator:** Once the solution is generated, it gets scanned from top to bottom and left to right to generate the exact numerical representation of filled blocks for each row and column, so the player can deduce the right solution.
* **Clean Slate:** "New Game" button implemented. Click it, get an empty board, and receive a brand new puzzle to wrap your head around.
* **Instant Mode Switching:** Changing game modes is as easy and instant as turning a light switch on and off. Toggling the mode automatically activates a fresh start with a new game.
* **"Paint" Brush:** An efficient click-and-drag system that allows players to seamlessly fill or mark multiple squares at once in a single motion.
* **Instant Mistake Detection:** Tracks the player's every move and compares it to the solution. If the player fills or marks the wrong square, the cell visually changes, and the mistake count increases. *(Available only in Live Validation Mode)*.
* **Auto-Win Detection:** Compares the player's grid with the actual solution after every single move. If they match perfectly, the game immediately ends with either a win or a loss animation, depending on the mistake count. *(Available only in Live Validation Mode)*.
* **Solve Puzzle:** Once you're done filling out your grid, click this button to find out whether you were right or wrong. Use it wisely—there are no second chances. Once clicked, the game is over and the grid is permanently locked. *(Available only in Standard Mode)*.
* **Intelligent Cross-Out:** The smart hint system helps players track their progress by mathematically monitoring the coordinates of every required block on the board in real time, crossing out hints as you complete them.
