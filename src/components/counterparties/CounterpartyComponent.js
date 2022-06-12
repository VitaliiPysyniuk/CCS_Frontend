import React from "react";
import editIcon from '../../icons/edit.png';
import deleteIcon from '../../icons/delete.png';

export const CounterpartyComponent = ({counterparty, onCounterpartyEdit, onCounterpartyDelete}) => {
    return (
        <tr>
            <td className="p-0 ps-1 align-middle">{counterparty.id}</td>
            <td className="p-0 ps-1 align-middle">{counterparty.name}</td>
            <td className="p-0 ps-1 align-middle">{counterparty.type.name}</td>
            <td className="p-0 ps-1 align-middle d-flex justify-content-between">
                <p className="m-0">{counterparty.contact_data}</p>
                <div>
                    <button className="btn p-0 bc_none" onClick={() => onCounterpartyEdit(counterparty)}>
                        <img src={editIcon}/>
                    </button>
                    <button className="btn p-0 ms-4 bc_none" onClick={() => onCounterpartyDelete(counterparty)}>
                        <img src={deleteIcon}/>
                    </button>
                </div>
            </td>
        </tr>
    )
}
