import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import './TurnoverReportComponent.css';
import closeIcon from "../../icons/close.png";
import {TurnoverReportFormComponent} from './TurnoverReportFormComponent';
import {TurnoverReportMainItemComponent} from "./TurnoverReportMainItemComponent";
import {tmvServices, warehouseServices} from '../../services';
import {TMVsChoiceComponent} from "../tmvs/tmv-choice/TMVsChoiceComponent";
import {WarehousesChoiceComponent} from "../warehouses/warehouse-choice/WarehousesChoiceComponent";
import {TypesChoiceComponent} from "../tmvs/type-choice/TypesChoiceComponent";

let tmvs = null;
let warehouses = null;
let types = null;
let onWarehouseClicks = 0;
let onTMVClicks = 0;
let onTypeClicks = 0;

export const TurnoverReportComponent = () => {
    const navigate = useNavigate();
    const [formVisible, setFormVisible] = useState(true)
    const [reportVisible, setReportVisible] = useState(false)
    const [reportItems, setReportItems] = useState(null)
    const [selectTMVVisible, setSelectTMVVisible] = useState(false)
    const [selectWarehouseVisible, setSelectWarehouseVisible] = useState(false)
    const [selectTypeVisible, setSelectTypeVisible] = useState(false)
    const [tmv, setTMV] = useState(null)
    const [warehouse, setWarehouse] = useState(null)
    const [type, setType] = useState(null)


    const onTabClose = () => {
        if (formVisible) {
            navigate('/');
        }
        if (reportVisible) {
            setFormVisible(true)
            setReportVisible(false)
        }
    }

    const closeTMVSelect = () => {
        setSelectTMVVisible(false);
    }

    const closeWarehouseSelect = () => {
        setSelectWarehouseVisible(false);
    }

    const closeTypeSelect = () => {
        setSelectTypeVisible(false);
    }

    const makeChoiceOfTMV = () => {
        onTMVClicks = 0;
        setSelectTMVVisible(true);
    }

    const makeChoiceOfWarehouse = () => {
        onWarehouseClicks = 0;
        setSelectWarehouseVisible(true);
    }

    const makeChoiceOfType = () => {
        onTypeClicks = 0;
        setSelectTypeVisible(true);
    }

    const selectTMV = (tmv) => {
        onTMVClicks += 1;
        if (onTMVClicks === 2) {
            setTMV(tmv)
            closeTMVSelect()
        }
    }

    const selectWarehouse = (warehouse) => {
        onWarehouseClicks += 1;
        if (onWarehouseClicks === 2) {
            setWarehouse(warehouse)
            closeWarehouseSelect()
        }
    }

    const selectType = (type) => {
        onTypeClicks += 1;
        if (onTypeClicks === 2) {
            setType(type)
            closeTypeSelect()
        }
    }

    const onFormSubmit = (event) => {
        event.preventDefault()
        if (warehouse === null) {
            return
        }
        setFormVisible(false)

        const warehouseId = warehouse.id
        const queryParams = {}
        if (event.target.date_from.value !== '') {
            queryParams.date_from = event.target.date_from.value
        }
        if (event.target.date_to.value !== '') {
            queryParams.date_to = event.target.date_to.value
        }
        if (tmv !== null) {
            queryParams.tmv = tmv.id
        }
        if (type !== null) {
            queryParams.tmv_type = type.id
        }

        fetchReportItems(warehouseId, queryParams)

        setReportVisible(true)
    }

    const fetchReportItems = async (warehouseId, queryParams) => {
        let reportItemsData = await warehouseServices.getTurnoverReport(warehouseId, queryParams);
        setReportItems(reportItemsData.json.tmvs);
    }

    const fetchTMVs = async () => {
        let tmvsData = await tmvServices.getAll();
        tmvs = tmvsData;
    }

    const fetchTypes = async () => {
        let typesData = await tmvServices.getAll('/types');
        types = typesData;
    }

    const fetchWarehouses = async () => {
        let warehousesData = await warehouseServices.getAll();
        warehouses = warehousesData;
    }

    useEffect(() => {
        fetchTMVs();
        fetchTypes();
        fetchWarehouses();
    }, [])

    return (

        <div className="position-relative">
            <TMVsChoiceComponent visible={selectTMVVisible} tmvs={tmvs} selectTMV={selectTMV}
                                 closeTMVSelect={closeTMVSelect}/>
            <WarehousesChoiceComponent visible={selectWarehouseVisible} warehouses={warehouses}
                                       selectWarehouse={selectWarehouse} closeWarehouseSelect={closeWarehouseSelect}/>
            <TypesChoiceComponent visible={selectTypeVisible} types={types}
                                  selectType={selectType} closeTypeSelect={closeTypeSelect}/>
            <div className="p-1 d-flex justify-content-end menu">
                <button className="btn p-0 me-2 bc_none bt-menu" onClick={onTabClose} title="?????????????? ??????????">
                    <img src={closeIcon}/>
                </button>
            </div>
            {formVisible &&
                <TurnoverReportFormComponent tmv={tmv} type={type} warehouse={warehouse} onFormSubmit={onFormSubmit}
                                             onWarehouseInput={makeChoiceOfWarehouse} onTMVInput={makeChoiceOfTMV}
                                             key={(tmv != null ? tmv.id : '') + (warehouse != null ? warehouse.id : '') +
                                                 (type != null ? type.id : '')} onTypeInput={makeChoiceOfType}/>}
            {reportVisible && <table className="table table-bordered t-36">
                <thead>
                <tr>
                    <th className="col-md-auto align-middle text-center p-1" rowspan="2" scope="col">??????</th>
                    <th className="col-md-3 align-middle text-center p-1" rowspan="2" scope="col">??????????</th>
                    <th className="col-md-1 align-middle text-center p-1" rowspan="2" scope="col">??-????</th>
                    <th className="col-md-1 text-center p-1" colspan="3" scope="col">????????????</th>
                    <th className="col-md-1 text-center p-1" colspan="3" scope="col">????????????</th>
                    <th className="col-md-2 align-middle text-center p-1" rowspan="2" scope="col">???? ????????????</th>
                </tr>
                <tr>
                    <th className="col-md-1 p-1" scope="col">??-??????</th>
                    <th className="col-md-1 p-1" scope="col">????????</th>
                    <th className="col-md-1 p-1" scope="col">????????</th>
                    <th className="col-md-1 p-1" scope="col">??-??????</th>
                    <th className="col-md-1 p-1" scope="col">????????</th>
                    <th className="col-md-1 p-1" scope="col">????????</th>
                </tr>
                </thead>
                {reportItems && Object.keys(reportItems).map(key => {
                    return <TurnoverReportMainItemComponent item={reportItems[key]} actions={reportItems[key].actions}/>
                })}
            </table>}
        </div>
    )
}
