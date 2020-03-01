import React, { useState } from "react";
import {
  StaticMap,
  _MapContext as MapContext,
  NavigationControl
} from "react-map-gl";

import DeckGL from "@deck.gl/react";
import { Modal } from "antd";

import HoveredData from "./HoveredData";
import CrashDataTable from "./CrashDataTable";
import mapLayers from "./mapLayers";

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

export default ({ data, mapControls }) => {
  const [hovered, setHovered] = useState(null);

  const onHover = ({ x, y, object }) => {
    if (!object) {
      setHovered(null);
      return;
    }
    // get from points if sourced from hexagon layer
    const data = object.points || [object];

    const fields = Object.keys(data[0]);

    setHovered({ x, y, data, fields });
  };

  return (
    <div>
      <DeckGL
        layers={mapLayers(data, mapControls, onHover)}
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
                style: { float: "left" }
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
