import React, {useEffect, useState} from 'react';
import './CounterpartiesComponent.css';
import {useNavigate} from "react-router-dom";

import {CounterpartyComponent} from "./CounterpartyComponent";
import {CounterpartyModalWindowComponent} from './CounterpartyModalWindowComponent';
import {
    counterpartyServices
} from '../../services';

import addIcon from "../../icons/add.png";
import searchIcon from "../../icons/search.png";
import closeIcon from "../../icons/close.png";

let tempCounterparties = null;

export const CounterpartiesComponent = () => {
    const [counterparties, setCounterparties] = useState(null);

    const [isModal, setModal] = useState(false);
    const [counterpartyToEdit, setCounterpartyToEdit] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const sortCounterpartiesById = (data) => {
        data.sort((a, b) => a.id > b.id ? 1 : -1);
    }

    const fetchCounterparties = async () => {
        let counterpartiesData = await counterpartyServices.getAll();
        sortCounterpartiesById(counterpartiesData);
        setCounterparties(counterpartiesData);
    }

    const onCounterpartyEdit = (counterparty) => {
        setCounterpartyToEdit(counterparty);
        setModal(true);
    }

    const onClose = () => {
        setModal(false);
        setCounterpartyToEdit(null);
        setError('');
    }

    const onCounterpartyAdd = () => {
        setCounterpartyToEdit(null);
        setModal(true);
    }

    const onTabClose = () => {
        setModal(false);
        setCounterpartyToEdit(null);
        setError('');
        navigate('/nav');
    }

    const onCounterpartySearch = () => {
        const value = document.getElementById('search').value;
        if (value === '' && tempCounterparties !==null) {
            setCounterparties(tempCounterparties);
            tempCounterparties = null;
        } else {
            tempCounterparties = counterparties;
            const result = counterparties.filter(counterparty => counterparty.name.startsWith(value));
            setCounterparties(result);
        }
    }

    const onCounterpartySave = async (event) => {
        event.preventDefault();
        let response = null;
        const counterpartyData = {
            name: event.target.elements.name.value,
            contact_data: event.target.elements.contact.value,
            type: event.target.elements.type.value
        }
        if (!counterpartyToEdit) {
            response = await counterpartyServices.add(counterpartyData);
        } else {
            counterpartyData['id'] = counterpartyToEdit.id;
            response = await counterpartyServices.edit(counterpartyData);
        }

        if (response.status === 400) {
            setError('Одиниця виміру з таким іменем вже існує')
        } else if (response.status.toString().startsWith('5')) {
            setError('Cерверна помилка')
        } else if (response.status === 200 || response.status === 201) {
            setCounterpartyToEdit(null);
            setError('');
            setModal(false);
            fetchCounterparties();
        }
    }

    const onCounterpartyDelete = async (counterparty) => {
        await counterpartyServices.delete(counterparty);
        fetchCounterparties();
    }

    useEffect(() => {
        fetchCounterparties()
    }, [])

    return (
        <div className="position-relative">
            <CounterpartyModalWindowComponent visible={isModal} onSubmit={onCounterpartySave} counterpartyToEdit={counterpartyToEdit} error={error}
                                              onClose={onClose}/>
            <div className="p-1 d-flex justify-content-between menu">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={onCounterpartyAdd} title="Додати">
                        <img src={addIcon}/>
                    </button>
                    <div className="input-group ms-3 border border-dark rounded-2">
                        <input type="text" className="form-control p-0" id="search"/>
                        <button className="btn p-0 m-0 bc_none bt-menu" onClick={onCounterpartySearch} title="Знайти">
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
                    <th className="col-md-2" scope="col">Тип</th>
                    <th className="col-md-4" scope="col">Контактні дані</th>
                </tr>
                </thead>
                <tbody>
                {counterparties && counterparties.map(counterparty =>
                    <CounterpartyComponent counterparty={counterparty} key={counterparty.id}
                                           onCounterpartyEdit={onCounterpartyEdit}
                                           onCounterpartyDelete={onCounterpartyDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
