import React, {useEffect, useState} from "react";
import './TMVModalWindowComponent.css';
import closeIcon from "../../../icons/close.png";
import {tmvServices} from "../../../services";
import {TMVTypeComponent} from "../types/TMVTypeComponent";

export const TMVModalWindowComponent = ({visible, onSubmit, TMVToEdit, error, onClose}) => {
    const [types, setTypes] = useState(null);
    const [units, setUnits] = useState(null);

    const fetchData = async () => {
        let typesData = await tmvServices.getAll('/types');
        let unitsData = await tmvServices.getAll('/units');
        setTypes(typesData);
        setUnits(unitsData);
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (!visible)
        return null


    return (
        <div className="custom-modal">
            <div className='custom-modal-dialog rounded-2 p-2' onClick={e => e.stopPropagation()}>
                <button className="btn p-0 ms-auto bc_none" onClick={onClose}>
                    <img src={closeIcon}/>
                </button>
                <form className="d-flex flex-column p-3" onSubmit={onSubmit}>
                    <div className="d-flex flex-column">
                        <label htmlFor="email" className="form-label mb-0 mt-2">Назва:</label>
                        {TMVToEdit && <input type="name" className="form-control" id="name" name="name"
                                             defaultValue={TMVToEdit.name}/>}
                        {!TMVToEdit && <input type="name" className="form-control" id="name" name="name"
                                              placeholder="Введіть назву"/>}

                        <label htmlFor="email" className="form-label mb-0 mt-2">Тип:</label>
                        <select className="form-select" id="type">
                            {types && types.map(type => {
                                if (TMVToEdit && TMVToEdit.type.id == type.id) {
                                    return <option selected value={type.id}>{type.name}</option>
                                }
                                return <option value={type.id}>{type.name}</option>
                            })}
                        </select>

                        <label htmlFor="email" className="form-label mb-0 mt-2">Одиниця:</label>
                        <select className="form-select" id="unit">
                            {units && units.map(unit => {
                                if (TMVToEdit && TMVToEdit.unit.id == unit.id) {
                                    return <option selected value={unit.id}>{unit.name}</option>
                                }
                                return <option value={unit.id}>{unit.name}</option>
                            })}
                        </select>

                        <button type="submit" className="btn mt-2 bg-success">Зберегти</button>
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
