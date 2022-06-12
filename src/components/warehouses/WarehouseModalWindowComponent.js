import React, {useEffect, useState} from "react";
import './WarehouseModalWindowComponent.css';
import closeIcon from "../../icons/close.png";
import {counterpartyServices} from "../../services";

export const WarehouseModalWindowComponent = ({visible, onSubmit, warehouseToEdit, error, onClose}) => {
    const [counterparties, setCounterparties] = useState(null);

    const fetchData = async () => {
        let counterpartiesData = await counterpartyServices.getAll();
        setCounterparties(counterpartiesData);
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
                        <label htmlFor="name" className="form-label mb-0 mt-2">Назва:</label>
                        {warehouseToEdit && <input type="name" className="form-control" id="name" name="name"
                                              defaultValue={warehouseToEdit.name}/>}
                        {!warehouseToEdit && <input type="name" className="form-control" id="name" name="name"
                                               placeholder="Введіть назву"/>}

                        <label htmlFor="owner" className="form-label mb-0 mt-2">Замовник:</label>
                        <select className="form-select" id="owner">
                            {counterparties && counterparties
                                // .filter(counterparty => [1].includes(counterparty.type))
                                .map(counterparty => {
                                if (warehouseToEdit && warehouseToEdit.owner.id == counterparty.id) {
                                    return <option selected value={counterparty.id}>{counterparty.name}</option>
                                }
                                return <option value={counterparty.id}>{counterparty.name}</option>
                            })}
                        </select>

                        <label htmlFor="foreman" className="form-label mb-0 mt-2">Виконроб:</label>
                        <select className="form-select" id="foreman">
                            {counterparties && counterparties
                                .map(counterparty => {
                                if (warehouseToEdit && warehouseToEdit.foreman.id == counterparty.id) {
                                    return <option selected value={counterparty.id}>{counterparty.name}</option>
                                }
                                return <option value={counterparty.id}>{counterparty.name}</option>
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
