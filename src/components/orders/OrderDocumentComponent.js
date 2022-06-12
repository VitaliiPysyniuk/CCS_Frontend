import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import addIcon from "../../icons/add.png";
import closeIcon from "../../icons/close.png";

import {OrderDocumentItemComponent} from './OrderDocumentItemComponent';
import {TMVsChoiceComponent} from '../tmvs/tmv-choice/TMVsChoiceComponent';
import {WarehousesChoiceComponent} from '../warehouses/warehouse-choice/WarehousesChoiceComponent';
import {tmvServices, warehouseServices, ordersServices} from "../../services";
import {CloseModalWindowComponent} from "../close_modal_window/CloseModalWindowComponent";
import './OrderDocumentsComponent.css';
import {AccessModalWindowComponent} from '../access_modal_window/AccessModalWindowComponent';

let tmvs = null;
let warehouses = null;
let itemToEdit = null;
let onWarehouseClicks = 0;
let onTMVClicks = 0;
let documentChanged = false;

export const OrderDocumentComponent = () => {
    const [document, setDocument] = useState(null)
    const [warehouse, setWarehouse] = useState(null)
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
            ordered_number: '',
            actual_number: '',
            cost_per_unit: '',
            comment: '',
            status: 'added'
        }
        const array = documentItems.concat(newItem)
        setDocumentItems(array)
        documentChanged = true
    }


    const onTabClose = () => {
        if (!documentChanged) {
            navigate('/orders');
            documentChanged = false;
        } else {
            setSaveChangesVisible(true)
        }
    }

    const onReject = () => {
        setSaveChangesVisible(false);
        navigate('/orders');
        documentChanged = false;
    }

    const onAccept = async () => {
        const data = {
            warehouse: warehouse.id,
            confirmation_timestamp: dateInput.current.value,
            comment: descInput.current.value
        }
        await ordersServices.updateDocument(document.id, data)
        const result = await ordersServices.updateDocumentItems(document.id, documentItems)
        if (result.status === 200) {
            setSaveChangesVisible(false);
            navigate('/orders');
            documentChanged = false;
        }
    }

    const onCloseWindowClose = () => {
        setSaveChangesVisible(false);
    }

    const onAccessWindowClose = () => {
        setAccessVisible(false)
    }

    const onItemDelete = (item) => {
        if (checkAccessToChange('delete', item)) {
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
        if (checkAccessToChange('cost_per_unit')) {
            event.target.value = parseFloat(documentItems[index].cost_per_unit).toFixed(3)
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
        if (checkAccessToChange('comment')) {
            event.target.value = documentItems[index].comment
            return
        }
        documentItems[index].comment = event.target.value
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
        }
        documentChanged = true;
    }

    const onNumberChange = (event, item, nameOfField) => {
        const index = documentItems.indexOf(item)
        if (checkAccessToChange(nameOfField)) {
            if (nameOfField === 'ordered_number') {
                event.target.value = (documentItems[index].ordered_number).toFixed(3)
            } else if (nameOfField === 'actual_number') {
                event.target.value = (documentItems[index].actual_number).toFixed(3)
            }
            return
        }
        if (nameOfField === 'ordered_number') {
            documentItems[index].ordered_number = event.target.value
        } else if (nameOfField === 'actual_number') {
            documentItems[index].actual_number = event.target.value
        }
        if (documentItems[index].hasOwnProperty('id')) {
            documentItems[index].status = 'updated'
        }
        documentChanged = true;
    }


    const makeChoiceOfTMV = (item) => {
        if (checkAccessToChange('tmv', item)) {
            return
        }
        onTMVClicks = 0;
        itemToEdit = item;
        setSelectTMVVisible(true);
    }

    const makeChoiceOfWarehouse = () => {
        if (checkAccessToChange('warehouses')) {
            return
        }
        onWarehouseClicks = 0;
        setSelectWarehouseVisible(true);
    }

    const generateItemKey = (item) => {
        const key = `${documentItems.indexOf(item)}--${item.tmv.name}--${item.actual_number}--${item.ordered_number}`
        return key
    }

    const checkAccessToChange = (fieldToChange = '', item) => {
        const allow_field = ['actual_number', 'cost_per_unit', 'comment']
        if (document == null) {
            return false
        }
        if (document.confirmation_status) {
            setAccessMessage('Ви не можете змінювати проведений документ')
            setAccessVisible(true);
            return true
        } else if (document.creator.id !== authCounterparty.id && document.provider.id !== authCounterparty.id) {
            setAccessMessage('Ви не можете змінювати не свій документ')
            setAccessVisible(true);
            return true
        } else if (!(allow_field.indexOf(fieldToChange) in allow_field) && document.provider.id === authCounterparty.id) {
            setAccessMessage('Ви не можете змінювати ці поля документа')
            setAccessVisible(true);
            return true
        } else if ((allow_field.indexOf(fieldToChange) in allow_field) && document.creator.id === authCounterparty.id) {
            setAccessMessage('Ви не можете змінювати ці поля документа')
            setAccessVisible(true);
            return true
        } else if (fieldToChange === 'delete' && document.provider.id === authCounterparty.id) {
            setAccessMessage('Ви не можете видаляти записи документа')
            setAccessVisible(true);
            return true
        } else if (fieldToChange === 'delete' && document.creator.id === authCounterparty.id &&
            parseFloat(item.actual_number) !== 0.0) {
            setAccessMessage('Ви не можете видаляти записи документа, які вже купили')
            setAccessVisible(true);
            return true
        } else if (fieldToChange === 'tmv' && document.creator.id === authCounterparty.id &&
            parseFloat(item.actual_number) !== 0.0) {
            setAccessMessage('Ви не можете змінювати записи документа, які вже купили')
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
            setWarehouse({
                id: warehouse.id,
                name: warehouse.name
            })
            onWarehouseClicks = 0;
            closeWarehouseSelect()
            setDocumentItems(documentItems);
        }
        documentChanged = true;
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

    const fetchOrderDocument = async () => {
        const response = await ordersServices.getDocumentById(id);
        setDocument(response.json);
        setWarehouse(response.json.warehouse)
        setDocumentItems(addStatusProperty(response.json.order_document_items));
    }

    const onDateFilesChange = (event) => {
        const value = event.target.value
        if (value.length == 4) {
            event.target.value = `${value}-`
        } else if (value.length == 7) {
            event.target.value = `${value}-`
        }
        documentChanged = true;
    }

    useEffect(() => {
        fetchOrderDocument()
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
                    <input type="text" className="p-0 ms-1 input-border" ref={descInput} onChange={() => {
                        documentChanged = true
                    }}
                           defaultValue={document != null ? document.comment : ''}/>

                    <p className="mb-0 ms-5">
                        <b>На склад:</b>
                    </p>
                    <input type="text" className="p-0 ms-1 input-border" onSelect={makeChoiceOfWarehouse}
                           defaultValue={warehouse != null ? warehouse.name : ''}/>

                </div>
                <button className="btn p-0 me-2 bc_none bt-menu" onClick={onTabClose} title="Закрити вікно">
                    <img src={closeIcon}/>
                </button>
            </div>
            <table className="table table-bordered t-36">
                <thead>
                <tr>
                    <th className="col-md-auto" scope="col">№</th>
                    <th className="col-md-3" scope="col">ТМЦ</th>
                    <th className="col-md-auto" scope="col">О-ця</th>
                    <th className="col-md-auto" scope="col">Замовлена к-сть</th>
                    <th className="col-md-auto" scope="col">Закуплена к-сть</th>
                    <th className="col-md-auto" scope="col">Вартість</th>
                    <th className="col-md-4" scope="col">Коментар</th>
                </tr>
                </thead>
                <tbody>
                {documentItems && documentItems.map(item => {
                    if (item.status !== 'deleted') {
                        return <OrderDocumentItemComponent
                            item={item} key={generateItemKey(item)} onItemDelete={onItemDelete}
                            number={documentItems.indexOf(item) + 1} onTMVInput={makeChoiceOfTMV}
                            onCostChange={onCostChange} onNumberChange={onNumberChange}
                            onCommentChange={onCommentChange}/>
                    }
                })}
                </tbody>
            </table>
        </div>
    )
}
