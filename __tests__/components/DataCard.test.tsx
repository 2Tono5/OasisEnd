
// Para ejecutar esta prueba, necesitarás Vitest, Jest y @testing-library/react.
// Ejemplo con Vitest: `npx vitest`

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DataCard from '../../components/DataCard';
import { OPTIMAL_TEMPERATURE_RANGE } from '../../constants/index';

describe('DataCard', () => {
  it('renders correctly with optimal value', () => {
    render(
      <DataCard 
        icon="fa-thermometer-half" 
        title="Temperatura" 
        value={20} 
        unit="°C" 
        optimalRange={OPTIMAL_TEMPERATURE_RANGE} 
      />
    );
    const valueElement = screen.getByText(/20.0/);
    expect(valueElement).toBeInTheDocument();
    // La clase de color óptimo es 'text-emerald-400'
    expect(valueElement).toHaveClass('text-emerald-400');
  });

  it('renders correctly with a value below optimal', () => {
    render(
      <DataCard 
        icon="fa-thermometer-half" 
        title="Temperatura" 
        value={15} 
        unit="°C" 
        optimalRange={OPTIMAL_TEMPERATURE_RANGE} 
      />
    );
    const valueElement = screen.getByText(/15.0/);
    // La clase de color para valor bajo es 'text-sky-400'
    expect(valueElement).toHaveClass('text-sky-400');
  });
  
  it('renders placeholder when value is undefined', () => {
    render(
      <DataCard 
        icon="fa-thermometer-half" 
        title="Temperatura" 
        value={undefined} 
        unit="°C" 
        optimalRange={OPTIMAL_TEMPERATURE_RANGE} 
      />
    );
    const placeholderElement = screen.getByText(/--/);
    expect(placeholderElement).toBeInTheDocument();
    // La clase de color para indefinido es 'text-slate-500'
    expect(placeholderElement).toHaveClass('text-slate-500');
  });
});
