import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import './ProcurementDocumentsComponent.css';
import addIcon from "../../icons/add.png";
import closeIcon from "../../icons/close.png";
import {procurementsServices} from "../../services";
import {ShortProcurementDocumentItem} from "./ShortProcurementDocumentItem";
import {AccessModalWindowComponent} from "../access_modal_window/AccessModalWindowComponent";


export const ProcurementDocumentsComponent = () => {
    const navigate = useNavigate();
    const [procurementDocuments, setProcurementDocuments] = useState(null);
    const authCounterparty = JSON.parse(window.sessionStorage.getItem('authCounterparty'));
    const [accessVisible, setAccessVisible] = useState(false)
    const [accessMessage, setAccessMessage] = useState('')

    const onTabClose = () => {
        navigate('/nav');
    }

    const onDocumentAdd = () => {
        navigate('/procurements/create');
    }

    const sortProcurementDocumentsByDate = (data) => {
        data.sort((a, b) => {
            return new Date(a.confirmation_timestamp) - new Date(b.confirmation_timestamp);
        });
    }

    const calculateTotalOfDocuments = (documents) => {
        for (let document of documents) {
            let total = 0
            for (let item of document.procurement_document_items) {
                total += (parseFloat(item.number) * parseFloat(item.cost_per_unit))
            }
            document.total = total;
        }
        return documents
    }

    const onStatusChange = async (document) => {
        if (document.creator.id == authCounterparty.id) {
            const index = procurementDocuments.indexOf(document)
            const data = {
                confirmation_status: !procurementDocuments[index].confirmation_status
            }
            const result = await procurementsServices.updateDocumentStatus(document.id, data)
            if (result.status == 200) {
                fetchProcurementDocument()
            }
        } else {
            setAccessMessage('Ви не змінювати статут проведення не свого документу')
            setAccessVisible(true);
        }
    }

    const onAccessWindowClose = () => {
        setAccessVisible(false)
    }

    const fetchProcurementDocument = async () => {
        let procurementDocumentsData = await procurementsServices.getAllDocuments();
        sortProcurementDocumentsByDate(procurementDocumentsData);
        procurementDocumentsData = calculateTotalOfDocuments(procurementDocumentsData);
        setProcurementDocuments(procurementDocumentsData);
    }


    const onDocumentSelect = (document) => {
        navigate(`/procurements/${document.id}`);
    }

    const onDocumentDelete = async (document) => {
        if (document.creator.id === authCounterparty.id) {
            await procurementsServices.deleteDocument(document.id)
            fetchProcurementDocument()
        } else {
            setAccessMessage('Ви не можете видаляти не свій документ')
            setAccessVisible(true);
        }
    }


    useEffect(() => {
        fetchProcurementDocument()
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
                    <th className="col-md-1" scope="col">Сума</th>
                    <th className="col-md-7" scope="col">Опис</th>
                    <th className="col-md-auto" scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {procurementDocuments && procurementDocuments.map(document =>
                    <ShortProcurementDocumentItem document={document} key={document.id} onStatusChange={onStatusChange}
                                                  onDocumentSelect={onDocumentSelect}
                                                  onDocumentDelete={onDocumentDelete}/>)}
                </tbody>
            </table>
        </div>
    )
}
