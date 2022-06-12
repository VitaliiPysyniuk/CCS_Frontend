import React from "react";

import './RemnantReportComponent.css';

export const RemnantReportFormComponent = ({tmv, warehouse, type, onFormSubmit, onTMVInput, onWarehouseInput,
                                                onTypeInput}) => {
    return (
        <div className="t-36 w-25 ms-3">
            <h5 className="m-0 text-center"><b>Залишки ТМЦ</b></h5>
            <form className="d-flex flex-column" onSubmit={onFormSubmit}>
                <div className="d-flex flex-column">
                    <label className="form-label mb-0 mt-2">За період:</label>
                    <div className="d-flex">
                        <div className="d-flex w-50 align-items-center justify-content-between pe-4">
                            <label className="form-label m-0">З:</label>
                            <input className="form-control p-1 date-wt" id="date_from"/>
                        </div>
                        <div className="d-flex w-50 align-items-center justify-content-between ps-4">
                            <label className="form-label m-0">По:</label>
                            <input className="form-control p-1 date-wt" id="date_to"/>
                        </div>
                    </div>

                    <label className="form-label mb-0 mt-2">Склад:</label>
                    <input type="name" className="form-control" id="warehouse"
                           defaultValue={warehouse != null ? warehouse.name : ''} onSelect={onWarehouseInput}/>

                    <label className="form-label mb-0 mt-2">ТМЦ:</label>
                    <input type="name" className="form-control" id="tmv"
                           defaultValue={tmv != null ? tmv.name : ''} onSelect={onTMVInput}/>

                    <label className="form-label mb-0 mt-2">Тип ТМЦ:</label>
                    <input type="name" className="form-control" id="tmv_type"
                           defaultValue={type != null ? type.name : ''} onSelect={onTMVInput} onSelect={onTypeInput}/>

                    <button type="submit" className="btn mt-2 btn-outline-secondary">Сформувати звіт</button>
                </div>
            </form>
        </div>
    )
}
