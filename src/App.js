import React, { useState, useEffect, useMemo } from "react";
import {
  StaticMap,
  _MapContext as MapContext,
  NavigationControl
} from "react-map-gl";

import DeckGL from "@deck.gl/react";
import { Spin, Drawer, Modal } from "antd";
import { HelpCircle as HelpIcon } from "react-feather";
import axios from "axios";

import showAboutModal from "./showAboutModal";
import HoveredData from "./HoveredData";
import CrashDataTable from "./CrashDataTable";
import mapLayers from "./mapLayers";
import controlDefinitions from "./controlDefinitions.json";
import useControls from "./Controls";
import "./App.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MapboxAcessToken;

const INITIAL_VIEW_STATE = {
  longitude: 174.88,
  latitude: -40.9,
  zoom: 6,
  minZoom: 5,
  maxZoom: 18,
  pitch: 40,
  bearing: -30,
  width: window.innerWidth,
  height: window.innerHeight
};

function includeCrash(crash, controls) {
  const {
    showFatalCrashes,
    showSeriousCrashes,
    showMinorCrashes,
    onlyShowHolidayCrashes,
    yearRange: [startYear, endYear],
    crashInvolvement
  } = controls;
  const { fatalities, seriousInjuries, minorInjuries } = crash;
  if (crash.year < startYear) {
    return false;
  } else if (crash.year > endYear) {
    return false;
  } else if (onlyShowHolidayCrashes && !crash.holiday) {
    return false;
  } else if (crashInvolvement !== "all" && !crash[crashInvolvement]) {
    return false;
  } else if (showFatalCrashes && fatalities > 0) {
    return true;
  } else if (showSeriousCrashes && seriousInjuries > 0) {
    return true;
  } else if (showMinorCrashes && minorInjuries > 0) {
    return true;
  } else {
    return false;
  }
}

export default () => {
  const [data, setData] = useState(null);
  const [{ dataControls, mapControls }, controlPanel] = useControls(
    controlDefinitions
  );
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_DATA_URL, {})
      .then(response => setData(response.data));
  }, []);
  const filteredData = useMemo(
    () => data && data.filter(crash => includeCrash(crash, dataControls)),
    [dataControls, data]
  );
  if (data == null) {
    return (
      <Spin
        size="large"
        style={{ top: "50%", left: "50%", position: "absolute" }}
      />
    );
  }

  const onHover = ({ x, y, object }) => {
    if (!object) {
      setHovered(null);
      return;
    }
    // get from points if sourced from hexagon layer
    const data = object.points || [object];

    // ignoring screenCoord
    const ignoredFields = new Set(["screenCoord"]);

    // Extracting field names
    // (default valued fields missing cos should've used csv...)
    const fields = Array.from(
      data.reduce((accumulator, row) => {
        // reducing row fields
        Object.keys(row).reduce((accumulator, field) => {
          if (!ignoredFields.has(field)) {
            accumulator.add(field);
          }
          return accumulator;
        }, accumulator);
        return accumulator;
      }, new Set())
    );

    setHovered({ x, y, data, fields });
  };

  return (
    <div>
      <Drawer
        title=""
        placement="left"
        closable={false}
        mask={false}
        visible={true}
        width={300}
      >
        <h2>
          {`${filteredData.length.toLocaleString()} Crashes`}{" "}
          <HelpIcon
            onClick={() => showAboutModal()}
            cursor="pointer"
            style={{ verticalAlign: "middle" }}
          />
        </h2>
        {controlPanel}
      </Drawer>

      <DeckGL
        layers={mapLayers(filteredData, mapControls, onHover)}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        ContextProvider={MapContext.Provider}
        onClick={() => {
          if (hovered && hovered.data) {
            Modal.info({
              title: `${hovered.data.length} Crash${
                data.length > 1 ? "es" : ""
              }`,
              autoFocusButton: null,
              maskClosable: true,
              width: "1200px",
              okButtonProps: {
                style: {float: "left"}
              },
              content: (
                <div style={{ overflow: "auto" }}>
                  <CrashDataTable hoveredData={hovered} relativeView={true} />
                </div>
              )
            });
          }
        }}
      >
        <StaticMap
          width="100%"
          height="100%"
          reuseMaps={true}
          mapStyle={mapControls.mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <div
            style={{ position: "absolute", right: 0, margin: 10, zIndex: 1 }}
          >
            <NavigationControl />
          </div>
        </StaticMap>
      </DeckGL>
      <HoveredData hoveredData={hovered} />
    </div>
  );
};
