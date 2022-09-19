import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Tooltip, Button, Popper, Box } from "@mui/material";
import subDays from "date-fns/subDays";
import "../styles/tableUsers.scss";
import "react-datepicker/dist/react-datepicker.css";

export default function DateRange(props) {
  const {show}=props
  const [anchorEl, setAnchorEl] = useState(null);
  const [startDate, setStartDate] = useState(new Date(sessionStorage.getItem('startDate')));
  const [endDate, setEndDate] = useState(new Date(sessionStorage.getItem('endDate')));

  const handleClick = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleYesterday = () =>{
    setStartDate(subDays(new Date(),1))
    sessionStorage.setItem('startDate',subDays(new Date(),1))
    setEndDate(subDays(new Date(),1))
    sessionStorage.setItem('endDate',subDays(new Date(),1))

  }

  const handleLastWeek = () =>{
    setStartDate(subDays(new Date(),6))
    sessionStorage.setItem('startDate',subDays(new Date(),6))
    setEndDate(new Date(Date.now()))
    sessionStorage.setItem('endDate',new Date(Date.now()))

  }

  const handleLastMonth = () =>{
    setStartDate(subDays(new Date(),29))
    sessionStorage.setItem('startDate',subDays(new Date(),29))
    setEndDate(new Date(Date.now()))
    sessionStorage.setItem('endDate',new Date(Date.now()))
  }
  const handleLast3Month = () =>{
    setStartDate(subDays(new Date(),89))
    sessionStorage.setItem('startDate',subDays(new Date(),89))
    setEndDate(new Date(Date.now()))
    sessionStorage.setItem('endDate',new Date(Date.now()))
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const estilosTest = {
    display: "grid",
    gridTemplateColumns: "40% 40% 15%",
    woidth: "100%",
  };


  const DateStyle = {
    width: "50%",
    padding: "8px",
    fontSize: "1rem",
    backgroundColor: "#585858",
    color: "white",
    border: "solid 1px black",
    borderRadius: "8px",
    cursor: "pointer",
    display:"inline-block"

  };

  const btnDates = {
    gridColumn: "3/4",
    height: "100%",
    margin: "0",
    padding: "0",
    display: "grid",
    justifyItems: "stretch",
    marginLeft: "30%",
    width: "100%",

  };

  const ButtonDates = {
    cursor: "pointer",
    backgroundColor: "#0061AD",
    color: "white",
    fontFamily: "'Roboto Slab', serif",
    border: "solid 1px white",
    borderRadius: "5px",
    backgroundColor:"#F26100"


  }
  return (
    <>
      <div style={{display:"inline-flex",width:"70%"}}>
        <button
          aria-describedby={id}
          type="button"
          onClick={handleClick}
          style={DateStyle}
        >
            {startDate.toLocaleDateString()}{!show ? "-"+ endDate.toLocaleDateString():" "}
        </button>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
            <div style={estilosTest}>
              <div style={{ gridColum: "1/2" }}onClick={handleClick}>
                <DatePicker
                  selected={new Date(sessionStorage.getItem('startDate'))}
                  onChange={(date) => {setStartDate(date),sessionStorage.setItem('startDate',date)}}
                  selectsStart
                  startDate={startDate}
                  minDate={subDays(new Date(), 90)}
                  maxDate={new Date(Date.now())}
                  inline
                />
              </div>
              {show ? 
                (
                  <div></div>
                ) : 
                (
                  <div style={{ gridColumn: "2/3", marginLeft: "5%" }} onClick={handleClick} >
                      <DatePicker
                        selected={new Date(sessionStorage.getItem('endDate'))}
                        onChange={(date) => {setEndDate(date),sessionStorage.setItem('endDate',date)}}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={subDays(new Date(), 90)}
                        maxDate={new Date(Date.now())}
                        inline
                      />
                  </div>
                  
                )
              }
              {show ? 
                (
                  <div style={btnDates}><button style={ButtonDates} onClick={handleYesterday}>Yesterday</button></div>
                ) : 
                (
                  <div style={btnDates}>
                    <button style={ButtonDates} onClick={handleYesterday}>Yesterday</button>
                    <button style={ButtonDates} onClick={handleLastWeek}>Last Week</button>
                    <button style={ButtonDates} onClick={handleLastMonth}>Last Month</button>
                    <button style={ButtonDates} onClick={handleLast3Month}>Last 3 Months</button>
                  </div>
                )}
              
            </div>
          </Box>
        </Popper>
      </div>
    </>
  );
}