import MUIDataTable from "mui-datatables";
import users from '../Dates/users.json';

const Columns = ["SolID","Name","LastN","Email","Perfil","Supervisor","Account","Location"]

const Option ={
    download: false,
    filterType: "multiselect",
    print: false,
    searchPlaceholder:"Search..",
    selectableRows:'multiple',
    selectableRowsOnClick:true,
    selectableRowsHideCheckboxes:true
}
export  const DataTable =() => {
    return(
        <>
            <MUIDataTable
            title={"Users"}
            columns={Columns}
            data={users}
            options={Option} />
        </>
    )
}