import React from "react";

import './MovementDocumentsComponent.css';
import deleteIcon from "../../icons/delete.png";
import held from "../../icons/held.png";
import notHeld from "../../icons/not_held.png";

export const ShortMovementDocumentItem = ({document, onStatusChange, onDocumentSelect, onDocumentDelete}) => {
    return (
        <tr>
            <td className="p-0 px-1">
                <button className="btn p-0 mx-auto bc_none w-100" onClick={() => onStatusChange(document)}>
                        <img src={document.confirmation_status ? held : notHeld}/>
                </button>
            </td>
            <td className="p-0 ps-1 align-middle" onClick={() => onDocumentSelect(document)}>
                {document.confirmation_timestamp.split('T')[0]}
            </td>
            <td className="p-0 ps-1 align-middle" onClick={() => onDocumentSelect(document)}>
                №{document.id}
            </td>
            <td className="p-0 ps-1 align-middle" onClick={() => onDocumentSelect(document)}>
                {document.creator.name}
            </td>
            <td className="p-0 ps-1 align-middle" onClick={() => onDocumentSelect(document)}>
                {document.from_warehouse.name}
            </td>
            <td className="p-0 ps-1 align-middle" onClick={() => onDocumentSelect(document)}>
                {document.to_warehouse.name}
            </td>
            <td className="p-0 ps-1" onClick={() => onDocumentSelect(document)}>{document.comment}</td>
            <td className="p-0">
                <div>
                    <button className="btn p-0 bc_none" onClick={() => onDocumentDelete(document)}>
                        <img src={deleteIcon}/>
                    </button>
                </div>
            </td>
        </tr>
    )
}
