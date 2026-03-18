import Cell from './Cell.tsx';
import './Grid.css';
import type {CellState} from '../App.tsx';

interface GridProps{
    squares: CellState[][],
    fillSquare(x: number, y:number):void
    unfillSquare(x:number, y:number):void
}

function Grid({squares, fillSquare, unfillSquare}:GridProps){
    function generateSquares(){
        return squares.map((row,y)=>row.map((val,x)=>
            <Cell value={val} leftClick={()=>fillSquare(x,y)} rightClick={()=>unfillSquare(x,y)} key={`${x}-${y}`}/>));
        
    }
    return(
        <div className="grid-container">
            {generateSquares()}
        </div>
    );
}
export default Grid;