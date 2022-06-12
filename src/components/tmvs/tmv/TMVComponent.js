import React from "react";
import editIcon from '../../../icons/edit.png';
import deleteIcon from '../../../icons/delete.png';

export const TMVComponent = ({tmv, onTMVEdit, onTMVDelete}) => {
    return (
        <tr>
            <td className="col-md-1 p-0 ps-1 align-middle">{tmv.id}</td>
            <td className="p-0 ps-1 align-middle">{tmv.name}</td>
            <td className="col-md-1 p-0 ps-1 align-middle">{tmv.unit.name}</td>
            <td className=" p-0 ps-1 align-middle d-flex justify-content-between">
                <p className="m-0">{tmv.type.name}</p>
                <div>
                    <button className="btn p-0 bc_none" onClick={() => onTMVEdit(tmv)}>
                        <img src={editIcon}/>
                    </button>
                    <button className="btn p-0 ms-4 bc_none" onClick={() => onTMVDelete(tmv)}>
                        <img src={deleteIcon}/>
                    </button>
                </div>
            </td>
        </tr>
    )
}
