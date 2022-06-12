import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import './OrderDocumentsComponent.css';
import addIcon from "../../icons/add.png";
import closeIcon from "../../icons/close.png";
import {ordersServices} from "../../services";
import {ShortOrderDocumentItem} from "./ShortOrderDocumentItem";
import {AccessModalWindowComponent} from "../access_modal_window/AccessModalWindowComponent";


export const OrderDocumentsComponent = () => {
    const navigate = useNavigate();
    const [orderDocuments, setOrderDocuments] = useState(null);
    const authCounterparty = JSON.parse(window.sessionStorage.getItem('authCounterparty'));
    const [accessVisible, setAccessVisible] = useState(false)
    const [accessMessage, setAccessMessage] = useState('')

    const onTabClose = () => {
        navigate('/nav');
    }

    const onDocumentAdd = () => {
        navigate('/orders/create');
    }

    const sortOrderDocumentsByDate = (data) => {
        data.sort((a, b) => {
            return new Date(a.confirmation_timestamp) - new Date(b.confirmation_timestamp);
        });
    }

    const onStatusChange = async (document) => {
        const index = orderDocuments.indexOf(document)
        if (orderDocuments[index].confirmation_status) {
            setAccessMessage('Документ Замовлення ТМЦ не можна знімати з проведення')
            setAccessVisible(true);
        } else if (document.provider.id === authCounterparty.id) {
            const data = {
                confirmation_status: true
            }
            const result = await ordersServices.updateDocument(document.id, data)
            if (result.status === 200) {
                fetchOrderDocuments()
            }
        } else {
            setAccessMessage('Ви не змінювати статут проведення цього документу')
            setAccessVisible(true);
        }
    }

    const onAccessWindowClose = () => {
        setAccessVisible(false)
    }

    const fetchOrderDocuments = async () => {
        let orderDocumentsData = await ordersServices.getAllDocuments();
        console.log(orderDocumentsData.json)
        setOrderDocuments(orderDocumentsData.json);
    }


    const onDocumentSelect = (document) => {
        navigate(`/orders/${document.id}`);
    }

    const onDocumentDelete = async (document) => {
        if (document.creator.id === authCounterparty.id) {
            fetchOrderDocuments()
        } else {
            setAccessMessage('Ви не можете видаляти не свій документ')
            setAccessVisible(true);
        }
    }


    useEffect(() => {
        fetchOrderDocuments()
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
                    <th className="col-md-2" scope="col">Замовник</th>
                    <th className="col-md-2" scope="col">Постачальник</th>
                    <th className="col-md-2" scope="col">На склад</th>
                    <th className="col-md-6" scope="col">Коментар</th>
                    <th className="col-md-auto" scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {orderDocuments && orderDocuments.map(document =>
                    <ShortOrderDocumentItem document={document} key={document.id} onStatusChange={onStatusChange}
                                                  onDocumentSelect={onDocumentSelect}
                                                  onDocumentDelete={onDocumentDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
