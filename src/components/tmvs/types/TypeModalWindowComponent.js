import React from "react";
import './TypeModalWindowComponent.css';
import closeIcon from "../../../icons/close.png";

export const TypeModalWindowComponent = ({visible, onSubmit, typeToEdit, error, onClose}) => {
    if (!visible)
        return null

    return (
        <div className="custom-modal">
            <div className='custom-modal-dialog rounded-2 p-2' onClick={e => e.stopPropagation()}>
                <button className="btn p-0 ms-auto bc_none" onClick={onClose}>
                        <img src={closeIcon}/>
                </button>
                <form className="d-flex flex-column p-3" onSubmit={onSubmit}>
                    <label htmlFor="email" className="form-label">Назва:</label>
                    <div className="d-flex ">
                        {typeToEdit && <input type="name" className="form-control" id="name" name="name"
                                              defaultValue={typeToEdit.name}/>}
                        {!typeToEdit && <input type="name" className="form-control" id="name" name="name"
                                               placeholder="Введіть назву"/>}
                        <button type="submit" className="btn bg-success ms-2">Зберегти</button>
                    </div>
                    <div className="mb-3 bc_danger rounded-2 mt-3 p-1"
                         style={{display: error !== '' ? "block" : "none"}}>
                        <p className="form-label m-0 p-2">{error}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
