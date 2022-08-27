import React, { useState } from 'react';

function Myform(){
    const [inputs,setInputs]=useState("");

    const handleChange = (event) => {
        const name=event.target.name;
        const value =event.target.value;
        setInputs(values => ({...values,[name]:value}))
    }
    const handleSubmit = (event)=>{
        event.preventDefault();
        alert(inputs);
    }
        return(
        <form onSubmit={handleSubmit}>
            <label>Enter Your Name:
                <input
                type="text"
                name="username"
                value={inputs.username || ""}
                onChange={handleChange}
                />
            </label>
            <label>Enter Your Age:
                <input
                type="number"
                name="age"
                value={inputs.age || ""}
                onChange={handleChange}
                />
            </label>
            <input type="submit"/>
        </form>
    )
}

/*function Myform(){
    const [textarea,setTextarea]=useState(
        "The Content of a textarea goes in the value attribute"
    );
    const handleChange = (event) => {
        setTextarea(event.target.value)
    }
    return(
        <form>
            <textarea value={textarea} onChange={handleChange}/>
        </form>
    )
}*/
/*function Myform(){
    const [myCar,setMycar]=useState("Volvo");

    const handleChange=(event) => {
        setMycar(event.target.value)
    }
    return(
        <form>
            <select value={myCar} onChange={handleChange}>
                <option value="Ford">Ford</option>
                <option value="Solvo">Volvo</option>
                <option value="Fiat">Fiat</option>
            </select>
        </form>
    )
}*/
export default Myform;

