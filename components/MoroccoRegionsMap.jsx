// MoroccoRegionsMap.jsx
'use client';
import React, { useState } from 'react';
//import './MoroccoRegionsMap.css';

const MoroccoRegionsMap = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const regions = [
    {
      id: 1,
      name: "Tanger-Tétouan-Al Hoceïma",
      capital: "Tanger",
      population: "3.6 million",
      area: "11,570 km²",
      color: "#4CAF50"
    },
    {
      id: 2,
      name: "Oriental",
      capital: "Oujda",
      population: "2.3 million",
      area: "90,127 km²",
      color: "#2196F3"
    },
    {
      id: 3,
      name: "Fès-Meknès",
      capital: "Fès",
      population: "4.2 million",
      area: "40,075 km²",
      color: "#FF9800"
    },
    {
      id: 4,
      name: "Rabat-Salé-Kénitra",
      capital: "Rabat",
      population: "4.6 million",
      area: "18,194 km²",
      color: "#9C27B0"
    },
    {
      id: 5,
      name: "Beni Mellal-Khenifra",
      capital: "Beni Mellal",
      population: "2.5 million",
      area: "41,033 km²",
      color: "#795548"
    },
    {
      id: 6,
      name: "Casablanca-Settat",
      capital: "Casablanca",
      population: "6.9 million",
      area: "20,166 km²",
      color: "#F44336"
    },
    {
      id: 7,
      name: "Marrakech-Safi",
      capital: "Marrakech",
      population: "4.5 million",
      area: "39,167 km²",
      color: "#E91E63"
    },
    {
      id: 8,
      name: "Drâa-Tafilalet",
      capital: "Errachidia",
      population: "1.6 million",
      area: "88,836 km²",
      color: "#607D8B"
    },
    {
      id: 9,
      name: "Souss-Massa",
      capital: "Agadir",
      population: "2.7 million",
      area: "51,642 km²",
      color: "#009688"
    },
    {
      id: 10,
      name: "Guelmim-Oued Noun",
      capital: "Guelmim",
      population: "0.4 million",
      area: "64,473 km²",
      color: "#8BC34A"
    },
    {
      id: 11,
      name: "Laâyoune-Sakia El Hamra",
      capital: "Laâyoune",
      population: "0.4 million",
      area: "140,018 km²",
      color: "#FFC107"
    },
    {
      id: 12,
      name: "Dakhla-Oued Ed-Dahab",
      capital: "Dakhla",
      population: "0.1 million",
      area: "142,865 km²",
      color: "#00BCD4"
    }
  ];

  const handleRegionHover = (region, event) => {
    setActiveRegion(region);
    const svgElement = event.currentTarget.closest('svg');
    const point = svgElement.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformedPoint = point.matrixTransform(svgElement.getScreenCTM().inverse());
    setTooltipPosition({ x: transformedPoint.x, y: transformedPoint.y });
  };

  const handleRegionLeave = () => {
    setActiveRegion(null);
  };

  return (
    <div className="morocco-map-container">
      <h1>Interactive Map of Morocco's Regions</h1>
      
      <div className="map-wrapper">
        <svg 
          viewBox="0 0 800 800" 
          className="morocco-map"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect width="100%" height="100%" fill="#e8f4f8" />
          
          {/* Region paths - simplified representations */}
          <g className="regions-group">
            {/* Region 1: Tanger-Tétouan-Al Hoceïma - Northern coastal region */}
            <path
              className="region"
              d="M150,100 L250,80 L300,120 L280,180 L200,160 L150,140 Z"
              fill={regions[0].color}
              onMouseEnter={(e) => handleRegionHover(regions[0], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 2: Oriental - Eastern region */}
            <path
              className="region"
              d="M400,80 L500,60 L550,120 L520,200 L450,180 L400,150 Z"
              fill={regions[1].color}
              onMouseEnter={(e) => handleRegionHover(regions[1], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 3: Fès-Meknès - Central north */}
            <path
              className="region"
              d="M250,150 L350,130 L400,180 L380,250 L300,230 L250,200 Z"
              fill={regions[2].color}
              onMouseEnter={(e) => handleRegionHover(regions[2], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 4: Rabat-Salé-Kénitra - Northwestern coastal */}
            <path
              className="region"
              d="M100,200 L200,180 L250,220 L230,280 L150,260 L100,240 Z"
              fill={regions[3].color}
              onMouseEnter={(e) => handleRegionHover(regions[3], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 5: Beni Mellal-Khenifra - Central */}
            <path
              className="region"
              d="M200,250 L300,230 L350,280 L330,350 L250,330 L200,300 Z"
              fill={regions[4].color}
              onMouseEnter={(e) => handleRegionHover(regions[4], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 6: Casablanca-Settat - Western coastal */}
            <path
              className="region"
              d="M100,300 L180,280 L230,320 L210,380 L130,360 L100,340 Z"
              fill={regions[5].color}
              onMouseEnter={(e) => handleRegionHover(regions[5], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 7: Marrakech-Safi - Southwestern */}
            <path
              className="region"
              d="M100,400 L200,380 L250,420 L230,480 L150,460 L100,440 Z"
              fill={regions[6].color}
              onMouseEnter={(e) => handleRegionHover(regions[6], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 8: Drâa-Tafilalet - Southeastern */}
            <path
              className="region"
              d="M350,350 L450,330 L500,380 L480,450 L400,430 L350,400 Z"
              fill={regions[7].color}
              onMouseEnter={(e) => handleRegionHover(regions[7], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 9: Souss-Massa - Southern coastal */}
            <path
              className="region"
              d="M150,500 L250,480 L300,520 L280,580 L200,560 L150,540 Z"
              fill={regions[8].color}
              onMouseEnter={(e) => handleRegionHover(regions[8], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 10: Guelmim-Oued Noun - Southern */}
            <path
              className="region"
              d="M100,600 L200,580 L250,620 L230,680 L150,660 L100,640 Z"
              fill={regions[9].color}
              onMouseEnter={(e) => handleRegionHover(regions[9], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 11: Laâyoune-Sakia El Hamra - Southern */}
            <path
              className="region"
              d="M50,650 L120,630 L170,670 L150,730 L80,710 L50,690 Z"
              fill={regions[10].color}
              onMouseEnter={(e) => handleRegionHover(regions[10], e)}
              onMouseLeave={handleRegionLeave}
            />
            
            {/* Region 12: Dakhla-Oued Ed-Dahab - Southernmost */}
            <path
              className="region"
              d="M30,700 L80,680 L120,720 L100,760 L50,740 L30,720 Z"
              fill={regions[11].color}
              onMouseEnter={(e) => handleRegionHover(regions[11], e)}
              onMouseLeave={handleRegionLeave}
            />
          </g>

          {/* Region labels */}
          <g className="region-labels">
            {regions.map((region, index) => (
              <text
                key={region.id}
                x={150 + (index % 4) * 180}
                y={120 + Math.floor(index / 4) * 160}
                className="region-label"
                fill="#333"
                textAnchor="middle"
                fontSize="12"
              >
                {region.id}
              </text>
            ))}
          </g>

          {/* Tooltip */}
          {activeRegion && (
            <g className="tooltip">
              <rect
                x={tooltipPosition.x - 100}
                y={tooltipPosition.y - 60}
                width="200"
                height="50"
                rx="5"
                fill="rgba(0, 0, 0, 0.8)"
              />
              <text
                x={tooltipPosition.x}
                y={tooltipPosition.y - 40}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {activeRegion.name}
              </text>
              <text
                x={tooltipPosition.x}
                y={tooltipPosition.y - 20}
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Capital: {activeRegion.capital}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Information Panel */}
      <div className="info-panel">
        <h2>Morocco Regions Information</h2>
        {activeRegion ? (
          <div className="region-info">
            <h3 style={{ color: activeRegion.color }}>{activeRegion.name}</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Capital:</strong> {activeRegion.capital}
              </div>
              <div className="info-item">
                <strong>Population:</strong> {activeRegion.population}
              </div>
              <div className="info-item">
                <strong>Area:</strong> {activeRegion.area}
              </div>
              <div className="info-item">
                <strong>Region ID:</strong> {activeRegion.id}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-selection">
            <p>Hover over any region to see details</p>
            <div className="legend">
              <h4>Regions Legend:</h4>
              <div className="legend-items">
                {regions.map(region => (
                  <div key={region.id} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: region.color }}
                    ></div>
                    <span>{region.id}. {region.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoroccoRegionsMap;