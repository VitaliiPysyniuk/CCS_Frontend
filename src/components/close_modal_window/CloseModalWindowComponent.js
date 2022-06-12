import React from "react";
import './CloseModalWindowComponent.css';
import closeIcon from "../../icons/close.png";

export const CloseModalWindowComponent = ({visible, onAccept, onReject, onClose}) => {
    if (!visible)
        return null

    return (
        <div className="custom-modal">
            <div className='custom-modal-dialog rounded-2 p-2' onClick={e => e.stopPropagation()}>
                <button className="btn p-0 ms-auto bc_none" onClick={onClose}>
                        <img src={closeIcon}/>
                </button>
                <p className="text-center"><b>У вас є незбережені зміни в документі</b></p>
                <div className="d-flex justify-content-around h-35">
                    <button className="btn btn-success p-0 w-45" onClick={onAccept}>
                        Зберегти
                    </button>
                    <button className="btn btn-danger p-0 w-45" onClick={onReject}>
                        Не зберігати
                    </button>
                </div>
            </div>
        </div>
    )
}
