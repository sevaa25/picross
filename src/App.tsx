import './App.css'
import {useState, useEffect} from 'react';
import Grid from './components/Grid.tsx';
export type CellState = "empty" | "filled" | "marked";

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


function App() {

  function generateEmptyBoard(): CellState[][] {
    return Array(10).fill(null).map(() => Array(10).fill("empty"));
  };
  const [matrix, setMatrix] = useState<CellState[][]>(generateEmptyBoard);
  const [isDragging, setIsDragging] = useState(false);
  const [activeValue, setActiveValue] = useState<CellState | null>(null);

  function generateSolution(): CellState[][] {
    const solutionMatrix: CellState[][] = generateEmptyBoard();
    const m = solutionMatrix.length;
    const MAX_CHUNK = 5;
    for (let x = 0; x < m; x++) {
      let availableCells = m;
      let generatedNumber = getRandomInt(1, Math.min(m,MAX_CHUNK));
      availableCells -= generatedNumber; 
      let startIndex = getRandomInt(0, availableCells);
      while (availableCells >= 0) { 
        for (let y = startIndex; y < startIndex + generatedNumber; y++) {
          if (y < m) solutionMatrix[x][y] = "filled"; 
        }
        startIndex += generatedNumber;
        availableCells= m - startIndex;
        if (availableCells <= 0) break;
        const gap = getRandomInt(1, availableCells);
        startIndex += gap;
        availableCells = m - startIndex;
        if (availableCells <= 0) break;
        generatedNumber = getRandomInt(1, Math.min(availableCells, MAX_CHUNK));
        availableCells -= generatedNumber;
      }
    }
    const res = solutionMatrix.map((row) =>
      row.map((val) => (val === "empty" ? "marked" : "filled"))
    );
  
    return res;
  }
  const solution:CellState[][] = generateSolution();
  console.log(solution);


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
      <Grid squares={solution} startDrag={handleMouseDrag} continueDrag={handleMouseEnter} endDrag={handleMouseUp}/>
    </div>
  );
}

export default App
