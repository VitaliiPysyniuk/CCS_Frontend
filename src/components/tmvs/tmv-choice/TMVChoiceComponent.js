import React from "react";

export const TMVChoiceComponent = ({tmv, select}) => {
    return (
        <tr onClick={() => select(tmv)}>
            <td id="id" className="col-md-1 p-0 ps-1 align-middle">{tmv.id}</td>
            <td id="name" className="p-0 ps-1 align-middle">{tmv.name}</td>
            <td id="unit" className="col-md-1 p-0 ps-1 align-middle">{tmv.unit.name}</td>
            <td id="type" className="col-md-1 p-0 ps-1 align-middle">{tmv.type.name}</td>
        </tr>
    )
}
