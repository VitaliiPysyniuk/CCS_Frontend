import React, {useEffect, useState} from 'react';
import './WarehousesComponent.css';
import {useNavigate} from "react-router-dom";

import {WarehouseComponent} from "./WarehouseComponent";
import {WarehouseModalWindowComponent} from './WarehouseModalWindowComponent';
import {
    warehouseServices
} from '../../services';

import addIcon from "../../icons/add.png";
import searchIcon from "../../icons/search.png";
import closeIcon from "../../icons/close.png";

let tempWarehouses = null;

export const WarehousesComponent = () => {
    const [warehouses, setWarehouses] = useState(null);

    const [isModal, setModal] = useState(false);
    const [warehouseToEdit, setWarehouseToEdit] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const sortWarehousesById = (data) => {
        data.sort((a, b) => a.id > b.id ? 1 : -1);
    }

    const fetchWarehouses = async () => {
        let warehousesData = await warehouseServices.getAll();
        sortWarehousesById(warehousesData);
        setWarehouses(warehousesData);
    }

    const onWarehouseEdit = (warehouse) => {
        setWarehouseToEdit(warehouse);
        setModal(true);
    }

    const onClose = () => {
        setModal(false);
        setWarehouseToEdit(null);
        setError('');
    }

    const onWarehouseAdd = () => {
        setWarehouseToEdit(null);
        setModal(true);
    }

    const onTabClose = () => {
        setModal(false);
        setWarehouseToEdit(null);
        setError('');
        navigate('/nav');
    }

    const onWarehouseSearch = () => {
        const value = document.getElementById('search').value;
        if (value === '' && tempWarehouses !== null) {
            setWarehouses(tempWarehouses);
            tempWarehouses = null;
        } else {
            tempWarehouses = warehouses;
            const result = warehouses.filter(warehouse => warehouse.name.startsWith(value));
            setWarehouses(result);
        }
    }

    const onWarehouseSave = async (event) => {
        event.preventDefault();
        let response = null;
        const warehouseData = {
            name: event.target.elements.name.value,
            owner: event.target.elements.owner.value,
            foreman: event.target.elements.foreman.value
        }
        if (!warehouseToEdit) {
            response = await warehouseServices.add(warehouseData);
        } else {
            warehouseData['id'] = warehouseToEdit.id;
            response = await warehouseServices.edit(warehouseData);
        }

        if (response.status === 400) {
            setError('Одиниця виміру з таким іменем вже існує')
        } else if (response.status.toString().startsWith('5')) {
            setError('Cерверна помилка')
        } else if (response.status === 200 || response.status === 201) {
            setWarehouseToEdit(null);
            setError('');
            setModal(false);
            fetchWarehouses();
        }
    }

    const onWarehouseDelete = async (warehouse) => {
        await warehouseServices.delete(warehouse);
        fetchWarehouses();
    }

    useEffect(() => {
        fetchWarehouses()
    }, [])

    return (
        <div className="position-relative">
            <WarehouseModalWindowComponent visible={isModal} onSubmit={onWarehouseSave} error={error}
                                           warehouseToEdit={warehouseToEdit} onClose={onClose}/>
            <div className="p-1 d-flex justify-content-between menu">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={onWarehouseAdd} title="Додати">
                        <img src={addIcon}/>
                    </button>
                    <div className="input-group ms-3 border border-dark rounded-2">
                        <input type="text" className="form-control p-0" id="search"/>
                        <button className="btn p-0 m-0 bc_none bt-menu" onClick={onWarehouseSearch} title="Знайти">
                            <img src={searchIcon}/>
                        </button>
                    </div>
                </div>
                <button className="btn p-0 me-2 bc_none bt-menu" onClick={onTabClose} title="Закрити вікно">
                    <img src={closeIcon}/>
                </button>
            </div>
            <table className="table table-bordered t-36">
                <thead>
                <tr>
                    <th scope="col">Код</th>
                    <th scope="col">Назва</th>
                    <th className="col-md-2" scope="col">Власник</th>
                    <th className="col-md-3" scope="col">Виконроб</th>
                </tr>
                </thead>
                <tbody>
                {warehouses && warehouses.map(warehouse => <WarehouseComponent warehouse={warehouse} key={warehouse.id}
                                                                               onWarehouseEdit={onWarehouseEdit}
                                                                               onWarehouseDelete={onWarehouseDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
