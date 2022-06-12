import React, {useEffect, useState} from 'react';
import './TMVTypesComponent.css';
import {useNavigate} from "react-router-dom";

import {TMVTypeComponent} from "./TMVTypeComponent";
import {TypeModalWindowComponent} from './TypeModalWindowComponent';
import {
    tmvServices
} from '../../../services';

import addIcon from "../../../icons/add.png";
import searchIcon from "../../../icons/search.png";
import closeIcon from "../../../icons/close.png";

let tempTypes = null;

export const TMVTypesComponent = () => {
    const [types, setTypes] = useState(null);
    const [isModal, setModal] = useState(false);
    const [typeToEdit, setTypeToEdit] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const sortTypesById = (data) => {
        data.sort((a, b) => a.id > b.id ? 1 : -1);
    }

    const fetchTypes = async () => {
        let typesData = await tmvServices.getAll('/types');
        sortTypesById(typesData);
        setTypes(typesData);
    }

    const onTypeEdit = (type) => {
        setTypeToEdit(type);
        setModal(true);
    }

    const onClose = () => {
        setModal(false);
        setTypeToEdit(null);
        setError('');
    }

    const onTypeAdd = () => {
        setTypeToEdit(null);
        setModal(true);
    }

    const onTabClose = () => {
        setModal(false);
        setTypeToEdit(null);
        setError('');
        navigate('/nav');
    }

    const onTypeSearch = () => {
        const value = document.getElementById('search').value;
        if (value === '' && tempTypes !==null) {
            setTypes(tempTypes);
            tempTypes = null;
        } else {
            tempTypes = types;
            const result = types.filter(type => type.name.startsWith(value));
            setTypes(result);
        }
    }

    const onTypeSave = async (event) => {
        event.preventDefault();
        let response = null;
        const typeData = {
            name: event.target.elements.name.value
        }
        if (!typeToEdit) {
            response = await tmvServices.add(typeData, '/types');
        } else {
            typeData['id'] = typeToEdit.id;
            response = await tmvServices.edit(typeData, '/types');
        }

        if (response.status === 400) {
            setError('Тип ТМЦ з таким іменем вже існує')
        } else if (response.status.toString().startsWith('5')) {
            setError('Cерверна помилка')
        } else if (response.status === 200 || response.status === 201) {
            setTypeToEdit(null);
            setError('');
            setModal(false);
            fetchTypes();
        }
    }

    const onTypeDelete = async (type) => {
        await tmvServices.delete(type, '/types');
        fetchTypes();
    }

    useEffect(() => {
        fetchTypes()
    }, [])

    return (
        <div className="position-relative">
            <TypeModalWindowComponent visible={isModal} onSubmit={onTypeSave} typeToEdit={typeToEdit} error={error}
                                      onClose={onClose}/>
            <div className="p-1 d-flex justify-content-between menu">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={onTypeAdd} title="Додати">
                        <img src={addIcon}/>
                    </button>
                    <div className="input-group ms-3 border border-dark rounded-2">
                        <input type="text" className="form-control p-0" id="search"/>
                        <button className="btn p-0 m-0 bc_none bt-menu" onClick={onTypeSearch} title="Знайти">
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
                {types && types.map(type => <TMVTypeComponent type={type} key={type.id} onTypeEdit={onTypeEdit}
                                                              onTypeDelete={onTypeDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
