import MUIDataTable from "mui-datatables";
import Users from "../Dates/TimeS.json";


const Columns = [
    
    {
    name: "solid",
    label: "Sol ID"},
    {
    name:"name",
    label: "Firts Name"
    },
    {name:"lname",
    label:"Last Name" 
    },

    {name:"ciudad",
    label:"Ciudad"
    },
    {
    name:"status",
    label:"Status"
    },
    {name:"time",
    label:"Status Time"
    }
]

const Option ={
    download: false,
    filterType: "multiselect",
    print: false,
    searchPlaceholder:"Search..",
    selectableRows:'multiple',
    selectableRowsOnClick:true,
    selectableRowsHideCheckboxes:true
}
export const DatatableRTA =() => {
    return(
        <>
            <MUIDataTable
            title={"RTA"}
            columns={Columns}
            data={Users}
            options={Option} />
        </> 
    )
}