import Cell from './Cell.tsx';
import './Grid.css';
import type {CellState, GameMode} from '../App.tsx';

interface GridProps{
    squares: CellState[][],
    startDrag(x: number, y:number,event: React.MouseEvent):void,
    continueDrag(x: number, y:number):void,
    endDrag():void
    mode: GameMode
}

function Grid({squares, startDrag, continueDrag, endDrag, mode}:GridProps){
    function generateSquares(){
        return squares.map((row,y)=>row.map((val,x)=>
            <Cell value={val} mouseDrag={(e:React.MouseEvent)=>startDrag(x,y,e)}  
            mouseEnter={()=>continueDrag(x,y)} mouseUp={()=>endDrag()} key={`${x}-${y}`} gameMode={mode}/>));
        
    }
    return(
        <div className="grid-container" onContextMenu={(e) => e.preventDefault()}>
            {generateSquares()}
        </div>
    );
}
export default Grid;