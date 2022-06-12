import React from "react";

export const CounterpartyChoiceComponent = ({counterparty, select}) => {
    return (
        <tr onClick={() => select(counterparty)}>
            <td className="p-0 ps-1 align-middle">{counterparty.id}</td>
            <td className="p-0 ps-1 align-middle">{counterparty.name}</td>
            <td className="p-0 ps-1 align-middle">{counterparty.type.name}</td>
            <td className="p-0 ps-1 align-middle">{counterparty.contact_data}</td>
        </tr>
    )
}
