import React from "react";

import './TurnoverReportComponent.css';
import {TurnoverReportSecondaryItemComponent} from "./TuroverReportSecondaryItemComponent";

export const TurnoverReportMainItemComponent = ({item, actions}) => {

    return (
        <tbody>
            <tr className="tr-bg-cl">
                <td className="p-0 ps-1">{item.tmv.id}</td>
                <td className="p-0 ps-1">{item.tmv.name}</td>
                <td className="p-0 ps-1">{item.tmv.unit.name}</td>
                <td className="p-0 ps-1"></td>
                <td className="p-0 ps-1"></td>
                <td className="p-0 ps-1"></td>
                <td className="p-0 ps-1"></td>
                <td className="p-0 ps-1"></td>
                <td className="p-0 ps-1"></td>
                <td className="p-0 ps-1"></td>
            </tr>
            {actions.map(action => {
                return <TurnoverReportSecondaryItemComponent action={action}/>
            })}
        </tbody>
    )
}
