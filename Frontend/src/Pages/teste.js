
import React from "react";
import { useState } from "react";
import "../styles/teste.scss"

export default function Testeo() {

    const [style,setStyle] = useState("sideL")
    const changeStyle = () =>{
        setStyle("sidelA")
    }

    return (
        <div className="Container">
            <div className={style}>

            </div>
            <div className="sider">
                <button onClick={changeStyle} className="btn">
                    Click Me
                </button>
            </div>
        </div>
    )
}