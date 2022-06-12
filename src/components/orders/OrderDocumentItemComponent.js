import React from "react";

import './OrderDocumentsComponent.css';
import deleteIcon from "../../icons/delete.png";

export const OrderDocumentItemComponent = ({item, number, onTMVInput, onItemDelete, onNumberChange, onCommentChange,
                                               onCostChange}) => {
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
                <input id="number" className="w-100 p-0 bc_none"
                       defaultValue={parseFloat(item.ordered_number === '' ? 0 : item.ordered_number).toFixed(3)}
                       onChange={(e) => onNumberChange(e, item,  'ordered_number')}/>
            </td>
            <td className="p-0 ps-1 align-middle">
                <input id="number" className="w-100 p-0 bc_none"
                       defaultValue={parseFloat(item.actual_number === '' ? 0 : item.actual_number).toFixed(3)}
                       onChange={(e) => onNumberChange(e, item, 'actual_number')}/>
            </td>
            <td className="p-0 ps-1 align-middle">
                <input id="number" className="w-100 p-0 bc_none"
                       defaultValue={parseFloat(item.cost_per_unit === '' ? 0 : item.cost_per_unit).toFixed(3)}
                       onChange={(e) => onCostChange(e, item)}/>
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
