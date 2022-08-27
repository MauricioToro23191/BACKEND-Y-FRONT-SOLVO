import MUIDataTable from "mui-datatables"; 
import React from "react";
// const {reporte1}=this.props
//const columnsR2 = ["Solvo id","Nombre","Apellidos","Supervisor","Available","Not Available","Break","Lunch","Team Meeting","Coaching"]

const Option ={
    download: true,
    filter: true,
    filterType: "dropdown",
    print: false,
    searchPlaceholder:"Search..",
    selectableRows:'multiple',
    selectableRowsOnClick:true,
    responsive: 'simple',
    selectableRowsHideCheckboxes:true,
    enableNestedDataAccess : ',',
    downloadOptions: {
        filename: 'excel-detallado.csv',
        separator: ',',
        filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
    }
        }
}


class DataTableE extends React.Component{
    render(){
        const {Name}=this.props 
        const {Columns}=this.props
        const {Title}=this.props
        
        return(
            
            <MUIDataTable
            title={"Export  " + Title}
            columns={Columns}
            data={Name.listRTS}
            options={Option} />
            
        )
    }
}
export default DataTableE;
