import type {CellState} from '../App.tsx';
import './Cell.css';

interface CellProps{
    value: CellState,
    mouseDrag: (e:React.MouseEvent) => void,
    mouseEnter: () => void
    mouseUp: () => void
};

function Cell({value, mouseDrag, mouseEnter, mouseUp}:CellProps){
    return(
        <div className={value + `Square`} onMouseDown={mouseDrag}
            onMouseEnter={mouseEnter} onMouseUp={mouseUp} > </div>
    );
}
export default Cell;