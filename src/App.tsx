import './App.css'
import {useState, useEffect} from 'react';
import Grid from './components/Grid.tsx';
export type CellState = "empty" | "filled" | "marked";


function generateEmptyBoard(): CellState[][] {
  return Array(10).fill(null).map(() => Array(10).fill("empty"));
};

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
      <Grid squares={matrix} startDrag={handleMouseDrag} continueDrag={handleMouseEnter} endDrag={handleMouseUp}/>
    </div>
  );
}

export default App
