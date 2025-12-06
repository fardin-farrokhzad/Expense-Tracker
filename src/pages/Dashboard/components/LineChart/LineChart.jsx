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
import styles from './LineChart.module.css';

import { formatNumber } from '/src/utils/formatNumber.js';

function LineChart({ data }) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.label}>{label}</p>
          {payload.map((entry, index) => (
            <p
              className={styles.key}
              key={index}
              style={{ color: entry.color }}
            >
              {entry.dataKey === 'income' ? 'درآمد' : 'هزینه'}:{' '}
              {formatNumber(entry.value)} تومان
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  function CustomYAxisTick({ x, y, payload }) {
    const value = payload.value || 0;
    const text = formatNumber(value);

    if (text.length <= 8) {
      return (
        <text x={x - 8} y={y + 4} textAnchor='end' fontSize={11} fill='#666'>
          {text}
        </text>
      );
    }

    const firstLine = text.slice(0, 8);
    const secondLine = text.slice(8);

    return (
      <g>
        <text x={x - 8} y={y} textAnchor='end' fontSize={11} fill='#666'>
          {firstLine}
        </text>
        <text x={x - 8} y={y + 13} textAnchor='end' fontSize={11} fill='#666'>
          {secondLine}
        </text>
      </g>
    );
  }

  return (
    <div className={styles.container}>
      <ResponsiveContainer
        width='100%'
        height='100%'
        initialDimension={{ width: 320, height: 200 }}
        minHeight={0}
        minWidth={0}
        aspect={undefined}
      >
        <RLineChart
          data={data}
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
            tick={<CustomYAxisTick />}
            axisLine={false}
            tickLine={false}
            width={70}
            domain={['auto', 'auto']}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Legend with Persian labels */}
          <Legend
            formatter={value => (value === 'income' ? 'درآمد' : 'هزینه')}
            wrapperStyle={{ fontSize: 12 }}
          />

          <Line
            type='monotone'
            dataKey='income'
            stroke='#3ebd93'
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type='monotone'
            dataKey='expense'
            stroke='#ef4e4e'
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
