import type {CellState} from '../App.tsx';
import './Cell.css';

interface CellProps{
    value: CellState,
    leftClick: () => void,
    rightClick: () => void
};

function Cell({value, leftClick, rightClick}:CellProps){
    // const divVal = value === "marked" ? "X" : "";
    return(
        <div className={value + `Square`} onClick={leftClick} onContextMenu={(e)=>{
            e.preventDefault();
            rightClick();
        }}> </div>
    );
}
export default Cell;