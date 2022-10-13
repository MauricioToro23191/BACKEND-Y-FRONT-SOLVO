import React from "react";

export default function CardSite({name}){
    return(
        <>
            <div className="CardCont">
                <div className="NameSite">
                    <p>{name}</p>
                </div>
                <div className="Details">
                    <label className="DetailsLabel">Agents: 10</label>
                    <label className="DetailsLabel">Active: 10</label>
                    <label className="DetailsLabel">Active: 10</label>
                </div>
            </div>
        </>
    )
}