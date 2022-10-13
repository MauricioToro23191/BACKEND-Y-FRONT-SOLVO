import React, { useEffect, useState } from "react";
import "../styles/Companies.scss";
import CardSite from "../Component/CardSite";
import { InputLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

export default function Companies() {

  const a = Math.max()
  const listCompany = [
    {
      name: "Cyracom",
      Cities: {
        city1: "Medellin",
        city2: "Barranquilla",
        city3: "Cali",
      },
    },
    {
      name: "Urgently",
      Cities: {
        city1: "Medellin",
        city2: "Barranquilla",
      },
    },
    {
      name: "Emed",
      Cities: {
        city1: "Cordoba",
        city2: "Cartagena",
      },
    },
    {
      name: "FlyGroup",
      Cities: {
        city1: "Medellin",
        city2: "Barranquilla",
      },
    },
  ];

  const listSites = [
    {
      city: "Medellin",
      sites: {
        site1: "Murano",
        site2: "Talsa",
        site3: "Astorga",
      },
    },
    {
      city: "Barranquilla",
      sites: {
        site1: "Milla de oro",
        site2: "Plaza X",
        site3: "Lugar X",
        site4: "Milla de oro",
        site5: "Plaza X",
        site6: "Lugar X",
        site7: "Lugar X",
        site8: "Lugar X",
        site9: "Lugar X",
      },
    },
    {
      city: "Cordoba",
      sites: {
        site1: "Milla de oro",
        site2: "Plaza X",
      },
    },
  ];

  const [CitiesS, setCities] = useState([]);
  const [companySelected, setcompany] = useState();
  const [SitesS, setSites] = useState([]);
  const [Aument, setAument] = useState(0);
  const handleChange = (valor) => {
    let ObCities = {};
    listCompany.map((v) => {
      if (v.name === valor) {
        ObCities = v.Cities;
      }
    });
    let claves = Object.values(ObCities);
    setCities(claves);
    setAument(0);
  };

  useEffect(() => {
    let ObSites = {};
    listSites.find((v) => {
      if (v.city === CitiesS[Aument]) {
        ObSites = v.sites;
      }
    });
    let claves = Object.values(ObSites);
    setSites(claves);
  }, [CitiesS, Aument]);
  return (
    <>
      <div className="contenedor">
        <div className="options">
          <FormControl variant="standard" sx={{ m: 2, minWidth: 120 }}>
            <InputLabel>Company</InputLabel>
            <Select
              value={companySelected}
              onChange={(e) => handleChange(e.target.value)}
              label="Company"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {listCompany.map((company) => {
                return (
                  <MenuItem value={company.name}> {company.name} </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="showComponent">
          <div className="SideUp">
            <button
              className="btnComponent left"
              onClick={() => {
                if (Aument <= 0) {
                  setAument(CitiesS.length - 1);
                } else {
                  setAument((count) => count - 1);
                }
              }}
            ></button>
            <div className="title">{CitiesS[Aument]}</div>

            <button
              className="btnComponent right"
              onClick={() => {
                if (Aument >= CitiesS.length - 1) {
                  setAument(0);
                } else {
                  setAument((count) => count + 1);
                }
              }}
            ></button>
          </div>
          <div className="Cards">
            {SitesS.map((v) => {
              return <CardSite name={v} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
