import './App.css'
import {useState, useEffect} from 'react';
import Grid from './components/Grid.tsx';
export type CellState = "empty" | "filled" | "marked" | "completed" | "wrong" | "wrongguess" | "mistake";
export type GameMode = "live_validation" | "no_live_validation";
export type HintState = {
  value: number,
  start: number,
  end: number
}

function generateEmptyBoard(): CellState[][] {
    return Array(10).fill(null).map(() => Array(10).fill("empty"));
  };

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getChunk = (min: number, max: number): number => {
  const p = getRandomInt(1, 100); 
  let size = 1;

  if (p <= 55) {
    size = 1  
  } 
  else if (p <= 85) {
    size = 2;                    
  } 
  else if (p <= 95) {
    size = 3;                   
  } 
  else if (p <= 99) {
    size = 4;  
  }
  else {size = getRandomInt(5,10);}

  return Math.max(min, Math.min(size, max));
};

function generateSolution(): CellState[][] {
  const solutionMatrix: CellState[][] = generateEmptyBoard();
  const m = solutionMatrix.length;

  for (let x = 0; x < m; x++) {
    let availableCells = m;
    let generatedNumber = getChunk(1, m);
    availableCells -= generatedNumber; 
    let startIndex = getRandomInt(0, Math.min(availableCells, 2));

    while (availableCells >= 0) { 
      for (let y = startIndex; y < startIndex + generatedNumber; y++) {
        if (y < m) solutionMatrix[x][y] = "filled"; 
      }
      startIndex += generatedNumber;
      availableCells= m - startIndex;
      if (availableCells <= 0) break;
      const gap = getChunk(1, availableCells);
      startIndex += gap;
      availableCells = m - startIndex;
      if (availableCells <= 0) break;
      generatedNumber = getChunk(1, availableCells);
      availableCells -= generatedNumber;
    }
  }
  const res = solutionMatrix.map((row) =>
    row.map((val) => (val === "empty" ? "marked" : "filled"))
  );

  return res;
}
function generateHints(solution: CellState[][]): [HintState[][], HintState[][]] {
  const rows = solution.length;
  const cols = solution[0].length; 
  const rowHints: HintState[][] = Array.from({ length: rows }, () => []);
  const colHints: HintState[][] = Array.from({ length: cols }, () => []);

  for (let i = 0; i < rows; i++) {
    let filledRowBlockSize = 0;
    let rowBlockStart = -1; 

    let filledColBlockSize = 0; 
    let colBlockStart = -1; 

    for (let j = 0; j < cols; j++) {
      if (solution[i][j] === "filled") { 
        if (filledRowBlockSize === 0) rowBlockStart = j; 
        filledRowBlockSize++; 
      } 
      else {
        if (filledRowBlockSize > 0) {
          rowHints[i].push({
            value: filledRowBlockSize,
            start: rowBlockStart,
            end: j - 1 
          });
          filledRowBlockSize = 0;
        }
      }

      if (solution[j][i] === "filled") { 
        if (filledColBlockSize === 0) colBlockStart = j; 
        filledColBlockSize++; 
      } 
      else {
        if (filledColBlockSize > 0) {
          colHints[i].push({
            value: filledColBlockSize,
            start: colBlockStart,
            end: j - 1 
          });
          filledColBlockSize = 0;
        }
      }
    }

    if (filledRowBlockSize > 0 ) {
      rowHints[i].push({
        value: filledRowBlockSize,
        start: rowBlockStart,
        end: cols - 1 
      });
    }
    if (filledColBlockSize > 0){
      colHints[i].push({
        value: filledColBlockSize,
        start: colBlockStart,
        end: rows - 1 
      });
    }
  }
  return [rowHints, colHints];
}
const firstSolution:CellState[][] = generateSolution();
const [firstRowHints,firstColHints] = generateHints(firstSolution);
console.log(firstSolution);

function isHintCrossed(hint: HintState, playerLine: CellState[]): boolean {
  for (let k = hint.start; k <= hint.end; k++) {
    if (playerLine[k] !== "filled") return false;
  }

  if (hint.start > 0 && playerLine[hint.start - 1] === "filled") return false;
  if (hint.end < playerLine.length - 1 && playerLine[hint.end + 1] === "filled") return false;

  return true;
}

