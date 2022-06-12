import React from 'react';
import {Link} from 'react-router-dom';
import './NavigationComponent.css'

export const NavigationComponent = () => {

    const onLogOutClick = () => {
        window.sessionStorage.removeItem('access');
        window.sessionStorage.removeItem('refresh');
        window.sessionStorage.removeItem('authCounterparty');
    }

    return (
        <div class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container-fluid  ps-5 pe-3">
                <Link className="navbar-brand fw-1000" to={"/nav"}>VP-LTD</Link>
                <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNavDarkDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <Link to={'#'} className="nav-link dropdown-toggle" id="directoryDropdown" role="button"
                                  data-bs-toggle="dropdown" aria-expanded="false">Довідник</Link>
                            <ul className="dropdown-menu dropdown-menu-dark bg-dark" aria-labelledby="directoryDropdown">
                                <li><Link to={'/counterparties'} className="dropdown-item">Контрагенти</Link></li>
                                <li><Link to={'/warehouses'} className="dropdown-item">Склади</Link></li>
                                <li><Link to={'/tmvs'} className="dropdown-item">ТМЦ</Link></li>
                                <li><Link to={'/tmvs/types'} className="dropdown-item">Типи ТМЦ</Link></li>
                                <li><Link to={'/tmvs/units'} className="dropdown-item">Одиниці виміру</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link to={'#'} className="nav-link dropdown-toggle" id="documentsDropdown" role="button"
                                  data-bs-toggle="dropdown" aria-expanded="false">Документи</Link>
                            <ul className="dropdown-menu dropdown-menu-dark bg-dark" aria-labelledby="documentsDropdown">
                                <li><Link to={'/procurements/create'} className="dropdown-item">Прихід ТМЦ</Link></li>
                                <li><Link to={'/movements/create'} className="dropdown-item">Переміщення ТМЦ</Link></li>
                                <li><Link to={'/orders/create'} className="dropdown-item">Замовлення ТМЦ</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link to={'#'} className="nav-link dropdown-toggle" id="journalsDropdown" role="button"
                                  data-bs-toggle="dropdown" aria-expanded="false">Журнали</Link>
                            <ul className="dropdown-menu dropdown-menu-dark bg-dark" aria-labelledby="journalsDropdown">
                                <li><Link to={'/procurements'} className="dropdown-item">Прихід ТМЦ</Link></li>
                                <li><Link to={'/movements'} className="dropdown-item">Переміщення ТМЦ</Link></li>
                                <li><Link to={'/orders'} className="dropdown-item">Замовлення ТМЦ</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link to={'#'} className="nav-link dropdown-toggle" id="reportsDropdown" role="button"
                                  data-bs-toggle="dropdown" aria-expanded="false">Звіти</Link>
                            <ul className="dropdown-menu dropdown-menu-dark bg-dark" aria-labelledby="reportsDropdown">
                                <li><Link to={'reports/tmv-remnant'} className="dropdown-item">Залишки ТМЦ</Link></li>
                                <li><Link to={'reports/tmv-turnover'} className="dropdown-item">Обіг ТМЦ</Link></li>
                            </ul>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to={'/login'} className="nav-link" onClick={onLogOutClick}>Вийти</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
