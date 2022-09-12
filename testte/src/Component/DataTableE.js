import MUIDataTable from "mui-datatables";
import users from '../Dates/rtaTime.json';
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React,{useState} from "react";
import "../styles/tableUsers.scss"



class DataTableE extends React.Component{
    render(){
        const {Name}=this.props 
        const {Columns}=this.props
        const {Title}=this.props
        const Option = {
            download: true,
            ilter: true,
            filterType: "multiselect",
            print: false,
            searchPlaceholder: "Search..",
            selectableRows: 'multiple',
            selectableRowsOnClick: true,
            selectableRowsHideCheckboxes: true,
            responsive: "standard",
            fixedHeader: false,
            enableNestedDataAccess : ',',
            downloadOptions: {
                filename: 'SOLVO_RTA_REPORT.csv',
                separator: ',',
                filterOptions: {
                    useDisplayedColumnsOnly: true,
                    useDisplayedRowsOnly: true,
                }
            },
            customToolbar: () => {
                return (
                    <CustomToolbar />
                )
            }
        }
        
        const defaultToolStyle = {
            IconButton: {
        
            },
        };
        
        const CustomToolbar = () => {
            const handleclick = () => {
                modal();
            }
//            <IconButton className={defaultToolStyle.IconButton} onClick={handleclick}>

        
            return (
                <React.Fragment>
                    <Tooltip title={"Custom Icon"}>
                        <IconButton onClick={handleclick}>
                         
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
            )
        }
        
        function close() {
            var modal = document.getElementById("Mymodal");
            var body = document.getElementsByTagName("body")[0];
            modal.style.display = "none";
            body.style.position = "inherit";
            body.style.height = "auto";
            body.style.overflow = "visible";
        }
        function modal() {
            var modal = document.getElementById("Mymodal");
            var body = document.getElementsByTagName("body")[0];
            modal.style.display = "block";
            body.style.position = "static";
            body.style.height = "100%";
            body.style.overflow = "hidden";
        }
        
    return (
        <>
            <div id="Mymodal" className="modalcont">
                <div id="modal-cont">
                    <div id="contm">
                        <div className="sideRi">
                            <button className="buttonClose" onClick={close} >hola</button>
                        </div>
                        <div className="sideLe">
                            <form action="">
                                <label >SoLvoID</label>
                                <input type="text" name="SolID" id="SolID" className="inputs" />
                                <label >First Name</label>
                                <input type="text" name="firstNAme" id="firstName" className="inputs" />
                                <label >Last Name</label>
                                <input type="text" name="lastName" id="lastName" className="inputs" />
                                <label >Email</label>
                                <input type="email" name="corpEmail" id="CorpEmail" className="inputs" />
                                <label >Perfil</label>
                                <select name="Perfil" id="perfil" className="inputs">
                                    <option value="">-</option>
                                    <option value="">Interpreter</option>
                                    <option value="">Supervisor</option>
                                    <option value="">Team Leader</option>
                                    <option value="">Administrador</option>
                                </select>

                                <label >Supervisor</label>
                                <select name="supervisor" id="supervisor" className="inputs">
                                    <option value="">N/A</option>
                                    <option value="">Opcion1</option>
                                    <option value="">Opcion2</option>
                                    <option value="">Opcion3</option>
                                </select>
                                <label>Account</label>
                                <select name="account" id="account" className="inputs">
                                    <option value="-">-</option>
                                    <option value="">Cyracom</option>
                                    <option value="">Urgently</option>
                                    <option value="">Emed</option>
                                </select>
                                <a href="#company" className="inputs">do you want add another account?</a>
                                <label >Locaction</label>
                                <select name="location" id="location" className="inputs">
                                    <option value="">-</option>
                                    <option value="">Opcion A</option>
                                    <option value="">Opcion B</option>
                                </select>
                                <input type="button" value="ADD" name="add" id="add" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <MUIDataTable
                title={"Export " + Title}
                columns={Columns}
                data={Name.listRTS}
                options={Option} />
        </>
    )}
}

export default DataTableE;