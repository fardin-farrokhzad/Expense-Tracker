import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './DoughnutChart.module.css';
import { formatNumber } from '/src/utils/formatNumber.js';

function DoughnutChart({ incomeTotal, expenseTotal }) {
  const data = [
    { name: 'درآمد', value: incomeTotal || 0 },
    { name: 'هزینه', value: expenseTotal || 0 },
  ];

  const COLORS = ['#3ebd93', '#ef4e4e'];

  // Custom external label – placed outside the doughnut, supports two-line long numbers
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const value = data[index].value;
    const name = data[index].name;
    const color = COLORS[index];
    const formattedValue = formatNumber(value);

    // Split long values (>10 chars) into two lines
    const isLong = formattedValue.length > 10;
    const firstLine = isLong ? formattedValue.slice(0, 10) : formattedValue;
    const secondLine = isLong ? formattedValue.slice(10) : '';

    // Adjust distance from center for longer text
    const radius = outerRadius + (isLong ? 32 : 22);

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';

    // Vertical offset to keep multi-line text centered
    const lineOffset = isLong ? 10 : 0;

    return (
      <g>
        {/* First line: name (black) + first part of value (colored) */}
        <text
          x={x}
          y={y - lineOffset}
          textAnchor={textAnchor}
          dominantBaseline='central'
          fontSize='11'
          fontWeight='600'
          fill='#444'
        >
          {`${name}: `}
          <tspan fill={color}>{firstLine}</tspan>
        </text>

        {/* Second line (only when needed) */}
        {isLong && (
          <text
            x={x}
            y={y + lineOffset}
            textAnchor={textAnchor}
            dominantBaseline='central'
            fontSize='11'
            fontWeight='600'
            fill={color}
          >
            {secondLine}
          </text>
        )}
      </g>
    );
  };

  // Custom tooltip – displays name and formatted value with matching segment color
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const index = data.findIndex(item => item.name === name);
      const color = COLORS[index];
      const formattedValue = formatNumber(value);

      return (
        <div className={styles.tooltip}>
          <p style={{ margin: 0 }}>
            {`${name}: `}
            <span style={{ color }}>{formattedValue}</span>
          </p>
        </div>
      );
    }
    return null;
  };

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
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DoughnutChart;
