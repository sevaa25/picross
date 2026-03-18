import './App.css'
import {useState} from 'react';
import Grid from './components/Grid.tsx';
export type CellState = "empty" | "filled" | "marked";

function generateEmptyBoard(): CellState[][] {
  return Array(10).fill(null).map(() => Array(10).fill("empty"));
};

function App() {

  const [matrix, setMatrix] = useState<CellState[][]>(generateEmptyBoard);
    function leftClick(x:number,y:number){
      const newMatrix = matrix.map((row,_y)=>row.map((val, _x)=>{
      if (_x === x && _y === y) {
        if (val === "empty") return "filled";
        if (val === "filled") return "empty";
        if (val === "marked") return "filled"; 
      }
      return val;
      }));
      setMatrix(newMatrix);
    }

    function rightClick(x:number, y:number){
      const newMatrix = matrix.map((row,_y)=>row.map((val, _x)=>{
      if (_x === x && _y === y) {
        if (val === "empty") return "marked";
        else if (val === "filled") return "marked";
        else if (val === "marked") return "empty"; 
      }
      return val;
      }));
      setMatrix(newMatrix);
    }
    return (
      <div className='game-container'>
        <Grid squares={matrix} fillSquare={leftClick} unfillSquare={rightClick}/>
      </div>
    );
}

export default App
