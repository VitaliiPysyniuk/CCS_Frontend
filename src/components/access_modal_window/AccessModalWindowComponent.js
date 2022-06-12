import React from "react";
import './AccessModalWindowComponent.css';
import closeIcon from "../../icons/close.png";

export const AccessModalWindowComponent = ({visible, message, onClose}) => {
    if (!visible)
        return null

    return (
        <div className="custom-modal">
            <div className='custom-modal-dialog rounded-2 p-2' onClick={e => e.stopPropagation()}>
                <button className="btn p-0 ms-auto bc_none" onClick={onClose}>
                        <img src={closeIcon}/>
                </button>
                <p className="text-center"><b>{message}</b></p>
            </div>
        </div>
    )
}
