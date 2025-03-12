import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection, Geometry, Feature } from "geojson";
import { countries } from "../../utils/countries";
import { exchangeRatesApi } from "../../utils/api";
import { Profile, TaxSummary } from "../../utils/taxStrategies";
import Tooltip from "../Tooltip/Tooltip";

const width = 960;
const height = 600;

interface Country {
  type: string;
  id: string;
  properties: Properties;
  geometry: CountryGeometry;
}

interface CountryGeometry {
  type: string;
  coordinates: number[][][];
}

interface Properties {
  name: string;
  taxSummary?: TaxSummary;
}

interface WorldMapProps {
  profile: Profile;
  exchangeRates: Record<string, number>;
}

const WorldMap: React.FC<WorldMapProps> = ({ profile, exchangeRates }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [geoData, setGeoData] = useState<Country[]>([]);
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (Object.keys(exchangeRates).length === 0) return;

    d3.json("/countries-110m.json")
      .then((topoData: any) => {
        const featureCollection = topojson.feature(
          topoData,
          topoData.objects.countries
        ) as unknown as FeatureCollection<Geometry>;

        const updatedGeoData: Country[] = featureCollection.features.map(
          (feature) => {
            if (!feature.properties) {
              return { ...feature, properties: { name: "Unknown" } } as Country;
            }

            const countryName = feature.properties.name;
            const taxStrategy = countries[countryName];
            if (taxStrategy) {
              const taxResult = taxStrategy(profile, exchangeRates);
              feature.properties.taxSummary = taxResult;
            } else {
              console.warn(`No tax strategy found for ${countryName}`);
            }
            return feature as Country;
          }
        );

        setGeoData(updatedGeoData);
      })
      .catch((err) => console.error("Error loading geographic data", err));
  }, [exchangeRates, profile]);

  useEffect(() => {
    if (!geoData.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const projection = d3
      .geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);
    const path = d3.geoPath().projection(projection);
    const colorScale = d3
      .scaleSequential(d3.interpolateRgb("#96d363", "#b80707"))
      .domain([0, 0.8]);

    svg
      .selectAll(".country")
      .data(geoData)
      .join("path")
      .attr("class", "country")
      .attr("d", path as any)
      .attr("fill", (d: Country) => {
        const value = d.properties.taxSummary?.percentage;
        return value === undefined ? "#d3d1d1" : colorScale(value);
      })
      .on("mouseover", function (event, feature) {
        const { name, taxSummary } = feature.properties;
        const rate = taxSummary?.percentage
          ? (taxSummary.percentage * 100).toFixed(2) + "%*"
          : "No data";
        const noticeText = taxSummary?.notice || "";
        const link = taxSummary?.link
          ? `<a href="${taxSummary.link}" target="_blank">More details...</a>`
          : "";

        const container = svgRef.current?.parentElement;
        const containerRect = container?.getBoundingClientRect();

        setTooltip({
          content: `${name}<br/>Tax Rate: ${rate}<br/>${noticeText}<br/>${link}`,
          x: event.clientX - (containerRect?.left ?? 0),
          y: event.clientY - (containerRect?.top ?? 0),
        });
        d3.select(this).classed("hovered", true);
      })
      .on("mousemove", function (event) {
        const container = svgRef.current?.parentElement;
        const containerRect = container?.getBoundingClientRect();

        setTooltip((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            x: event.clientX - (containerRect?.left ?? 0),
            y: event.clientY - (containerRect?.top ?? 0),
          };
        });
      })
      .on("mouseout", function (event, feature) {
        const relatedTarget = event.relatedTarget as HTMLElement | null;

        if (
          relatedTarget &&
          (relatedTarget.closest(".tooltip") ||
            relatedTarget.classList.contains("country"))
        ) {
          return;
        }

        setTimeout(() => {
          const tooltipElement = document.getElementById("tooltip");
          if (tooltipElement && tooltipElement.matches(":hover")) {
            return;
          }
          setTooltip(null);
          d3.select(this).classed("hovered", false);
        }, 300);
      });
  }, [geoData]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} width={width} height={height}></svg>
      {tooltip && <Tooltip {...tooltip} setTooltip={setTooltip} />}
    </div>
  );
};

export default WorldMap;
