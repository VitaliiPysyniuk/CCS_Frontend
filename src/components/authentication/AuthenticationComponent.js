import React, {useState} from 'react';

import './AuthenticationComponent.css';
import {authServices, counterpartyServices} from '../../services';
import {useNavigate} from "react-router-dom";

export const AuthenticationComponent = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const setAuthUser = async () => {
        const accessToken = window.sessionStorage.getItem('access');
        const user = await authServices.getAuthUserInfo(accessToken);
        const counterparty = await counterpartyServices.getCounterpartyByContactData(user.phone_number)
        window.sessionStorage.setItem('authCounterparty', JSON.stringify(counterparty));
    }

    const onSubmit = async (event) => {
        event.preventDefault()

        let user_credentials = {
            email: event.target.elements.email.value,
            password: event.target.elements.pwd.value
        }

        const response = await authServices.getTokenPair(user_credentials)
        if (response.status === 200) {
            window.sessionStorage.setItem('access', response.access)
            window.sessionStorage.setItem('refresh', response.refresh)
            await setAuthUser()
            navigate('/nav')
        } else {
            event.target.reset()
            setMessage(response.detail)
        }
    }

    const onClick = () => {
        setMessage('')
    }

    return (
        <div>
            <div className="bg-dark custom_cl min_wth_40 p-2 rounded-2 centered">
                <h2 className="m-0 text-center fw-1000 cl_white">VP-LTD</h2>
                <form className="d-flex flex-column align-items-center" onSubmit={onSubmit} onClick={onClick}>
                    <div className="mb-3 mt-3 wdt_100">
                        <label htmlFor="email" className="form-label">Логін:</label>
                        <input type="email" className="form-control" id="email" placeholder="Введіть логін"
                               name="email"/>
                    </div>
                    <div className="mb-3 wdt_100">
                        <label htmlFor="pwd" className="form-label">Пароль:</label>
                        <input type="password" className="form-control" id="pwd" placeholder="Введіть пароль"
                               name="pswd"/>
                    </div>
                    <div className="mb-3 wdt_100 bc_danger rounded-2" style={{display: message !== '' ? "block" : "none"}}>
                        <p className="form-label m-0 p-2">{message}.</p>
                    </div>
                    <button type="submit" className="btn bg-success custom_cl wth_60">Увійти</button>
                </form>
            </div>
        </div>
    )
}
