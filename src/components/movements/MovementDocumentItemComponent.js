import React from "react";

import './MovementDocumentsComponent.css';
import deleteIcon from "../../icons/delete.png";

export const MovementDocumentItemComponent = ({item, number, onTMVInput, onItemDelete, onNumberChange, onDateChange,
                                                  onCommentChange}) => {

    const onDateFieldChange = (event) => {
        onDateChange(event, item)
        const value = event.target.value
        if (value.length == 4) {
            event.target.value = `${value}-`
        } else if (value.length == 7) {
            event.target.value = `${value}-`
        }
    }

    return (
        <tr>
            <td className="p-0 ps-1 align-middle">{number}</td>
            <td className="p-0 ps-1 align-middle">
                <input id="tmv" className="w-100 p-0 bc_none" defaultValue={item.tmv.name}
                       onSelect={() => onTMVInput(item)}/>
            </td>
            <td className="p-0 ps-1 align-middle">
                <input id="unit" className="w-100 p-0 bc_none" defaultValue={item.tmv.unit.name}/>
            </td>
            <td className="p-0 ps-1 align-middle">
                <input id="number" className="w-100 p-0 bc_none" defaultValue={item.number}
                       onChange={(e) => onNumberChange(e, item)}/>
            </td>
            <td className="p-0 ps-1 align-middle">
                {item.cost_per_unit}
            </td>
            <td className="p-0 ps-1 align-middle">
                <input id="date" className="w-100 p-0 bc_none" defaultValue={item.date}
                       onChange={onDateFieldChange}/>
            </td>
            <td className="p-0 ps-1 align-middle d-flex justify-content-between">
                <input id="comment" className="w-100 p-0 bc_none" defaultValue={item.comment}
                       onChange={(e) => onCommentChange(e, item)}/>
                <div>
                    <button className="btn p-0 ms-4 bc_none" onClick={() => onItemDelete(item)}>
                        <img src={deleteIcon}/>
                    </button>
                </div>
            </td>
        </tr>
    )
}
