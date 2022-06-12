import React from "react";
import editIcon from '../../../icons/edit.png';
import deleteIcon from '../../../icons/delete.png';

export const TMVUnitComponent = ({unit, onUnitEdit, onUnitDelete}) => {
    return (
        <tr>
            <td className="col-md-1 p-0 ps-1 align-middle">{unit.id}</td>
            <td className="p-0 ps-1 align-middle d-flex justify-content-between">
                <p className="m-0">{unit.name}</p>
                <div>
                    <button className="btn p-0 bc_none" onClick={() => onUnitEdit(unit)}>
                        <img src={editIcon}/>
                    </button>
                    <button className="btn p-0 ms-4 bc_none" onClick={() => onUnitDelete(unit)}>
                        <img src={deleteIcon}/>
                    </button>
                </div>
            </td>
        </tr>
    )
}