const Hints = ({ hints, mode, matrix }: { hints: HintState[][], mode: 'row' | 'col', matrix: CellState[][] }) => {
  const getPlayerLine = (index: number) => {
    if (mode === 'row') return matrix[index];
    return matrix.map(row => row[index]); 
  };

  return (
    <div className={`${mode}-hints-container`}>
      {hints.map((lineHints, i) => {
        const playerLine = getPlayerLine(i); 
        return (
          <div key={i} className={`hint-${mode}`}>
            {lineHints.map((hint, j) => {
              const crossed = isHintCrossed(hint, playerLine);
              return (
                <span key={j} className={crossed ? "crossed-out" : ""}>
                  {hint.value}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

function App() {
  const [matrix, setMatrix] = useState<CellState[][]>(generateEmptyBoard);
  const [isDragging, setIsDragging] = useState(false);
  const [activeValue, setActiveValue] = useState<CellState | null>(null);
  const [solution, setSolution] = useState<CellState[][]>(firstSolution);
  const [rowHints, setRowHints] = useState<HintState[][]>(firstRowHints);
  const [colHints, setColHints] = useState<HintState[][]>(firstColHints);
  const [gameMode, setGameMode] = useState<GameMode>("live_validation");
  const [mistakes, setMistakes] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setActiveValue(null);
    };

    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };



    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("contextmenu",blockContextMenu);


    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("contextmenu",blockContextMenu);
    };
  }, []
  ); 


  function newGame(){
    const newSolution = generateSolution();
    const [newRowHints, newColHints] = generateHints(newSolution);
    
    setSolution(newSolution);
    setRowHints(newRowHints);
    setColHints(newColHints);

    setMatrix(generateEmptyBoard());
    setMistakes(0);
    setIsSolved(false);
  }

  function changeGameMode(){
    const newMode = gameMode === "live_validation" ? "no_live_validation" : "live_validation";
    setGameMode(newMode);
    newGame();
  }

  function liveWinCheck(currentMatrix: CellState[][]): boolean {
    return currentMatrix.every((row, x) =>
      row.every((val, y) => {
        return (solution[x][y] === "filled") === (val === "filled");
      })
    );
  }

  function solvePuzzle(){
      const isCompleted = liveWinCheck(matrix);
      if (isCompleted){
          setMatrix(prev => prev.map(row => 
          row.map((val)=>val === "filled" ? "completed" : "empty")));
      }
      else {
        setMatrix(prev => prev.map(row => 
          row.map((val)=>val === "filled" ? "wrong" : "empty")));
      }
      setIsSolved(true);
  };

  const buttonClicked = (event: React.MouseEvent): boolean => {
    return event.button === 2 || event.buttons === 2;
  };

  function handleMouseDrag(x: number, y: number, event: React.MouseEvent) {
    if (isSolved) return;

    setIsDragging(true);
    const isRightClick = buttonClicked(event);
    const currentVal = matrix[y][x];  
    let intendedValue: CellState; 

    if (isRightClick) {
      intendedValue = currentVal === "marked" ? "empty" : "marked";
    } else {
      intendedValue = currentVal === "filled" ? "empty" : "filled";
    }

    setActiveValue(intendedValue);
    let targetValue:CellState = intendedValue;

    if (gameMode !== "no_live_validation") {
      if (!isRightClick && targetValue === "filled" && solution[y][x] !== "filled") {
        targetValue = "wrongguess";
        setMistakes(m => m + 1);
      }
      else if (isRightClick && targetValue === "marked" && solution[y][x] === "filled") {
        targetValue = "wrongguess";
        setMistakes(m => m + 1);
      }
    }

    setMatrix(prev => prev.map((row, _y) => 
      _y === y ? row.map((val, _x) => (_x === x ? targetValue : val)) : row
    ));

  }
  function handleMouseEnter(x: number, y: number) {
    if (isSolved || !isDragging || activeValue === null) return;

    const currentVal = matrix[y][x];
    if (currentVal === activeValue || currentVal === "wrongguess") return;
    let targetValue: CellState = activeValue;

    if (gameMode !== "no_live_validation") {
      if (activeValue === "filled" && solution[y][x] !== "filled") {
        targetValue = "wrongguess";
        setMistakes(m => m + 1);
      } 
      else if (activeValue === "marked" && solution[y][x] === "filled") {
        targetValue = "wrongguess";
        setMistakes(m => m + 1);
      }
    }
    setMatrix(prev => prev.map((row, _y) => 
      _y === y ? row.map((val, _x) => (_x === x ? targetValue : val)) : row
    ));
    const isWon = liveWinCheck(matrix);
    if(isWon && mistakes === 0){
      setMatrix(prev => prev.map(row => 
          row.map((val)=>val === "filled" ? "completed" : "mistake")));
      setIsSolved(true);
    }
    if(isWon && mistakes !== 0){
      setMatrix(prev => prev.map(row => 
          row.map((val)=>val === "filled" ? "wrong" : "mistake")));
      setIsSolved(true);
    }
  }

 
  function handleMouseUp(){
    setIsDragging(false);
    setActiveValue(null);
    const isWon = liveWinCheck(matrix);
    if(isWon && mistakes === 0){
      setMatrix(prev => prev.map(row => 
          row.map((val)=>val === "filled" ? "completed" : "empty")));
      setIsSolved(true);
    }
    if(isWon && mistakes !== 0){
      setMatrix(prev => prev.map(row => 
          row.map((val)=>val === "filled" ? "wrong" : "empty")));
      setIsSolved(true);
    }
  }

 
  return (
    <>
    <div className="main-layout">
      <div className="side-bar">
        <h2>MyPicross</h2>
        <div className="progress-bar">
          <button type="button" className={gameMode === "no_live_validation" ? "side-btn" : "mistakes-valid"} disabled={isSolved} 
            onClick={solvePuzzle}>Solve Puzzle</button> 
          <div className={gameMode === "live_validation" ? "mistakes-chart" : "mistakes-valid"}>
            <h3>Mistakes</h3>
            <span>{mistakes}</span>
          </div>
          <button type="button" className="side-btn" onClick={newGame}>New Game</button>
          <button type="button" className="side-btn" onClick={changeGameMode}>{gameMode === "live_validation" ? "Disable" : "Enable"} live validation</button>
        </div>
      </div>
      <div className="game-container" onContextMenu={(e) => e.preventDefault()}>
        <div className="top-bar">
          <div className="corner"/>
          <Hints hints={colHints} mode="col" matrix={matrix}/>
        </div>
        <div className="bottom-bar">
          <Hints hints={rowHints} mode="row" matrix={matrix}/>
          <div className={isSolved ? 'locked-grid' : ""}>
            <Grid squares={matrix} startDrag={handleMouseDrag} continueDrag={handleMouseEnter} 
              endDrag={handleMouseUp} mode={gameMode}/>
          </div>
        </div>
      </div>
    </div>  
    </>
  );
}

export default App
