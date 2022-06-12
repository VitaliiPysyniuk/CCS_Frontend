import React from "react";
import editIcon from '../../../icons/edit.png';
import deleteIcon from '../../../icons/delete.png';

export const TMVTypeComponent = ({type, onTypeEdit, onTypeDelete}) => {
    return (
        <tr>
            <td className="col-md-1 p-0 ps-1 align-middle">{type.id}</td>
            <td className="p-0 ps-1 align-middle d-flex justify-content-between">
                <p className="m-0">{type.name}</p>
                <div>
                    <button className="btn p-0 bc_none" onClick={() => onTypeEdit(type)}>
                        <img src={editIcon}/>
                    </button>
                    <button className="btn p-0 ms-4 bc_none" onClick={() => onTypeDelete(type)}>
                        <img src={deleteIcon}/>
                    </button>
                </div>
            </td>
        </tr>
    )
}
