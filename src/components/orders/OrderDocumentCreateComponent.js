import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import addIcon from "../../icons/add.png";
import closeIcon from "../../icons/close.png";

import {OrderDocumentCreateItemComponent} from './OrderDocumentCreateItemComponent';
import {TMVsChoiceComponent} from '../tmvs/tmv-choice/TMVsChoiceComponent';
import {WarehousesChoiceComponent} from '../warehouses/warehouse-choice/WarehousesChoiceComponent';
import {CounterpartiesChoiceComponent} from '../counterparties/counterparty-choice/CounterpartiesChoiceComponent';
import {CloseModalWindowComponent} from "../close_modal_window/CloseModalWindowComponent";
import {AccessModalWindowComponent} from '../access_modal_window/AccessModalWindowComponent';
import './OrderDocumentsComponent.css';
import {tmvServices, warehouseServices, ordersServices, counterpartyServices} from "../../services";

let tmvs = null;
let warehouses = null;
let counterparties = null;
let itemToEdit = null;
let onWarehouseClicks = 0;
let onTMVClicks = 0;
let onCounterpartyClicks = 0;
let documentChanged = false;

export const OrderDocumentCreateComponent = () => {
    const [provider, setProvider] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [documentItems, setDocumentItems] = useState([])
    const [selectTMVVisible, setSelectTMVVisible] = useState(false)
    const [selectWarehouseVisible, setSelectWarehouseVisible] = useState(false)
    const [selectCounterpartyVisible, setSelectCounterpartyVisible] = useState(false)
    const [saveChangesVisible, setSaveChangesVisible] = useState(false)
    const [accessVisible, setAccessVisible] = useState(false)
    const [accessMessage, setAccessMessage] = useState('')
    const navigate = useNavigate();
    const authCounterparty = JSON.parse(window.sessionStorage.getItem('authCounterparty'));
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
        const documentData = {
            creator: authCounterparty.id,
            provider: provider.id,
            warehouse: warehouse.id,
            comment: descInput.current.value,
            confirmation_timestamp: dateInput.current.value
        }
        const result = await ordersServices.createNewOrder(documentData, documentItems)
        if (result.status == 200) {
            setSaveChangesVisible(false);
            navigate('/orders');
            documentChanged = false;
        } else {
            console.log(result.msg)
        }
    }

    const onCloseWindowClose = () => {
        setSaveChangesVisible(false);
    }

    const onAccessWindowClose = () => {
        setAccessVisible(false)
    }

    const onItemDelete = (item) => {
        const index = documentItems.indexOf(item)
        if (documentItems[index].status === 'added') {
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

    const closeCounterpartySelect = () => {
        setSelectCounterpartyVisible(false);
    }

    const onCommentChange = (event, item) => {
        const index = documentItems.indexOf(item)
        documentItems[index].comment = event.target.value
        documentChanged = true;
    }

    const onNumberChange = (event, item) => {
        const index = documentItems.indexOf(item)
        documentItems[index].ordered_number = event.target.value
        documentChanged = true;
    }

    const makeChoiceOfTMV = (item) => {
        onTMVClicks = 0;
        itemToEdit = item;
        setSelectTMVVisible(true);
    }

    const makeChoiceOfWarehouse = (item) => {
        onWarehouseClicks = 0;
        itemToEdit = item;
        setSelectWarehouseVisible(true);
    }

    const makeChoiceOfCounterparty = () => {
        onCounterpartyClicks = 0;
        setSelectCounterpartyVisible(true);
    }

    const generateItemKey = (item) => {
        const key = `${item.tmv.name}--${item.status}`
        return key
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
            setWarehouse({
                id: warehouse.id,
                name: warehouse.name
            })
            closeWarehouseSelect()
        }
    }

    const selectCounterparty = (counterparty) => {
        onCounterpartyClicks += 1;
        if (onCounterpartyClicks === 2) {
            setProvider({
                id: counterparty.id,
                name: counterparty.name
            })
            onCounterpartyClicks = 0;
            closeCounterpartySelect()
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

    const fetchCounterparties = async () => {
        let counterpartiesData = await counterpartyServices.getAll();
        const available_counterparties = []
        for (let counterparty of counterpartiesData) {
            if (counterparty.type.name === 'постачальник' || counterparty.type.name === 'виконроб') {
                available_counterparties.push(counterparty)
            }
        }
        counterparties = available_counterparties;
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
        fetchTMV();
        fetchWarehouses();
        fetchCounterparties();
    }, [])

    return (
        <div className="position-relative">
            <TMVsChoiceComponent visible={selectTMVVisible} tmvs={tmvs} selectTMV={selectTMV}
                                 closeTMVSelect={closeTMVSelect}/>
            <WarehousesChoiceComponent visible={selectWarehouseVisible} warehouses={warehouses}
                                       selectWarehouse={selectWarehouse} closeWarehouseSelect={closeWarehouseSelect}/>
            <CounterpartiesChoiceComponent visible={selectCounterpartyVisible} counterparties={counterparties}
                                           selectCounterparty={selectCounterparty}
                                           closeCounterpartySelect={closeCounterpartySelect}/>
            <CloseModalWindowComponent visible={saveChangesVisible} onClose={onCloseWindowClose} onAccept={onAccept}
                                       onReject={onReject}/>
            <AccessModalWindowComponent visible={accessVisible} message={accessMessage} onClose={onAccessWindowClose}/>
            <div className="p-1 d-flex justify-content-between menu order-menu-ht">
                <div className="d-flex align-items-center">
                    <button className="btn p-0 ms-4 bc_none bt-menu" onClick={addNewItem} title="Додати">
                        <img src={addIcon}/>
                    </button>

                    <div>
                        <p className="mb-0 ms-5">
                            <b>Автор: {authCounterparty.name}</b>
                        </p>

                        <div className="d-flex">
                            <p className="mb-0 ms-5">
                                <b>Постачальник: </b>
                            </p>
                            <input type="text" className="p-0 ms-1 input-border" onSelect={makeChoiceOfCounterparty}
                                   defaultValue={provider != null ? provider.name : ''}/>
                        </div>
                    </div>

                    <div className="d-flex">
                        <p className="mb-0 ms-5">
                            <b>На склад: </b>
                        </p>
                        <input type="text" className="p-0 ms-1 input-border" onSelect={makeChoiceOfWarehouse}
                               defaultValue={warehouse != null ? warehouse.name : ''}/>
                    </div>


                    <div>
                        <div className="d-flex">
                            <p className="mb-0 ms-5"><b>Дата документу:</b></p>
                            <input type="text" className="p-0 ms-1 date-wt input-border" id="document-date"
                                   ref={dateInput} onChange={onDateFilesChange}/>
                        </div>
                        <div className="d-flex">
                            <p className="mb-0 ms-5"><b>Коментар:</b></p>
                            <input type="text" className="p-0 ms-1 input-border" ref={descInput}/>
                        </div>
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
                    <th className="col-md-5" scope="col">ТМЦ</th>
                    <th className="col-md-auto" scope="col">О-ця</th>
                    <th className="col-md-auto" scope="col">К-сть</th>
                    <th className="col-md-5" scope="col">Коментар</th>
                </tr>
                </thead>
                <tbody>
                {documentItems.length > 0 && documentItems.map(item => {
                    if (item.status !== "deleted") {
                        return <OrderDocumentCreateItemComponent
                            item={item} key={generateItemKey(item)} onItemDelete={onItemDelete}
                            number={documentItems.indexOf(item) + 1} onTMVInput={makeChoiceOfTMV}
                            onNumberChange={onNumberChange} onCommentChange={onCommentChange}/>
                    }
                })}
                </tbody>
            </table>
        </div>
    )
}
