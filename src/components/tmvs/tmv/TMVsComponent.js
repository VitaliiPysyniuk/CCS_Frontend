import React, {useEffect, useState} from 'react';
import './TMVsComponent.css';
import {useNavigate} from "react-router-dom";

import {TMVComponent} from "./TMVComponent";
import {TMVModalWindowComponent} from './TMVModalWindowComponent';
import {
    tmvServices
} from '../../../services';

import addIcon from "../../../icons/add.png";
import searchIcon from "../../../icons/search.png";
import closeIcon from "../../../icons/close.png";

let tempTMV = null;

export const TMVsComponent = () => {
    const [tmvs, setTMV] = useState(null);

    const [isModal, setModal] = useState(false);
    const [TMVToEdit, setTMVToEdit] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const sortTMVById = (data) => {
        data.sort((a, b) => a.id > b.id ? 1 : -1);
    }

    const fetchTMV = async () => {
        let tmvsData = await tmvServices.getAll();
        sortTMVById(tmvsData);
        setTMV(tmvsData);
    }

    const onTMVEdit = (type) => {
        setTMVToEdit(type);
        setModal(true);
    }

    const onClose = () => {
        setModal(false);
        setTMVToEdit(null);
        setError('');
    }

    const onTMVAdd = () => {
        setTMVToEdit(null);
        setModal(true);
    }

    const onTabClose = () => {
        setModal(false);
        setTMVToEdit(null);
        setError('');
        navigate('/nav');
    }

    const onTMVSearch = () => {
        const value = document.getElementById('search').value;
        if (value === '' && tempTMV !==null) {
            setTMV(tempTMV);
            tempTMV = null;
        } else {
            tempTMV = tmvs;
            const result = tmvs.filter(type => type.name.startsWith(value));
            setTMV(result);
        }
    }

    const onTMVSave = async (event) => {
        event.preventDefault();
        let response = null;
        const tmvData = {
            name: event.target.elements.name.value,
            unit: parseInt(event.target.elements.unit.value),
            type: parseInt(event.target.elements.type.value)
        }
        if (!TMVToEdit) {
            response = await tmvServices.add(tmvData);
        } else {
            tmvData['id'] = TMVToEdit.id;
            response = await tmvServices.edit(tmvData);
        }

        if (response.status === 400) {
            setError('ТМЦ з таким іменем вже існує')
        } else if (response.status.toString().startsWith('5')) {
            setError('Cерверна помилка')
        } else if (response.status === 200 || response.status === 201) {
            setTMVToEdit(null);
            setError('');
            setModal(false);
            fetchTMV();
        }
    }

    const onTMVDelete = async (type) => {
        await tmvServices.delete(type);
        fetchTMV();
    }

    useEffect(() => {
        fetchTMV()
    }, [])

    return (
        <div className="position-relative">
            <TMVModalWindowComponent visible={isModal} onSubmit={onTMVSave} TMVToEdit={TMVToEdit} error={error}
                                     onClose={onClose}/>
            <div className="p-1 d-flex justify-content-between menu">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={onTMVAdd} title="Додати">
                        <img src={addIcon}/>
                    </button>
                    <div className="input-group ms-3 border border-dark rounded-2">
                        <input type="text" className="form-control p-0" id="search"/>
                        <button className="btn p-0 m-0 bc_none bt-menu" onClick={onTMVSearch} title="Знайти">
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
                    <th className="col-md-1" scope="col">Одиниця</th>
                    <th className="col-md-4" scope="col">Тип</th>
                </tr>
                </thead>
                <tbody>
                {tmvs && tmvs.map(tmv => <TMVComponent tmv={tmv} key={tmv.id} onTMVEdit={onTMVEdit}
                                                          onTMVDelete={onTMVDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
