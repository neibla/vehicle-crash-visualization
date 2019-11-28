import React from "react";
import { Table } from "antd";

const hoverViewColumns = [
  "year",
  "severity",
  "minorInjuries",
  "seriousInjuries",
  "fatalities"
].map(field => ({
  title: field,
  label: field,
  dataIndex: field
}));

export default function({ hoveredData }) {
  if (!hoveredData) {
    return null;
  }
  const { x, y, data } = hoveredData;

  return (
    <div
      className="tooltip"
      style={{
        position: "absolute",
        zIndex: 1,
        backgroundColor: "#FFFFFF",
        pointerEvents: "none",
        left: x,
        top: y
      }}
    >
      <h4 style={{ margin: "5px" }}>
        {`${data.length} Crash${data.length > 1 ? "es" : ""}`}
      </h4>
      <button>Click to expand</button>
      <Table
        key="crashDataTable"
        dataSource={data}
        columns={hoverViewColumns}
        pagination={false}
      />
    </div>
  );
}
