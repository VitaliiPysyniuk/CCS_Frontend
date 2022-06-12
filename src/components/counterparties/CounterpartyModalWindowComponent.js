import React, {useEffect, useState} from "react";
import './CounterpartyModalWindowComponent.css';
import closeIcon from "../../icons/close.png";
import {counterpartyServices} from "../../services";

export const CounterpartyModalWindowComponent = ({visible, onSubmit, counterpartyToEdit, error, onClose}) => {
    const [types, setTypes] = useState(null);

    const fetchData = async () => {
        let typesData = await counterpartyServices.getAll('/types');
        setTypes(typesData);
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
                        {counterpartyToEdit && <input type="name" className="form-control" id="name" name="name"
                                              defaultValue={counterpartyToEdit.name}/>}
                        {!counterpartyToEdit && <input type="name" className="form-control" id="name" name="name"
                                               placeholder="Введіть назву"/>}

                        <label htmlFor="contact" className="form-label mb-0 mt-2">Контактні дані:</label>
                        {counterpartyToEdit && <input type="contact" className="form-control" id="contact" name="contact"
                                              defaultValue={counterpartyToEdit.contact_data}/>}
                        {!counterpartyToEdit && <input type="contact" className="form-control" id="contact" name="contact"
                                               placeholder="Введіть контактні дані:"/>}

                        <label htmlFor="type" className="form-label mb-0 mt-2">Тип:</label>
                        <select className="form-select" id="type">
                            {types && types.map(type => {
                                if (counterpartyToEdit && counterpartyToEdit.type.id == type.id) {
                                    return <option selected value={type.id}>{type.name}</option>
                                }
                                return <option value={type.id}>{type.name}</option>
                            })}
                        </select>

                        <button type="submit" className="btn bg-success mt-2">Зберегти</button>
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
