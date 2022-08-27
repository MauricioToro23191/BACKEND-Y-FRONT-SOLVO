import MUIDataTable from "mui-datatables";
import React,{useState} from "react";



const Option ={
    download: false,
    filterType: "multiselect",
    print: false, 
    searchPlaceholder:"Search..",
    selectableRows:'multiple',
    selectableRowsOnClick:true,
    actionsColumnIndex: -1
    
}


class DatatableRTA extends React.Component{
     
    
    render(){
        let {Compania}=this.props
        let {Lista}=this.props
        

    
        const Columns = [{name:"id_solvo"},{name:"Firts Name"},{name:"Supervisor"},{name:"Ciudad"},{name:"state"},{name:"time"},{name:"totest"}]
        
        function agregar (){
            console.log(Lista)
            Lista.push({
                'id_solvo': 'Lista[ii].id_solvo',
                'Firts Name': 'Lista[ii][\'Firts Name\']',
                'Supervisor':' Lista[ii].Supervisor',
                'Ciudad': 'Lista[ii].Ciudad',
                'state': 'Lista[ii].state',
                'time': 'Lista[ii].time',
                'totest':""
                });
            console.log(Lista)
        }
    return(
        <>
            <button onClick={agregar}>agregar</button>

            <MUIDataTable
            title={"RTS  "+ Compania}
            columns={Columns}
            data={Lista}
            options={Option}
             />
        </>
    )
    }
}
export default DatatableRTA;