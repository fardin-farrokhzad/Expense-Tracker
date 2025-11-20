import React from 'react';
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { numberToPersian } from '/src/utils/formatters';

function LineChart({ data }) {
  // Validate the data for NaN values before rendering
  const chartData = data.filter(
    item => !isNaN(item.درآمد) && !isNaN(item.هزینه)
  );

  return (
    <ResponsiveContainer width='100%' height={280}>
      <RLineChart
        data={chartData}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
        <XAxis
          dataKey='monthYear'
          tick={{ fontSize: 11 }}
          interval='preserveStartEnd'
          minTickGap={20}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={value => numberToPersian(value)}
        />
        <Tooltip
          contentStyle={{ fontSize: '12px' }}
          formatter={value => numberToPersian(value)}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type='monotone'
          dataKey='درآمد'
          stroke='#3ebd93'
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type='monotone'
          dataKey='هزینه'
          stroke='#ef4e4e'
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </RLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
