import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection, Geometry, Feature } from "geojson";
import { countries } from "../../utils/countries";
import { exchangeRatesApi } from "../../utils/api";
import { Profile, TaxSummary } from "../../utils/taxStrategies";
import Tooltip from "../Tooltip/Tooltip";
import "./WorldMap.css";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [geoData, setGeoData] = useState<Country[]>([]);
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehavior = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const projection = useRef(d3.geoMercator());
  const path = useRef(d3.geoPath().projection(projection.current));
  
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
  
    const { width, height } = svgRef.current.getBoundingClientRect();

    projection.current.fitSize(
      [width, height],
      {
        type: "FeatureCollection",
        features: geoData,
      } as FeatureCollection<Geometry>
    );
    const colorScale = d3
    .scaleSequential(d3.interpolateRgb("#96d363", "#b80707"))
    .domain([0, 0.8]);
    
    const g = svg.select("g");
    const geoPath = path.current;

    g.selectAll(".country")
      .data(geoData)
      .join("path")
      .attr("class", "country")
      .attr("d", geoPath as any)
      .attr("fill", (d: Country) => {
        const value = d.properties.taxSummary?.percentage;
        return value === undefined ? "#d3d1d1" : colorScale(value);
      })
      .on("mouseover", function (event, feature) {
        const { name, taxSummary } = feature.properties;
        const noticeText = taxSummary?.notice || "";
        const rate = taxSummary?.percentage
          ? (taxSummary.percentage * 100).toFixed(2) + "%*"
          : "";
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

      const bounds = geoPath.bounds({
        type: "FeatureCollection",
        features: geoData,
      } as FeatureCollection<Geometry>);
      
      const [[x0, y0], [x1, y1]] = geoPath.bounds({
        type: "FeatureCollection",
        features: geoData,
      } as FeatureCollection<Geometry>);
      
      zoomBehavior.current = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .translateExtent([
          [x0, y0],
          [x1, y1],
        ])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
          setIsZoomed(event.transform.k !== 1);
        });

      svg.call(zoomBehavior.current);
  }, [geoData]);
  
  const resetZoom = () => {
    if (!svgRef.current || !zoomBehavior.current) return;
  
    const svg = d3.select(svgRef.current);
    const g = svg.select("g");
    const { width, height } = svgRef.current.getBoundingClientRect();

    projection.current.fitSize([width, height], {
      type: "FeatureCollection",
      features: geoData,
    } as FeatureCollection<Geometry>); 

    g.selectAll(".country")
      .attr("d", path.current as any);

    svg.transition()
      .duration(500)
      .call(zoomBehavior.current.transform, d3.zoomIdentity);
  
    setIsZoomed(false);
  };

  const zoomStep = (scaleFactor: number) => {
    if (!svgRef.current || !zoomBehavior.current) return;
  
    const svg = d3.select(svgRef.current);
    const { width, height } = svgRef.current.getBoundingClientRect();
    const center = [width / 2, height / 2];

    svg.transition()
      .duration(500)
      .call(zoomBehavior.current.scaleBy, scaleFactor, center);
};
  
  useEffect(() => {
    const handleResize = () => {
      resetZoom();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);  

  return (
    <div className="map-container">
      <svg
          ref={svgRef}
          width="100%"
          height="120%"
          preserveAspectRatio="xMidYMid meet"
        >
          <g></g>
        </svg>
        <div className="zoom-controls">
          <button onClick={() => zoomStep(1.2)}>+</button>
          <button onClick={() => zoomStep(1 / 1.2)}>–</button>
            {isZoomed ? (
              <button className="reset-zoom-button" onClick={resetZoom}>
                Reset Zoom
              </button>
            ) : (
              <div className="reset-zoom-placeholder"></div>
            )}
        </div>
      {tooltip && <Tooltip {...tooltip} setTooltip={setTooltip} />}
    </div>
  );
};

export default WorldMap;
