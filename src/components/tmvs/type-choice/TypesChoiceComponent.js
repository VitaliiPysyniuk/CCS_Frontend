import React from 'react';
import './TypeSelectModalWindowComponent.css';

import {TypeChoiceComponent} from "./TypeChoiceComponent";

import closeIcon from "../../../icons/close.png";

export const TypesChoiceComponent = ({visible, types, closeTypeSelect, selectType}) => {
    if (!visible)
        return null

    return (
        <div className="choice-custom-modal">
            <div className='choice-custom-modal-dialog' onClick={e => e.stopPropagation()}>
                <div className="position-relative">
                    <div className="p-1 d-flex justify-content-end menu">
                        <button className="btn p-0 me-2 bc_none bt-menu" onClick={closeTypeSelect} title="Закрити вікно">
                            <img src={closeIcon}/>
                        </button>
                    </div>
                    <table className="table table-bordered t-36">
                        <thead>
                        <tr>
                            <th className="col-md-1" scope="col">Код</th>
                            <th scope="col">Назва</th>
                        </tr>
                        </thead>
                        <tbody>
                        {types && types.map(type => <TypeChoiceComponent type={type} key={type.id} select={selectType}/>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
