'use client';

import React from 'react';
import { Home } from '../types';

interface HomeStatsProps {
  homes: Home[];
}

export const HomeStats: React.FC<HomeStatsProps> = ({ homes }) => {
  const total = homes.length;
  const underConstruction = homes.filter((h) => h.status === 'under_construction').length;
  const completed = homes.filter((h) => h.status === 'completed').length;
  const totalSqft = homes.reduce((acc, h) => acc + (Number(h.area_sqft) || 0), 0);

  return (
    <div className="sum">
      <div className="box">
        <small>Total Home Projects</small>
        <b>{total}</b>
      </div>
      <div className="box">
        <small>Under Construction</small>
        <b className="neg">{underConstruction}</b>
      </div>
      <div className="box">
        <small>Completed & Ready</small>
        <b className="pos">{completed}</b>
      </div>
      <div className="box">
        <small>Total Built Area</small>
        <b>{totalSqft.toLocaleString()} sq.ft</b>
      </div>
    </div>
  );
};

