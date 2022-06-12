import React from "react";

import './RemnantReportComponent.css';

export const RemnantReportItemComponent = ({item}) => {

    return (
        <tr>
            <td className="p-0 ps-1">{item.tmv.id}</td>
            <td className="p-0 ps-1">{item.tmv.name}</td>
            <td className="p-0 ps-1">{item.tmv.unit.name}</td>
            <td className="p-0 ps-1">{(item.total_number).toFixed(3)}</td>
            <td className="p-0 ps-1">{(item.cost_per_unit).toFixed(3)}</td>
            <td className="p-0 ps-1">{(item.total_cost).toFixed(3)}</td>
        </tr>
    )
}
