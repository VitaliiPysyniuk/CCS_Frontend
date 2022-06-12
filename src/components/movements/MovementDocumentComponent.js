import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import addIcon from "../../icons/add.png";
import closeIcon from "../../icons/close.png";

import {MovementDocumentItemComponent} from './MovementDocumentItemComponent';
import {TMVsChoiceComponent} from '../tmvs/tmv-choice/TMVsChoiceComponent';
import {WarehousesChoiceComponent} from '../warehouses/warehouse-choice/WarehousesChoiceComponent';
import {tmvServices, warehouseServices, movementsServices} from "../../services";
import {CloseModalWindowComponent} from "../close_modal_window/CloseModalWindowComponent";
import './MovementDocumentsComponent.css';
import {AccessModalWindowComponent} from '../access_modal_window/AccessModalWindowComponent';

let tmvs = null;
let warehouses = null;
let warehouseTmvs = null;
let itemToEdit = null;
let onWarehouseClicks = 0;
let onTMVClicks = 0;
let documentChanged = false;
let currentWarehouseType = null;

export const MovementDocumentComponent = () => {
    const [document, setDocument] = useState(null)
    const [newDocument, setNewDocument] = useState({})
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
    const fromWarehouseRef = useRef(null);
    const toWarehouseRef = useRef(null);



    const addNewItem = () => {
        if (checkAccessToChange()) {
            return
        }
        const newItem = {
            tmv: {
                id: null,
                name: '',
                unit: {
                    name: '',
                }
            },
            number: '',
            cost_per_unit: '',
            warehouse: document != null ? document.to_warehouse : newDocument.to_warehouse,
            date: '',
            comment: '',
            status: 'added'
        }
        const array = documentItems.concat(newItem)
        setDocumentItems(array)
        documentChanged = true
    }

    const findRelatedItemIndex = (item) => {
        if(item.status === "added") {
            return 0
        }
        const relatedItem = documentItems
            .filter(i => {
                return item.tmv.id === i.tmv.id && i.warehouse.id === document.from_warehouse.id
            })[0]
        return documentItems.indexOf(relatedItem)
    }

    const getCostPerUnitOfTMV = (tmv) => {
        console.log(tmv.id)
        console.log(warehouseTmvs)
        const result = warehouseTmvs.filter(warehouseTmv => warehouseTmv.tmv.id == tmv.id)
        console.log(result)
        if (result.length === 0) {
            setAccessMessage('Такого ТМЦ немає в залишку')
            setAccessVisible(true);
            return null
        }
        return result[0].cost_per_unit
    }

    const checkNumberOfTMV = (tmv, number) => {
        const result = warehouseTmvs.filter(warehouseTmv => warehouseTmv.tmv.id === tmv.id)[0]
        if (result.total_number < number) {
            setAccessMessage('Введене значення перевищує залишок ТМЦ')
            setAccessVisible(true);
            return null
        }
        return result.total_number
    }

    const onTabClose = () => {
        if (!documentChanged) {
            navigate('/movements');
            documentChanged = false;
        } else {
            setSaveChangesVisible(true)
        }
    }

    const onReject = () => {
        setSaveChangesVisible(false);
        navigate('/movements');
        documentChanged = false;
    }

    const onAccept = async () => {
        if (id != null) {
            const result = await movementsServices.updateDocumentItems(document, documentItems)
            if (result.status == 200) {
                setSaveChangesVisible(false);
                navigate('/movements');
                documentChanged = false;
            }
        } else {
            const documentData = {
                creator: authCounterparty.id,
                confirmation_timestamp: dateInput.current.value,
                from_warehouse: newDocument.from_warehouse.id,
                to_warehouse: newDocument.to_warehouse.id,
                comment: descInput.current.value
            }
            const result = await movementsServices.createNewMovement(documentData, documentItems)
            if (result.status == 200) {
                setSaveChangesVisible(false);
                navigate('/movements');
                documentChanged = false;
            } else {
                console.log(result.msg)
            }
        }
        setSaveChangesVisible(false);
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
        const relatedItemIndex = findRelatedItemIndex(documentItems[index])
        if (documentItems[index].status === 'nothing') {
            documentItems[index].status = 'deleted'
            documentItems[relatedItemIndex].status = 'deleted'
            documentChanged = true
        } else if (documentItems[index].status === 'added') {
            documentItems.splice(documentItems[index].status, 1);
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

    const onCommentChange = (event, item) => {
        const index = documentItems.indexOf(item)
        const relatedItemIndex = findRelatedItemIndex(documentItems[index])
        if (checkAccessToChange()) {
            event.target.value = documentItems[index].comment
            return
        }
        documentItems[index].comment = event.target.value
        if (item.status !== "added") {
            documentItems[relatedItemIndex].comment = event.target.value
        }
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
            documentItems[relatedItemIndex].status = 'updated'
        }
        documentChanged = true;
        setDocumentItems([...documentItems])
    }

    const onNumberChange = (event, item) => {
        const index = documentItems.indexOf(item)
        const relatedItemIndex = findRelatedItemIndex(documentItems[index])
        const total_number = checkNumberOfTMV(item.tmv, event.target.value)
        if (total_number === null) {
            event.target.value = documentItems[index].number
            return
        }
        if (checkAccessToChange()) {
            event.target.value = documentItems[index].number
            return
        }
        documentItems[index].number = parseFloat(event.target.value)

        if (item.status !== "added") {
            documentItems[relatedItemIndex].number = parseFloat(`-${event.target.value}`)
        }
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
            documentItems[relatedItemIndex].status = 'updated'
        }
        documentChanged = true;
        setDocumentItems([...documentItems])
    }

    const onDateChange = (event, item) => {
        const index = documentItems.indexOf(item)
        const relatedItemIndex = findRelatedItemIndex(documentItems[index])
        if (checkAccessToChange()) {
            event.target.value = documentItems[index].date
            return
        }
        documentItems[index].date = event.target.value
        if (item.status !== "added") {
            documentItems[relatedItemIndex].date = event.target.value
        }
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
            documentItems[relatedItemIndex].status = 'updated'
        }
        documentChanged = true;
        setDocumentItems([...documentItems])
    }

    const makeChoiceOfTMV = (item) => {
        if (checkAccessToChange()) {
            return
        }
        onTMVClicks = 0;
        itemToEdit = item;
        setSelectTMVVisible(true);
    }

    const selectTMV = (tmv) => {
        onTMVClicks += 1;
        if (onTMVClicks === 2) {
            const index = documentItems.indexOf(itemToEdit)
            const relatedItemIndex = findRelatedItemIndex(documentItems[index])
            const cost_per_unit = getCostPerUnitOfTMV(tmv)
            if (cost_per_unit === null) {
                onTMVClicks = 0;
                closeTMVSelect()
                return
            }
            documentItems[index].tmv.id = tmv.id;
            documentItems[index].tmv.name = tmv.name;
            documentItems[index].tmv.unit.name = tmv.unit.name;
            documentItems[index].cost_per_unit = cost_per_unit;

            if (itemToEdit.status !== "added") {
                documentItems[relatedItemIndex].tmv.id = tmv.id;
                documentItems[relatedItemIndex].tmv.name = tmv.name;
                documentItems[relatedItemIndex].tmv.unit.name = tmv.unit.name;
                documentItems[index].cost_per_unit = cost_per_unit;
            }

            if (documentItems[index].hasOwnProperty('id')) {
                documentItems[index].status = 'updated'
                documentItems[relatedItemIndex].status = 'updated'
            }
            onTMVClicks = 0;
            documentChanged = true;
            setDocumentItems([...documentItems]);
            closeTMVSelect()
        }
    }


    const generateItemKey = (item) => {
        const key = `${item.tmv.name}--${item.warehouse.id}--${item.status}`
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


    const makeChoiceOfWarehouse = (warehouseType) => {
        if (checkAccessToChange()) {
            return
        }
        currentWarehouseType = warehouseType;
        onWarehouseClicks = 0;
        setSelectWarehouseVisible(true);
    }


    const selectWarehouse = async (warehouse) => {
        onWarehouseClicks += 1;
        if (onWarehouseClicks === 2) {
            if (currentWarehouseType === 'from') {
                let warehouseTmvsData = await warehouseServices.getWarehouseTMVs(warehouse.id);
                warehouseTmvs = warehouseTmvsData.json.tmvs;
                console.log(warehouseTmvs)
                newDocument.from_warehouse = {
                    id: warehouse.id,
                    name: warehouse.name
                }
                fromWarehouseRef.current.value = warehouse.name
            } else if (currentWarehouseType === 'to') {
                newDocument.to_warehouse = {
                    id: warehouse.id,
                    name: warehouse.name
                }
                toWarehouseRef.current.value = warehouse.name
            }
            setNewDocument(newDocument);
            onWarehouseClicks = 0;
            closeWarehouseSelect();
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

    const fetchMovementDocument = async () => {
        const response = await movementsServices.getDocumentById(id);
        setDocument(response.json);
        setDocumentItems(addStatusProperty(response.json.movement_document_items));
        let warehouseTmvsData = await warehouseServices.getWarehouseTMVs(response.json.from_warehouse.id);
        warehouseTmvs = warehouseTmvsData.json.tmvs;
    }

    const onDateFieldChange = (event) => {
        const value = event.target.value
        if (value.length == 4) {
            event.target.value = `${value}-`
        } else if (value.length == 7) {
            event.target.value = `${value}-`
        }
    }

    useEffect(() => {
        if (id != null && documentItems.length == 0) {
            fetchMovementDocument()
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
            <div className="p-1 d-flex justify-content-between menu-new">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={addNewItem} title="Додати">
                        <img src={addIcon}/>
                    </button>

                    <p className="mb-0 ms-5">
                        <b>Автор: {document != null ? document.creator.name : authCounterparty.name}</b>
                    </p>

                    <p className="mb-0 ms-5"><b>Дата документу:</b></p>

                    <input type="text" className="p-0 ms-1 date-wt input-border" id="document-date" ref={dateInput}
                           onChange={onDateFieldChange} onSelect={checkAccessToChange}
                           defaultValue={document != null ? document.confirmation_timestamp.split('T')[0] : ''}/>

                    <p className="mb-0 ms-5"><b>Коментар:</b></p>
                    <input type="text" className="p-0 ms-1 input-border" ref={descInput} onSelect={checkAccessToChange}
                           defaultValue={document != null ? document.comment : ''}/>
                </div>

                <div className="d-flex flex-column">
                    <div className="d-flex flex-row justify-content-end">
                        <p className="m-0"><b>Зі складу:</b></p>
                        <input type="text" className="p-0 ms-1 input-border" onSelect={() => makeChoiceOfWarehouse('from')}
                               defaultValue={document != null ? document.from_warehouse.name : ''} ref={fromWarehouseRef}/>
                    </div>
                    <div className="d-flex flex-row mt-1 justify-content-end">
                        <p className="mb-0"><b>На склад:</b></p>
                        <input type="text" className="p-0 ms-1 input-border" onSelect={() => makeChoiceOfWarehouse('to')}
                               defaultValue={document != null ? document.to_warehouse.name : ''} ref={toWarehouseRef}/>
                    </div>
                </div>

                <button className="btn p-0 me-2 bc_none bt-menu" onClick={onTabClose} title="Закрити вікно">
                    <img src={closeIcon}/>
                </button>
            </div>
            <table className="table table-bordered t-66">
                <thead>
                <tr>
                    <th className="col-md-auto" scope="col">№</th>
                    <th className="col-md-4" scope="col">ТМЦ</th>
                    <th className="col-md-auto" scope="col">О-ця</th>
                    <th className="col-md-auto" scope="col">К-сть</th>
                    <th className="col-md-auto" scope="col">Вартість</th>
                    <th className="col-md-1" scope="col">Дата</th>
                    <th className="col-md-4" scope="col">Коментар</th>
                </tr>
                </thead>
                <tbody>
                {documentItems.length > 0 && documentItems.map(item => {
                    if (item.status !== "deleted" &&
                        item.warehouse.id !==
                        (document != null ? document.from_warehouse.id : newDocument.from_warehouse.id)) {
                        return <MovementDocumentItemComponent
                            item={item} key={generateItemKey(item)} onItemDelete={onItemDelete}
                            number={documentItems.indexOf(item) + 1} onTMVInput={makeChoiceOfTMV}
                            onNumberChange={onNumberChange} onDateChange={onDateChange}
                            onCommentChange={onCommentChange}/>
                    }
                })}
                </tbody>
            </table>
        </div>
    )
}
