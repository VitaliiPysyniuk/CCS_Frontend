import React from "react";

import './TurnoverReportComponent.css';

export const TurnoverReportSecondaryItemComponent = ({action}) => {

    return (
        <tr>
            <td className="p-0 ps-1 ig-bg-cl"></td>
            <td className="p-0 ps-1 ig-bg-cl"></td>
            <td className="p-0 ps-1 ig-bg-cl"></td>
            <td className="p-0 ps-1">{action.number > 0 ? (action.number).toFixed(3) : ''}</td>
            <td className="p-0 ps-1">{action.number > 0 ? parseFloat(action.cost_per_unit).toFixed(3) : ''}</td>
            <td className="p-0 ps-1">
                {action.number > 0 ? (parseFloat(action.number) * parseFloat(action.cost_per_unit)).toFixed(3) : ''}
            </td>
            <td className="p-0 ps-1">{action.number < 0 ? (-action.number).toFixed(3) : ''}</td>
            <td className="p-0 ps-1">{action.number < 0 ? parseFloat(action.cost_per_unit).toFixed(3) : ''}</td>
            <td className="p-0 ps-1">
                {action.number < 0 ? (-(action.number) * parseFloat(action.cost_per_unit)).toFixed(3) : ''}
            </td>
            <td className="p-0 ps-1">
                {action.movement_document === null ? `Прихід ТМЦ №${action.procurement_document}` : `Переміщення ТМЦ №${action.movement_document}`}
            </td>
        </tr>
    )
}
