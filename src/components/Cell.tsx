import type {CellState, GameMode} from '../App.tsx';
import './Cell.css';

interface CellProps{
    value: CellState,
    mouseDrag: (e:React.MouseEvent) => void,
    mouseEnter: () => void
    mouseUp: () => void
    gameMode: GameMode
};

function Cell({value, mouseDrag, mouseEnter, mouseUp, gameMode}:CellProps){
    const divValue = (gameMode === "live_validation" && (value === "wrongguess" || value === "mistake")) ? "X" : "";
    return(
        <div className={value + `Square`} onMouseDown={mouseDrag}
            onMouseEnter={mouseEnter} onMouseUp={mouseUp} >{divValue}</div>
    );
}
export default Cell;