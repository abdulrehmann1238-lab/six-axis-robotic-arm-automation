import React from 'react';
import { useSimulation } from '../../state/simulationContext';
import { INGREDIENTS_CATALOG } from '../../state/simulationEngine';
import { IngredientType } from '../../types';

interface DispensingVisualizerProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export const DispensingVisualizer: React.FC<DispensingVisualizerProps> = ({ 
  theme = 'light',
  className = '' 
}) => {
  const { 
    selectedIngredient, 
    measuredQuantity, 
    targetQuantity, 
    dispenseRate, 
    jarPresent, 
    dispenseAuthorized, 
    dispensingStatus,
    activeActuator,
    setSelectedIngredient
  } = useSimulation();

  const isDark = theme === 'dark';
  const isDispensing = dispensingStatus === 'DISPENSING';
  const progressRatio = Math.min(1, measuredQuantity / (targetQuantity || 1));

  const ingredientList: IngredientType[] = [
    'Tomato Sauce',
    'Cheese',
    'Olive Oil',
    'Herb Mix',
    'Seasoning'
  ];

  return (
    <div className={`relative flex flex-col rounded-xl border overflow-hidden ${
      isDark 
        ? 'bg-[#1b231e] border-[#313f36] text-gray-200' 
        : 'bg-[#F9FAF8] border-industrial-border text-industrial-text'
    } ${className}`}>
      {/* Top Status Banner */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono ${
        isDark ? 'bg-black/30 border-[#313f36]' : 'bg-industrial-bgSecondary/60 border-industrial-border'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${
            dispensingStatus === 'DISPENSING' ? 'bg-industrial-warning animate-pulse' :
            dispensingStatus === 'FAULT' ? 'bg-industrial-fault' :
            'bg-industrial-success'
          }`} />
          <span className="font-semibold tracking-wider">
            DISPENSING_SYSTEM_DS // {dispensingStatus}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>ACTUATOR: <strong className="text-industrial-accent">{activeActuator}</strong></span>
          <span>AUTH: <strong className={dispenseAuthorized ? 'text-industrial-success' : 'text-industrial-warning'}>
            {dispenseAuthorized ? 'GRANTED' : 'STANDBY'}
          </strong></span>
        </div>
      </div>

      {/* Main Dispensing Visualization SVG */}
      <div className="p-4 flex flex-col items-center">
        <svg viewBox="0 0 500 320" className="w-full max-h-[300px]">
          <defs>
            <linearGradient id="canisterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#36463D' : '#E8ECE6'} />
              <stop offset="100%" stopColor={isDark ? '#232D27' : '#CAD2C6'} />
            </linearGradient>

            <linearGradient id="fluidStream" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B45F57" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#B18A62" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 5 Ingredient Canisters at top */}
          <g>
            {ingredientList.map((ing, index) => {
              const xPos = 40 + index * 88;
              const isSelected = selectedIngredient === ing;
              const meta = INGREDIENTS_CATALOG[ing];

              return (
                <g 
                  key={ing} 
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedIngredient(ing)}
                >
                  {/* Canister Body */}
                  <rect
                    x={xPos}
                    y="25"
                    width="68"
                    height="85"
                    rx="4"
                    fill={isSelected ? (isDark ? '#2c3b31' : '#E2EBE5') : 'url(#canisterGrad)'}
                    stroke={isSelected ? '#426B5B' : (isDark ? '#47594E' : '#B8C0B4')}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                  />
                  {/* Fluid Level Bar */}
                  <rect
                    x={xPos + 6}
                    y={50 + (1 - (index === 0 ? progressRatio : 0.8)) * 50}
                    width="56"
                    height={Math.max(4, (index === 0 ? progressRatio : 0.8) * 50)}
                    rx="2"
                    fill={
                      ing === 'Tomato Sauce' ? '#B45F57' :
                      ing === 'Cheese' ? '#D6AD60' :
                      ing === 'Olive Oil' ? '#8EA99A' :
                      ing === 'Herb Mix' ? '#426B5B' : '#B18A62'
                    }
                    opacity="0.85"
                  />
                  {/* Canister Cap */}
                  <rect
                    x={xPos + 18}
                    y="16"
                    width="32"
                    height="9"
                    rx="2"
                    fill={isDark ? '#4F6156' : '#9AA696'}
                  />
                  {/* Valve Solenoid indicator */}
                  <circle
                    cx={xPos + 34}
                    cy="120"
                    r="6"
                    fill={isSelected && isDispensing ? '#56866A' : (isDark ? '#313F36' : '#D0D6CC')}
                    stroke={isDark ? '#516558' : '#8A9685'}
                  />
                  {/* Canister Label */}
                  <text
                    x={xPos + 34}
                    y="42"
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="JetBrains Mono"
                    fontWeight="600"
                    fill={isDark ? '#E5E8E2' : '#202724'}
                  >
                    {ing.slice(0, 8)}
                  </text>
                  <text
                    x={xPos + 34}
                    y="104"
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="JetBrains Mono"
                    fill={isDark ? '#8FA799' : '#6A766C'}
                  >
                    {meta.density}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Manifold Tubing System connecting to Central Dispensing Head */}
          <path
            d="M 74 126 L 74 148 L 250 162 M 162 126 L 162 152 L 250 162 M 250 126 L 250 162 M 338 126 L 338 152 L 250 162 M 426 126 L 426 148 L 250 162"
            fill="none"
            stroke={isDark ? '#46554B' : '#A9B3A5'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Central Dispensing Nozzle Head */}
          <g transform="translate(230, 162)">
            <rect
              x="0"
              y="0"
              width="40"
              height="24"
              rx="3"
              fill={isDark ? '#3C4D42' : '#D2D8CE'}
              stroke="#426B5B"
              strokeWidth="1.5"
            />
            {/* Nozzle Tip */}
            <polygon
              points="12,24 28,24 23,38 17,38"
              fill={isDark ? '#5C7465' : '#849380'}
            />
          </g>

          {/* Dispensing Stream when active */}
          {isDispensing && (
            <g>
              <line
                x1="250"
                y1="200"
                x2="250"
                y2="245"
                stroke="url(#fluidStream)"
                strokeWidth="4"
                strokeDasharray="4 2"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <circle cx="250" cy="225" r="3" fill="#B45F57" opacity="0.9" />
              <circle cx="250" cy="240" r="2.5" fill="#B18A62" opacity="0.9" />
            </g>
          )}

          {/* Optical Jar-Presence Sensor Beams */}
          <g transform="translate(160, 225)">
            {/* Emitter Unit */}
            <rect x="0" y="0" width="14" height="24" rx="2" fill={isDark ? '#2E3A32' : '#C2C8BE'} />
            <circle cx="7" cy="12" r="3" fill={jarPresent ? '#56866A' : '#B45F57'} />

            {/* Receiver Unit */}
            <rect x="166" y="0" width="14" height="24" rx="2" fill={isDark ? '#2E3A32' : '#C2C8BE'} />
            <circle cx="173" cy="12" r="3" fill={jarPresent ? '#56866A' : '#B45F57'} />

            {/* Light Beam */}
            <line
              x1="14"
              y1="12"
              x2="166"
              y2="12"
              stroke={jarPresent ? '#56866A' : '#B45F57'}
              strokeWidth="1.5"
              strokeDasharray={jarPresent ? '2 3' : 'none'}
              opacity={jarPresent ? '0.75' : '0.9'}
            />
            <text
              x="90"
              y="6"
              textAnchor="middle"
              fontSize="7"
              fontFamily="JetBrains Mono"
              fill={jarPresent ? '#56866A' : '#B45F57'}
            >
              {jarPresent ? 'BEAM_VERIFIED (JAR PRESENT)' : 'BEAM_BROKEN (NO JAR)'}
            </text>
          </g>

          {/* Collection Vessel / Jar on Scale */}
          {jarPresent && (
            <g transform="translate(225, 222)">
              {/* Glass Container */}
              <rect
                x="0"
                y="0"
                width="50"
                height="45"
                rx="4"
                fill={isDark ? 'rgba(74, 91, 81, 0.25)' : 'rgba(255, 255, 255, 0.7)'}
                stroke={isDark ? '#8FA799' : '#6A766C'}
                strokeWidth="1.5"
              />
              {/* Dispensed liquid filling inside jar */}
              <rect
                x="4"
                y={41 - Math.max(2, progressRatio * 35)}
                width="42"
                height={Math.max(2, progressRatio * 35)}
                rx="2"
                fill="#B45F57"
                opacity="0.85"
              />
            </g>
          )}

          {/* Precision Load Cell Digital Scale */}
          <g transform="translate(200, 270)">
            {/* Scale Weighing Pan */}
            <rect
              x="0"
              y="0"
              width="100"
              height="10"
              rx="2"
              fill={isDark ? '#46554B' : '#ACB4A7'}
            />
            {/* Scale Base Platform */}
            <rect
              x="10"
              y="10"
              width="80"
              height="24"
              rx="3"
              fill={isDark ? '#232D27' : '#334037'}
              stroke={isDark ? '#3D4C42' : '#202724'}
            />
            {/* Digital LED Display */}
            <rect
              x="20"
              y="15"
              width="60"
              height="14"
              rx="2"
              fill="#111613"
            />
            <text
              x="50"
              y="26"
              textAnchor="middle"
              fontSize="9"
              fontFamily="JetBrains Mono"
              fontWeight="bold"
              fill="#56866A"
            >
              {measuredQuantity.toFixed(1)} g
            </text>
          </g>
        </svg>

        {/* Live Scale & Flow Rate Readout Box */}
        <div className={`w-full mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono p-3 rounded-lg border ${
          isDark ? 'bg-black/25 border-[#313f36]' : 'bg-industrial-bgSecondary/70 border-industrial-border'
        }`}>
          <div>
            <div className="text-[10px] text-industrial-textMuted uppercase">Target Mass</div>
            <div className="text-base font-bold text-industrial-accent">{targetQuantity}.00 g</div>
          </div>
          <div>
            <div className="text-[10px] text-industrial-textMuted uppercase">Measured Mass</div>
            <div className="text-base font-bold text-industrial-success">{measuredQuantity.toFixed(2)} g</div>
          </div>
          <div>
            <div className="text-[10px] text-industrial-textMuted uppercase">Flow Rate</div>
            <div className="text-base font-bold text-industrial-warm">{dispenseRate.toFixed(1)} g/s</div>
          </div>
          <div>
            <div className="text-[10px] text-industrial-textMuted uppercase">Tolerance</div>
            <div className="text-base font-bold text-industrial-text">±0.05 g</div>
          </div>
        </div>
      </div>
    </div>
  );
};

