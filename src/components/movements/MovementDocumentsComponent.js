import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import './MovementDocumentsComponent.css';
import addIcon from "../../icons/add.png";
import closeIcon from "../../icons/close.png";
import {movementsServices} from "../../services";
import {ShortMovementDocumentItem} from "./ShortMovementDocumentItem";
import {AccessModalWindowComponent} from "../access_modal_window/AccessModalWindowComponent";


export const MovementDocumentsComponent = () => {
    const navigate = useNavigate();
    const [movementDocuments, setMovementDocuments] = useState(null);
    const authCounterparty = JSON.parse(window.sessionStorage.getItem('authCounterparty'));
    const [accessVisible, setAccessVisible] = useState(false)
    const [accessMessage, setAccessMessage] = useState('')

    const onTabClose = () => {
        navigate('/nav');
    }

    const onDocumentAdd = () => {
        navigate('/movements/create');
    }

    const sortMovementDocumentsByDate = (data) => {
        data.sort((a, b) => {
            return new Date(a.confirmation_timestamp) - new Date(b.confirmation_timestamp);
        });
    }

    const onStatusChange = async (document) => {
        if (document.to_warehouse.foreman !== authCounterparty.id) {
            setAccessMessage('Змінювати статут проведення документу Переміщення ТМЦ може тільки отримувач')
            setAccessVisible(true);
            return
        }
        if (document.creator.id != authCounterparty.id && document.to_warehouse.foreman === authCounterparty.id) {
            const index = movementDocuments.indexOf(document)
            const data = {
                confirmation_status: !movementDocuments[index].confirmation_status
            }
            const result = await movementsServices.updateDocumentStatus(document.id, data)
            if (result.status == 200) {
                fetchMovementsDocument()
            }
        } else {
            setAccessMessage('Ви не можете змінювати статут проведення не свого документу')
            setAccessVisible(true);
        }
    }

    const onAccessWindowClose = () => {
        setAccessVisible(false)
    }

    const fetchMovementsDocument = async () => {
        let movementsDocumentsData = await movementsServices.getAllDocuments();
        sortMovementDocumentsByDate(movementsDocumentsData);
        setMovementDocuments(movementsDocumentsData);
    }


    const onDocumentSelect = (document) => {
        navigate(`/movements/${document.id}`);
    }

    const onDocumentDelete = async (document) => {
        if (document.confirmation_status) {
            setAccessMessage('Ви не можете видаляти проведений документ')
            setAccessVisible(true);
            return
        }
        if (document.creator.id === authCounterparty.id) {
            await movementsServices.deleteDocument(document.id)
            fetchMovementsDocument()
        } else {
            setAccessMessage('Ви не можете видаляти не свій документ')
            setAccessVisible(true);
        }
    }


    useEffect(() => {
        fetchMovementsDocument()
    }, [])

    return (

        <div className="position-relative">
            <AccessModalWindowComponent visible={accessVisible} message={accessMessage} onClose={onAccessWindowClose}/>
            <div className="p-1 d-flex justify-content-between menu">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={onDocumentAdd} title="Додати">
                        <img src={addIcon}/>
                    </button>
                </div>
                <button className="btn p-0 me-2 bc_none bt-menu" onClick={onTabClose} title="Закрити вікно">
                    <img src={closeIcon}/>
                </button>
            </div>
            <table className="table table-bordered t-36">
                <thead>
                <tr>
                    <th className="col-md-auto" scope="col"></th>
                    <th className="col-md-1" scope="col">Дата</th>
                    <th className="col-md-1" scope="col">Номер</th>
                    <th className="col-md-2" scope="col">Контрагент</th>
                    <th className="col-md-2" scope="col">Зі складу</th>
                    <th className="col-md-2" scope="col">На склад</th>
                    <th className="col-md-8" scope="col">Опис</th>
                    <th className="col-md-auto" scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {movementDocuments && movementDocuments.map(document =>
                    <ShortMovementDocumentItem document={document} key={document.id} onStatusChange={onStatusChange}
                                                  onDocumentSelect={onDocumentSelect}
                                                  onDocumentDelete={onDocumentDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
