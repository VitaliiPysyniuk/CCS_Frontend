import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import addIcon from "../../icons/add.png";
import closeIcon from "../../icons/close.png";

import {ProcurementDocumentItemComponent} from './ProcurementDocumentItemComponent';
import {TMVsChoiceComponent} from '../tmvs/tmv-choice/TMVsChoiceComponent';
import {WarehousesChoiceComponent} from '../warehouses/warehouse-choice/WarehousesChoiceComponent';
import {tmvServices, warehouseServices, procurementsServices} from "../../services";
import {CloseModalWindowComponent} from "../close_modal_window/CloseModalWindowComponent";
import './ProcurementDocumentsComponent.css';
import {AccessModalWindowComponent} from '../access_modal_window/AccessModalWindowComponent';

let tmvs = null;
let warehouses = null;
let itemToEdit = null;
let onWarehouseClicks = 0;
let onTMVClicks = 0;
let documentChanged = false;

export const ProcurementDocumentComponent = () => {
    const [document, setDocument] = useState(null)
    const [documentItems, setDocumentItems] = useState([])
    const [selectTMVVisible, setSelectTMVVisible] = useState(false)
    const [selectWarehouseVisible, setSelectWarehouseVisible] = useState(false)
    const [saveChangesVisible, setSaveChangesVisible] = useState(false)
    const [accessVisible, setAccessVisible] = useState(false)
    const [accessMessage, setAccessMessage] = useState('')
    const navigate = useNavigate();
    const authCounterparty = JSON.parse(window.sessionStorage.getItem('authCounterparty'));
    const {id} = useParams();
    const dateInput = useRef(null);
    const descInput = useRef(null);


    const addNewItem = () => {
        const newItem = {
            tmv: {
                id: null,
                name: '',
                unit: {
                    name: '',
                }
            },
            warehouse: {
                id: null,
                name: ''
            },
            number: '',
            cost_per_unit: '',
            date: '',
            comment: '',
            status: 'added'
        }
        const array = documentItems.concat(newItem)
        setDocumentItems(array)
        documentChanged = true
        console.log(documentChanged);
    }


    const onTabClose = () => {
        console.log(documentChanged);
        if (!documentChanged) {
            navigate('/procurements');
            documentChanged = false;
        } else {
            setSaveChangesVisible(true)
        }
    }

    const onReject = () => {
        setSaveChangesVisible(false);
        navigate('/procurements');
        documentChanged = false;
    }

    const onAccept = async () => {
        if (id != null) {
            const result = await procurementsServices.updateDocumentItems(document.id, documentItems)
            if (result.status == 200) {
                setSaveChangesVisible(false);
                navigate('/procurements');
                documentChanged = false;
            }
        } else {
            const documentData = {
                creator: authCounterparty.id,
                confirmation_timestamp: dateInput.current.value,
                comment: descInput.current.value,
            }
            const result = await procurementsServices.createNewProcurement(documentData, documentItems)
            if (result.status == 200) {
                setSaveChangesVisible(false);
                navigate('/procurements');
                documentChanged = false;
            } else {
                console.log(result.msg)
            }
        }
    }

    const onCloseWindowClose = () => {
        setSaveChangesVisible(false);
    }

    const onAccessWindowClose = () => {
        setAccessVisible(false)
    }

    const onItemDelete = (item) => {
        if (checkAccessToChange()) {
            return
        }
        const index = documentItems.indexOf(item)
        if (documentItems[index].status === 'nothing') {
            documentItems[index].status = 'deleted'
            documentChanged = true
        } else if (documentItems[index].status === 'added') {
            documentItems.splice(index, 1);
        }
        setDocumentItems([...documentItems]);
        if (documentItems.length === 0) {
            documentChanged = false;
        }
    }

    const closeTMVSelect = () => {
        setSelectTMVVisible(false);
    }

    const closeWarehouseSelect = () => {
        setSelectWarehouseVisible(false);
    }

    const onCostChange = (event, item) => {
        const index = documentItems.indexOf(item)
        if (checkAccessToChange()) {
            event.target.value = documentItems[index].cost_per_unit
            return
        }
        documentItems[index].cost_per_unit = event.target.value
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
        }
        documentChanged = true;
    }

    const onCommentChange = (event, item) => {
        const index = documentItems.indexOf(item)
        if (checkAccessToChange()) {
            event.target.value = documentItems[index].comment
            return
        }
        documentItems[index].comment = event.target.value
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
        }
        documentChanged = true;
    }

    const onNumberChange = (event, item) => {
        const index = documentItems.indexOf(item)
        if (checkAccessToChange()) {
            event.target.value = documentItems[index].number
            return
        }
        documentItems[index].number = event.target.value
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
        }
        documentChanged = true;
    }

    const onDataChange = (event, item) => {
        const index = documentItems.indexOf(item)
        if (checkAccessToChange()) {
            event.target.value = documentItems[index].date
            return
        }
        documentItems[index].date = event.target.value
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
        }
        documentChanged = true;
    }

    const makeChoiceOfTMV = (item) => {
        if (checkAccessToChange()) {
            return
        }
        onTMVClicks = 0;
        itemToEdit = item;
        setSelectTMVVisible(true);
    }

    const makeChoiceOfWarehouse = (item) => {
        if (checkAccessToChange()) {
            return
        }
        onWarehouseClicks = 0;
        itemToEdit = item;
        setSelectWarehouseVisible(true);
    }

    const generateItemKey = (item) => {
        const key = `${item.tmv.name}--${item.warehouse.name}--${item.status}`
        return key
    }

    const checkAccessToChange = () => {
        if (document == null) {
            return false
        }
        if (document.confirmation_status) {
            setAccessMessage('Ви не можете змінювати проведений документ')
            setAccessVisible(true);
            return true
        } else if (document.creator.id !== authCounterparty.id) {
            setAccessMessage('Ви не можете змінювати не свій документ')
            setAccessVisible(true);
            return true
        }
        return false
    }

    const selectTMV = (tmv) => {
        onTMVClicks += 1;
        if (onTMVClicks === 2) {
            const index = documentItems.indexOf(itemToEdit)
            documentItems[index].tmv.id = tmv.id;
            documentItems[index].tmv.name = tmv.name;
            documentItems[index].tmv.unit.name = tmv.unit.name;
            if (documentItems[index].hasOwnProperty('id')) {
                documentItems[index].status = 'updated'
            }
            onTMVClicks = 0;
            documentChanged = true;
            setDocumentItems([...documentItems]);
            closeTMVSelect()
        }
    }


    const selectWarehouse = (warehouse) => {
        onWarehouseClicks += 1;
        if (onWarehouseClicks === 2) {
            const index = documentItems.indexOf(itemToEdit)
            documentItems[index].warehouse.id = warehouse.id;
            documentItems[index].warehouse.name = warehouse.name;
            onWarehouseClicks = 0;
            closeWarehouseSelect()
            setDocumentItems(documentItems);
        }
    }


    const fetchTMV = async () => {
        let tmvsData = await tmvServices.getAll();
        tmvs = tmvsData;
    }

    const fetchWarehouses = async () => {
        let warehousesData = await warehouseServices.getAll();
        warehouses = warehousesData;
    }

    const addStatusProperty = (items) => {
        for (let item of items) {
            item.status = 'nothing'
        }
        return items
    }

    const fetchProcurementDocument = async () => {
        const response = await procurementsServices.getDocumentById(id);
        setDocument(response.json);
        setDocumentItems(addStatusProperty(response.json.procurement_document_items));
    }

    const onDateFilesChange = (event) => {
        const value = event.target.value
        if (value.length == 4) {
            event.target.value = `${value}-`
        } else if (value.length == 7) {
            event.target.value = `${value}-`
        }
    }

    useEffect(() => {
        if (id != null && documentItems.length == 0) {
            fetchProcurementDocument()
        }
        fetchTMV();
        fetchWarehouses();
    }, [])

    return (
        <div className="position-relative">
            <TMVsChoiceComponent visible={selectTMVVisible} tmvs={tmvs} selectTMV={selectTMV}
                                 closeTMVSelect={closeTMVSelect}/>
            <WarehousesChoiceComponent visible={selectWarehouseVisible} warehouses={warehouses}
                                       selectWarehouse={selectWarehouse} closeWarehouseSelect={closeWarehouseSelect}/>
            <CloseModalWindowComponent visible={saveChangesVisible} onClose={onCloseWindowClose} onAccept={onAccept}
                                       onReject={onReject}/>
            <AccessModalWindowComponent visible={accessVisible} message={accessMessage} onClose={onAccessWindowClose}/>
            <div className="p-1 d-flex justify-content-between menu">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={addNewItem} title="Додати">
                        <img src={addIcon}/>
                    </button>

                    <p className="mb-0 ms-5">
                        <b>Автор: {document != null ? document.creator.name : authCounterparty.name}</b>
                    </p>

                    <p className="mb-0 ms-5"><b>Дата документу:</b></p>

                    <input type="text" className="p-0 ms-1 date-wt input-border" id="document-date" ref={dateInput}
                           onChange={onDateFilesChange}
                           defaultValue={document != null ? document.confirmation_timestamp.split('T')[0] : ''}/>

                    <p className="mb-0 ms-5"><b>Коментар:</b></p>
                    <input type="text" className="p-0 ms-1 input-border" ref={descInput}
                           defaultValue={document != null ? document.comment : ''}/>

                </div>
                <button className="btn p-0 me-2 bc_none bt-menu" onClick={onTabClose} title="Закрити вікно">
                    <img src={closeIcon}/>
                </button>
            </div>
            <table className="table table-bordered t-36">
                <thead>
                <tr>
                    <th className="col-md-auto" scope="col">№</th>
                    <th className="col-md-4" scope="col">ТМЦ</th>
                    <th className="col-md-auto" scope="col">О-ця</th>
                    <th className="col-md-auto" scope="col">К-сть</th>
                    <th className="col-md-auto" scope="col">Вартість</th>
                    <th className="col-md-2" scope="col">Склад</th>
                    <th className="col-md-1" scope="col">Дата</th>
                    <th className="col-md-2" scope="col">Коментар</th>
                </tr>
                </thead>
                <tbody>
                {documentItems.length > 0 && documentItems.map(item => {
                    if (item.status !== "deleted") {
                        return <ProcurementDocumentItemComponent
                            item={item} key={generateItemKey(item)} onItemDelete={onItemDelete}
                            number={documentItems.indexOf(item) + 1} onTMVInput={makeChoiceOfTMV}
                            onWarehouseInput={makeChoiceOfWarehouse} onCostChange={onCostChange}
                            onNumberChange={onNumberChange} onDataChange={onDataChange}
                            onCommentChange={onCommentChange}/>
                    }
                })}
                </tbody>
            </table>
        </div>
    )
}
