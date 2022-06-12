import React from 'react';
import './WarehouseSelectModalWindowComponent.css';

import {WarehouseChoiceComponent} from "./WarehouseChoiceComponent";

import closeIcon from "../../../icons/close.png";

export const WarehousesChoiceComponent = ({visible, warehouses, closeWarehouseSelect, selectWarehouse}) => {
    if (!visible)
        return null

    return (
        <div className="choice-custom-modal">
            <div className='choice-custom-modal-dialog' onClick={e => e.stopPropagation()}>
                <div className="position-relative">
                    <div className="p-1 d-flex justify-content-end menu">
                        <button className="btn p-0 me-2 bc_none bt-menu" onClick={closeWarehouseSelect}
                                title="Закрити вікно">
                            <img src={closeIcon}/>
                        </button>
                    </div>
                    <table className="table table-bordered t-36">
                        <thead>
                            <tr>
                                <th className="col-md-1" scope="col">Код</th>
                                <th scope="col">Назва</th>
                                <th className="col-md-2" scope="col">Власник</th>
                                <th className="col-md-3" scope="col">Виконроб</th>
                            </tr>
                        </thead>
                        <tbody>
                        {warehouses && warehouses.map(warehouse =>
                            <WarehouseChoiceComponent warehouse={warehouse} key={warehouse.id}
                                                      select={selectWarehouse}/>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
