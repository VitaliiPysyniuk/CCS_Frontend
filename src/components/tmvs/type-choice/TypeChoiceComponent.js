import React from "react";

export const TypeChoiceComponent = ({type, select}) => {
    return (
        <tr onClick={() => select(type)}>
            <td id="id" className="col-md-1 p-0 ps-1 align-middle">{type.id}</td>
            <td id="name" className="p-0 ps-1 align-middle">{type.name}</td>
        </tr>
    )
}
