import React from "react";
import { Modal } from "antd";

const LinkListItem = ({ link, text }) => (
  <a href={link}>
    <li>{text || link}</li>
  </a>
);

export default () => {
  Modal.info({
    title: "Vehicle Crashes - NZ",
    width: "800px",
    style: { top: 20 },
    maskClosable: true,
    content: (
      <div>
        <h3>Background</h3>
        <p>
          Being able to analyse crash sites and statistics is important as{" "}
          <a href="https://www.transport.govt.nz/mot-resources/road-safety-resources/roadcrashstatistics/social-cost-of-road-crashes-and-injuries/report-overview/">
            motor vehicle crashes are a major cause of premature deaths in New
            Zealand
          </a>
          , as well as contributing to a significant{" "}
          <a href="http://archive.stats.govt.nz/browse_for_stats/snapshots-of-nz/nz-social-indicators/Home/Individual%20safety%20and%20security/m-v-casualties.aspx">
            social cost at an estimated $4.8 billion over the 2017 period.
          </a>
        </p>
        <p>
          The purpose of this map is to improve visual analysis of crash sites
          for identifying key issues on our road networks.
        </p>
        <p>
          Only vehicle crashes involving at least 1 minor injury were included
          with this map at this time.
        </p>
        <h3>Source Code</h3>
        <ul>
          <LinkListItem
            link="https://github.com/neibla/vehicle-crash-visualization"
            text="map"
          />
          <LinkListItem
            link="https://github.com/neibla/nz-crash-data"
            text="data"
          />
        </ul>
        <h3>Credits</h3>

        <h4>Data Visualization</h4>
        <ul>
          {[
            "https://github.com/uber/deck.gl",
            "https://eng.uber.com/h3/",
            "https://deck.gl/#/examples/core-layers/hexagon-layer"
          ].map(item => (
            <LinkListItem link={item} />
          ))}
        </ul>
        <h4>Map</h4>
        <ul>
          <LinkListItem link="https://mapbox.com" />
        </ul>
        <h4>Data Sources</h4>
        <ul>
          <LinkListItem link="https://opendata-nzta.opendata.arcgis.com/datasets/crash-analysis-system-cas-data" />
        </ul>
        <h4>Related Work</h4>
        <ul>
          <LinkListItem link="https://maphub.nzta.govt.nz/cas/" />
        </ul>
      </div>
    ),
    onOk() {}
  });
};
