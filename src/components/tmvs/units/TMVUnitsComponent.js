import React, {useEffect, useState} from 'react';
import './TMVUnitsComponent.css';
import {useNavigate} from "react-router-dom";

import {TMVUnitComponent} from "./TMVUnitComponent";
import {UnitModalWindowComponent} from './UnitModalWindowComponent';
import {
    tmvServices
} from '../../../services';

import addIcon from "../../../icons/add.png";
import searchIcon from "../../../icons/search.png";
import closeIcon from "../../../icons/close.png";

let tempUnits = null;

export const TMVUnitsComponent = () => {
    const [units, setUnits] = useState(null);

    const [isModal, setModal] = useState(false);
    const [unitToEdit, setUnitToEdit] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const sortUnitsById = (data) => {
        data.sort((a, b) => a.id > b.id ? 1 : -1);
    }

    const fetchUnits = async () => {
        let unitsData = await tmvServices.getAll('/units');
        sortUnitsById(unitsData);
        setUnits(unitsData);
    }

    const onUnitEdit = (unit) => {
        setUnitToEdit(unit);
        setModal(true);
    }

    const onClose = () => {
        setModal(false);
        setUnitToEdit(null);
        setError('');
    }

    const onUnitAdd = () => {
        setUnitToEdit(null);
        setModal(true);
    }

    const onTabClose = () => {
        setModal(false);
        setUnitToEdit(null);
        setError('');
        navigate('/nav');
    }

    const onUnitSearch = () => {
        const value = document.getElementById('search').value;
        if (value === '' && tempUnits !==null) {
            setUnits(tempUnits);
            tempUnits = null;
        } else {
            tempUnits = units;
            const result = units.filter(unit => unit.name.startsWith(value));
            setUnits(result);
        }
    }

    const onUnitSave = async (event) => {
        event.preventDefault();
        let response = null;
        const unitData = {
            name: event.target.elements.name.value
        }
        if (!unitToEdit) {
            response = await tmvServices.add(unitData, '/units');
        } else {
            unitData['id'] = unitToEdit.id;
            response = await tmvServices.edit(unitData, '/units');
        }

        if (response.status === 400) {
            setError('Одиниця виміру з таким іменем вже існує')
        } else if (response.status.toString().startsWith('5')) {
            setError('Cерверна помилка')
        } else if (response.status === 200 || response.status === 201) {
            setUnitToEdit(null);
            setError('');
            setModal(false);
            fetchUnits();
        }
    }

    const onUnitDelete = async (unit) => {
        await tmvServices.delete(unit, '/units');
        fetchUnits();
    }

    useEffect(() => {
        fetchUnits()
    }, [])

    return (
        <div className="position-relative">
            <UnitModalWindowComponent visible={isModal} onSubmit={onUnitSave} unitToEdit={unitToEdit} error={error}
                                      onClose={onClose}/>
            <div className="p-1 d-flex justify-content-between menu">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={onUnitAdd} title="Додати">
                        <img src={addIcon}/>
                    </button>
                    <div className="input-group ms-3 border border-dark rounded-2">
                        <input type="text" className="form-control p-0" id="search"/>
                        <button className="btn p-0 m-0 bc_none bt-menu" onClick={onUnitSearch} title="Знайти">
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
                    <th className="col-md-1" scope="col">Код</th>
                    <th scope="col">Назва</th>
                </tr>
                </thead>
                <tbody>
                {units && units.map(unit => <TMVUnitComponent unit={unit} key={unit.id} onUnitEdit={onUnitEdit}
                                                              onUnitDelete={onUnitDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
