import React from "react";
import editIcon from '../../icons/edit.png';
import deleteIcon from '../../icons/delete.png';

export const WarehouseComponent = ({warehouse, onWarehouseEdit, onWarehouseDelete}) => {
    return (
        <tr>
            <td className="p-0 ps-1 align-middle">{warehouse.id}</td>
            <td className="p-0 ps-1 align-middle">{warehouse.name}</td>
            <td className="p-0 ps-1 align-middle">{warehouse.owner.name}</td>
            <td className="p-0 ps-1 align-middle d-flex justify-content-between">
                <p className="m-0">{warehouse.foreman.name}</p>
                <div>
                    <button className="btn p-0 bc_none" onClick={() => onWarehouseEdit(warehouse)}>
                        <img src={editIcon}/>
                    </button>
                    <button className="btn p-0 ms-4 bc_none" onClick={() => onWarehouseDelete(warehouse)}>
                        <img src={deleteIcon}/>
                    </button>
                </div>
            </td>
        </tr>
    )
}
