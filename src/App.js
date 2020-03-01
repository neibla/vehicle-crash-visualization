import React from "react";

import Map from "./map/Map";
import { Spin, Drawer } from "antd";
import { HelpCircle as HelpIcon } from "react-feather";

import showAboutModal from "./showAboutModal";
import controlDefinitions from "./controls/controlDefinitions.json";
import useControls from "./controls/Controls";
import useCrashData from "./data/useCrashData";
import "./App.css";

export default () => {
  const [{ dataControls, mapControls }, controlPanel] = useControls(
    controlDefinitions
  );
  const { data, loading, error } = useCrashData(dataControls);

  if (error) {
    return "Unexpected error loading data.";
  }
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "80vh",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <h1>Loading 200k+ crashes... </h1>
        <Spin size="large" />
      </div>
    );
  }

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
          {`${data.length.toLocaleString()} Crashes`}{" "}
          <HelpIcon
            onClick={() => showAboutModal()}
            cursor="pointer"
            style={{ verticalAlign: "middle" }}
          />
        </h2>
        {controlPanel}
      </Drawer>
      <Map data={data} mapControls={mapControls} />
    </div>
  );
};
