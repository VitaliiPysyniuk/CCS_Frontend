import React from "react";

export const WarehouseChoiceComponent = ({warehouse, select}) => {
    return (
        <tr onClick={() => select(warehouse)}>
            <td className="p-0 ps-1 align-middle">{warehouse.id}</td>
            <td className="p-0 ps-1 align-middle">{warehouse.name}</td>
            <td className="p-0 ps-1 align-middle">{warehouse.owner.name}</td>
            <td className="p-0 ps-1 align-middle">{warehouse.foreman.name}</td>
        </tr>
    )
}
