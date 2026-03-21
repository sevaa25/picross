import './App.css'
import {useState, useEffect} from 'react';
import Grid from './components/Grid.tsx';
export type CellState = "empty" | "filled" | "marked";

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
function generateHints(solution: CellState[][]): [number[][], number[][]] {
  const rows = solution.length;
  const cols = solution[0].length; 
  const rowHints: number[][] = Array.from({ length: rows }, () => []);
  const colHints: number[][] = Array.from({ length: rows }, () => []);

  for (let i = 0; i < rows; i++) {
    let filledRowBlockSize = 0;
    let filledColBlockSize = 0; 
    for (let j = 0; j < cols; j++) {
      if (solution[i][j] === "filled") { filledRowBlockSize++; } 
      else {
        if (filledRowBlockSize > 0) {
          rowHints[i].push(filledRowBlockSize);
          filledRowBlockSize = 0;
        }
      }
      if (solution[j][i] === "filled") { filledColBlockSize++; } 
      else {
        if (filledColBlockSize > 0) {
          colHints[i].push(filledColBlockSize);
          filledColBlockSize = 0;
        }
      }
    }
    if (filledRowBlockSize > 0 ) {
      rowHints[i].push(filledRowBlockSize);
    }
    if(filledColBlockSize > 0){
      colHints[i].push(filledColBlockSize);
    }
  }
  return [rowHints, colHints];
}

const solution:CellState[][] = generateSolution();
const [rowHints,colHints] = generateHints(solution);
console.log(rowHints);
console.log(colHints);

const Hints = ({ hints, mode }: { hints: number[][], mode: 'row' | 'col' }) => (
  <div className={`${mode}-hints-container`}>
    {hints.map((line, i) => (
      <div key={i} className={`hint-${mode}`}>
        {line.map((num, j) => <span key={j}>{num}</span>)}
      </div>
    ))}
  </div>
);

function App() {

  const [matrix, setMatrix] = useState<CellState[][]>(generateEmptyBoard);
  const [isDragging, setIsDragging] = useState(false);
  const [activeValue, setActiveValue] = useState<CellState | null>(null);

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

  const buttonClicked = (event: React.MouseEvent): boolean => {
    return event.button === 2 || event.buttons === 2;
  };

  function handleMouseDrag(x: number, y: number, event: React.MouseEvent){
    setIsDragging(true);
    const isRightClick = buttonClicked(event);
    const currentVal = matrix[y][x];
    let targetValue: CellState;
    if(isRightClick) { 
      targetValue = currentVal === "marked" ? "empty" : "marked";
    }
    else {
      targetValue = currentVal === "filled" ? "empty" : "filled";
    }
    setActiveValue(targetValue);
    setMatrix(prev => prev.map((row, _y) => 
      _y === y ? row.map((val, _x) => (_x === x ? targetValue : val)) : row
    ));
  }


  function handleMouseEnter(x: number, y: number){
    if(!isDragging || activeValue === null) return;
    setMatrix(prev => prev.map((row, _y) => 
      _y === y ? row.map((val, _x) => (_x === x ? activeValue : val)) : row
    ));
    }
  
  function handleMouseUp(){
    setIsDragging(false);
    setActiveValue(null);
  }

 
  return (
    <div className='game-container' onContextMenu={(e) => e.preventDefault()}>
      <div className='top-bar'>
        <div style={{width: '55px'}}/>
        <Hints hints={colHints} mode='col'/>
      </div>
      <div className='side-bar'>
        <Hints hints={rowHints} mode='row'/>
        <Grid squares={solution} startDrag={handleMouseDrag} continueDrag={handleMouseEnter} endDrag={handleMouseUp}/>
      </div> 
    </div>
  );
}

export default App
