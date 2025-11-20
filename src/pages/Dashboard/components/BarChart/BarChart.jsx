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
} from 'recharts';

function BarChart({ monthlyIncome, monthlyExpense }) {
  const data = [
    { name: 'درآمد', value: monthlyIncome },
    { name: 'هزینه', value: monthlyExpense },
  ];

  const COLORS = ['#3ebd93', '#ef4e4e'];

  const CustomLabel = props => {
    const { x, y, width, value, index } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill={COLORS[index]}
        textAnchor='middle'
        fontSize={11}
        fontWeight='bold'
      >
        {value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width='100%' height={260}>
      <RBarChart
        data={data}
        margin={{ top: 30, right: 20, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
        <XAxis
          dataKey='name'
          tick={{ fontSize: 10, fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Bar dataKey='value' radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
          <LabelList content={<CustomLabel />} />
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
