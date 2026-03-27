# 🧩 MyPicross: React Picross/Nonogram App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Like most Picross apps, this one has two game modes: Live Validation and No Live Validation. It can be played through the **[web version](https://sevaa25.github.io/picross/)** or installed and played locally, whichever option suits you more.

## Why these technologies?
Since Picross involves сonstant data changes, mouse events, and screen updates, I used React. My game has a 10x10 grid, which is why it made perfect sense to rely on React's state management and Virtual DOM to ensure that when a player makes a move, only specific cells get updated without re-rendering all the others. 

I needed to have custom-made types and be able to manage them without creating chaos. This made absolutely no sense using anything but TypeScript.

Managing those 100 cells with multiple possible states (empty, filled, marked, wrong) in my custom type just screamed for TypeScript use. Building this with anything else would make absolutely no sense.

## Game features:
* **Intelligent Solution Generator:** The engine procedurally generates a new puzzle layout every time a game begins. It takes a blank grid and populates it with groups of randomly placed filled, randomly-sized blocks and empty spaces.
* **Hint Generator:** Once the solution is generated, it gets scanned from top to bottom and left to right to generate the exact numerical representation of filled blocks for each row and column, so the player can deduce the right solution.
* **Clean Slate:** "New Game" button implemented. Click it, get an empty board, and receive a brand new puzzle to wrap your head around.
  
  ![newgame-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/1cce4d68-bdc1-4556-89e5-7195a694c2a8)

* **Instant Mode Switching:** Changing game modes is as easy and instant as turning a light switch on and off. Toggling the mode automatically activates a fresh start with a new game.

  ![modeswitch-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/070a8ff5-4b9c-44ab-a557-b4568a2db9f8)

* **"Paint" Brush:** An efficient click-and-drag system that allows players to seamlessly fill or mark multiple squares at once.

  ![basicmechanics-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/5e3b3907-ce2a-4b56-83c4-bebddfb6f0c1)

* **Instant Mistake Detection:** Tracks the player's every move and compares it to the solution. If the player fills or marks the wrong square, the cell is marked as a "mistake" and can't be changed. The mistake count increases. *(Available only in Live Validation Mode)*.
  
  ![mistakes-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/0e56d678-633e-4234-8b19-abefeae65519)

* **Auto-Win Detection:** Compares the player's grid with the actual solution after every single move. If the filled squares match perfectly, the game immediately ends with either a win or a loss animation, depending on the mistake count. *(Available only in Live Validation Mode)*.

  **Win animation:**
  
  ![rightsolve_valid-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/9bbbc7ac-37ef-4899-a5ee-666e68b17354)

  **Loss animation:**

  ![wrongsolve_valid-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/ae6662fb-70cc-4d2c-b125-d3dcf14a61b4)
  
* **Solve Puzzle:** Once you're done filling out your grid, click this button to find out whether you were right or wrong. Use it wisely, since there are no second chances. Once clicked, the game is over, and the grid is permanently locked until a new game is started. *(Available only in No Live Validation Mode)*.

  **Win animation:**

  ![rightsolve_novalid-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/651cea41-4912-462e-9166-1d3a61ab9b3e)

  **Loss animation:**

  ![wrongsolve_novalid-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/a4dc1830-b908-418d-877b-e13d842af766)


* **Intelligent Cross-Out:** Helps players track their progress by monitoring the coordinates of every filled block on the board in real time, crossing out those that match the solution.

## More about the algorithm
First, the generator creates an empty 10x10 matrix of custom type  `CellState`, which later on gets mapped onto the UI inside the `Grid` component. Strict TypeScript typing guarantees that there are no surprises (null or undefined values) breaking the grid.

Then, it iterates through each row using a custom-made pseudorandom function to decide on the size of filled blocks and gaps between them. It's not completely random, because TypeScript's Random generator has proven to have a tendency of picking largest numbers possible during tests, which would make the game pretty boring. To fix this, I had to set the "odds" of getting each number from 0 to 10 manually using test results and personal experience of playing Picross in the past.

These functions are placed outside of the App component function, so we don't redefine them from scratch during every re-render. That way, we can use the benefits of React as much as possible.

# Build
If you want to play the game locally and/or would like to take a closer look at the code and maybe change something for yourself, here's how you build MyPicross:
First, you'll need these:
* **Node.js:** Version 18.0 or higher (required for Vite and the local server).
* **Npm**: Comes automatically bundled with Node.js.
* **Git:** Cloning the repository.
Any modern browser (Chrome, Firefox, Edge, Safari) can run and play the game.

<details>
<summary>Click here for build instructions</summary>
  
### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sevaa25/picross
   cd picross
2. **Install node_modules and other dependencies:**
   ```bash
   npm install
3. **Start the local server:**
   ```bash
   npm run dev

These steps apply to both Linux and Windows, since npm, git, and cd work everywhere.
</details>

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

