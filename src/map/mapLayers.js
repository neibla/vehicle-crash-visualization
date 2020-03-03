import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";

const SITE_COLOURS = {
  FATAL: [204, 50, 50],
  SERIOUS: [219, 123, 43],
  MINOR: [45, 201, 55]
};

//color scheme taken from deck.gl sample - https://github.com/uber/deck.gl/blob/7.3-release/examples/website/3d-heatmap/app.js#L52
const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

function resolveScatterPlotColour({
  fatalities,
  seriousInjuries,
  minorInjuries
}) {
  if (fatalities > 0) {
    return SITE_COLOURS.FATAL;
  } else if (seriousInjuries > 0) {
    return SITE_COLOURS.SERIOUS;
  } else {
    return SITE_COLOURS.MINOR;
  }
}

export default function(data, controls, onHover) {
  const { hexagonRadius, showHexagons } = controls;
  const layers = [
    new ScatterplotLayer({
      id: "scatterplot",
      getPosition: d => [d.latitude, d.longitude],
      getFillColor: d => resolveScatterPlotColour(d),
      getRadius: d => 3, //5,
      opacity: 0.8,
      pickable: true,
      stroked: true,
      filled: true,
      radiusScale: 4,
      radiusMinPixels: 1,
      // radiusMaxPixels: 100,

      lineWidthMinPixels: 1,
      data,
      onHover: showHexagons ? null : onHover
    })
  ];
  if (showHexagons) {
    const hexLayer = new HexagonLayer({
      id: "heatmap",
      data,
      colorRange,
      elevationRange: [0, 2e2],
      elevationScale: 30,
      extruded: true,
      getPosition: d => [d.latitude, d.longitude],
      opacity: 1,
      pickable: Boolean(onHover),
      radius: hexagonRadius,
      onHover
    });
    layers.push(hexLayer);
  }
  return layers;
}
