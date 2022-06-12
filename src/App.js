import './App.css';
import React from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import {
    NavigationComponent,
    AuthenticationComponent,
    ProtectedRoute,
    TMVUnitsComponent,
    TMVTypesComponent,
    TMVsComponent,
    CounterpartiesComponent,
    WarehousesComponent,
    ProcurementDocumentComponent,
    ProcurementDocumentsComponent,
    MovementDocumentsComponent,
    MovementDocumentComponent,
    TurnoverReportComponent,
    RemnantReportComponent,
    OrderDocumentCreateComponent,
    OrderDocumentsComponent,
    OrderDocumentComponent
} from "./components";
import {useEffect} from "react";


function App() {

    useEffect(() => {
        document.title = "VP-LTD"
    }, [])

    return (
        <div>
            <Routes>
                <Route path='/' element={<ProtectedRoute/>}>
                    <Route path='nav' exact={true} element={<NavigationComponent/>}/>
                    <Route path='tmvs' exact={true} element={<TMVsComponent/>}/>
                    <Route path='tmvs/units' exact={true} element={<TMVUnitsComponent/>}/>
                    <Route path='tmvs/types' exact={true} element={<TMVTypesComponent/>}/>
                    <Route path='counterparties' exact={true} element={<CounterpartiesComponent/>}/>
                    <Route path='warehouses' exact={true} element={<WarehousesComponent/>}/>
                    <Route path='procurements' exact={true} element={<ProcurementDocumentsComponent/>}/>
                    <Route path='procurements/:id' exact={true} element={<ProcurementDocumentComponent/>}/>
                    <Route path='procurements/create' exact={true} element={<ProcurementDocumentComponent/>}/>
                    <Route path='movements' exact={true} element={<MovementDocumentsComponent/>}/>
                    <Route path='movements/:id' exact={true} element={<MovementDocumentComponent/>}/>
                    <Route path='movements/create' exact={true} element={<MovementDocumentComponent/>}/>
                    <Route path='reports/tmv-turnover' exact={true} element={<TurnoverReportComponent/>}/>
                    <Route path='reports/tmv-remnant' exact={true} element={<RemnantReportComponent/>}/>
                    <Route path='orders' exact={true} element={<OrderDocumentsComponent/>}/>
                    <Route path='orders/:id' exact={true} element={<OrderDocumentComponent/>}/>
                    <Route path='orders/create' exact={true} element={<OrderDocumentCreateComponent/>}/>
                    <Route path='*' element={<Navigate to='/'/>}/>
                </Route>
                <Route path='/login' exact={true} element={<AuthenticationComponent/>}/>
            </Routes>
        </div>
    );
}

export default App;
