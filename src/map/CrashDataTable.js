import React from "react";
import { Table } from "antd";
import { CSVLink } from "react-csv";
import "./CrashDataTable.css";

const googleMapsLink = ({ latitude, longitude }) =>
  `http://maps.google.com/maps?q=loc:${longitude},${latitude}`;

// yup
const nztaDataLink = ({ id }) =>
  `https://opendata-nzta.opendata.arcgis.com/datasets/crash-analysis-system-cas-data/data?where=OBJECTID%20%3E%3D%20${id}%20AND%20OBJECTID%20%3C%3D%20${id}`;

const cellRender = field => {
  switch (field) {
    case "latitude":
      return (value, record) => <a href={googleMapsLink(record)}>{value}</a>;
    case "longitude":
      return (value, record) => <a href={googleMapsLink(record)}>{value}</a>;
    case "id":
      return (value, record) => <a href={nztaDataLink(record)}>{value}</a>;
    default:
      return null;
  }
};

export default function({ hoveredData }) {
  if (!hoveredData) {
    return null;
  }
  const { data, fields } = hoveredData;

  const columns = fields
    .filter(field => field !== "screenCoord")
    .map(field => ({
      title: field,
      label: field,
      dataIndex: field,
      key: field === "id" ? "idcolumn" : field,
      render: cellRender(field)
    }));

  return [
    <CSVLink
      key="csvDownloader"
      style={{ margin: "5px" }}
      data={data}
      headers={columns}
      filename={"crashCluster.csv"}
    >
      Download as CSV
    </CSVLink>,
    <Table
      key="crashDataTable"
      dataSource={data}
      columns={columns}
      pagination={false}
      bordered
    />
  ];
}
