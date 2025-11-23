import React from 'react';
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip,
} from 'recharts';
import styles from './BarChart.module.css';
import { formatNumber } from '/src/utils/formatNumber.js';

//  BarChart component – displays a simple two-bar chart comparing monthly income and expenses.

function BarChart({ monthlyIncome, monthlyExpense }) {
  const data = [
    { name: 'درآمد', value: monthlyIncome || 0 },
    { name: 'هزینه', value: monthlyExpense || 0 },
  ];

  const COLORS = ['#3ebd93', '#ef4e4e'];

  // Custom label displayed above each bar – splits long numbers into two lines for readability
  const CustomLabel = props => {
    const { x, y, width, value, index } = props;
    const name = data[index].name;
    const color = COLORS[index];
    const text = formatNumber(value || 0);
    const maxChars = 8;
    const valueLines =
      text.length > maxChars
        ? [text.slice(0, maxChars), text.slice(maxChars)]
        : [text];

    return (
      <g>
        <text
          x={x + width / 2}
          y={y - 22}
          textAnchor='middle'
          fontSize={11}
          fontWeight='bold'
          fill='#444'
        >
          <tspan fill={color}>{valueLines[0]}</tspan>
        </text>
        {valueLines.length > 1 && (
          <text
            x={x + width / 2}
            y={y - 8}
            textAnchor='middle'
            fontSize={11}
            fontWeight='bold'
            fill={color}
          >
            {valueLines[1]}
          </text>
        )}
      </g>
    );
  };

  // Custom Y-axis tick – shows large numbers on two lines when they exceed 8 characters
  const CustomYAxisTick = ({ x, y, payload }) => {
    const value = payload.value || 0;
    const text = formatNumber(value);

    // Only make it two lines if the number exceeds 8 characters
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
  };

  // Custom tooltip – shows the bar name and formatted value with matching color
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { value } = payload[0];
      const index = data.findIndex(d => d.name === label);
      const color = COLORS[index];
      const formatted = formatNumber(value);

      return (
        <div className={styles.tooltip}>
          <p style={{ margin: 0 }}>
            {`${label}: `}
            <span style={{ color }}>{formatted}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <ResponsiveContainer
        minHeight={0}
        minWidth={0}
        aspect={undefined}
        width='100%'
        height='100%'
        initialDimension={{ width: 320, height: 200 }}
      >
        <RBarChart
          data={data}
          margin={{ top: 50, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray='3 3' opacity={0.3} />

          <XAxis
            dataKey='name'
            tick={{ fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={<CustomYAxisTick />}
            axisLine={false}
            tickLine={false}
            width={70} // enough space for two-line ticks
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey='value' radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
            <LabelList content={<CustomLabel />} />
          </Bar>
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;
