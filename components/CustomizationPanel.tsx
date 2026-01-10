'use client';

import { useStore } from '@/lib/store';
import { GarmentType, Size, Gauge } from '@/lib/types';
import { STANDARD_GAUGES } from '@/lib/knitting/measurements';
import GaugeCalculator from './GaugeCalculator';
import CustomSizing from './CustomSizing';

export default function CustomizationPanel() {
  const {
    selectedGarment,
    selectedSize,
    selectedGauge,
    customGauge,
    setSelectedGarment,
    setSelectedSize,
    setSelectedGauge,
    setCustomGauge,
  } = useStore();

  const handleGarmentChange = (garment: GarmentType) => {
    setSelectedGarment(garment);
    // Reset size to valid default for the new garment type
    if (garment === 'beanie') {
      setSelectedSize('M');
    } else if (garment === 'scarf') {
      setSelectedSize('standard');
    } else if (garment === 'sweater') {
      setSelectedSize('M');
    }
  };

  const handleYarnWeightChange = (weight: Gauge['yarnWeight']) => {
    // When changing yarn weight, update gauge
    // But preserve custom gauge if one was set
    if (customGauge) {
      // Keep custom gauge values, just update the yarn weight
      setSelectedGauge({
        ...selectedGauge,
        yarnWeight: weight,
      });
    } else {
      // Use standard gauge for this weight
      setSelectedGauge(STANDARD_GAUGES[weight]);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      <div>
        <h3 className="font-semibold text-lg mb-4">Customize Your Pattern</h3>
      </div>

      {/* Garment Type Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Garment Type</label>
        <div className="grid grid-cols-3 gap-2">
          {(['beanie', 'scarf', 'sweater'] as GarmentType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleGarmentChange(type)}
              className={`
                px-4 py-3 rounded-lg border-2 capitalize transition-colors relative
                ${selectedGarment === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              {type}
              {type === 'sweater' && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  Advanced
                </span>
              )}
            </button>
          ))}
        </div>
        {selectedGarment === 'sweater' && (
          <p className="text-xs text-amber-600 mt-2">
            Sweaters require seaming and are best for experienced knitters. Consider starting with a beanie or scarf.
          </p>
        )}
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Size</label>
        {selectedGarment === 'beanie' && (
          <div className="grid grid-cols-3 gap-2">
            {(['S', 'M', 'L'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-colors
                  ${selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        {selectedGarment === 'scarf' && (
          <div className="grid grid-cols-3 gap-2">
            {(['narrow', 'standard', 'wide'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  px-4 py-2 rounded-lg border-2 capitalize transition-colors
                  ${selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        {selectedGarment === 'sweater' && (
          <div className="grid grid-cols-5 gap-2">
            {(['XS', 'S', 'M', 'L', 'XL'] as Size[]).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-colors
                  ${selectedSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Yarn Weight Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Yarn Weight</label>
        <select
          value={selectedGauge.yarnWeight}
          onChange={(e) => handleYarnWeightChange(e.target.value as Gauge['yarnWeight'])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="fingering">Fingering (7 sts/inch)</option>
          <option value="sport">Sport (6 sts/inch)</option>
          <option value="dk">DK (5.5 sts/inch)</option>
          <option value="worsted">Worsted (4.5 sts/inch) - Recommended</option>
          <option value="aran">Aran (4 sts/inch)</option>
          <option value="bulky">Bulky (3.5 sts/inch)</option>
        </select>
        {customGauge && (
          <p className="text-xs text-green-600 mt-1">
            Using your custom gauge instead of standard values
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-sm text-gray-700 mb-3">Advanced Options</h4>
      </div>

      {/* Gauge Calculator */}
      <GaugeCalculator />

      {/* Custom Sizing */}
      <CustomSizing />
    </div>
  );
}
