import MUIDataTable from "mui-datatables";
import Data from "../Dates/UsersTable.json"

const Columns = ["SolID", "Name", "LastN", "Email", "Perfil", "Supervisor", "Location"]

const Option = {
    download: false,
    filterType: "multiselect",
    print: false,
    searchPlaceholder: "Search..",
    selectableRows: 'multiple',
    selectableRowsOnClick: true,
    selectableRowsHideCheckboxes: true,
    responsive: "standard"
}
export const DataTable = (props) => {
    const {listUser}=props
    return (
        <>
            <div className="contTable">
                <MUIDataTable
                    title={"Users"}
                    columns={Columns}
                    data={listUser}
                    options={Option} />
            </div>
        </>
    )
}