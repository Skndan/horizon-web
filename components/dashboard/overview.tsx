"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
 
interface OverviewProps {
  data: any[]; // Replace `any` with more specific type if possible
}

const Overview: React.FC<OverviewProps> = ({ data }) => {
  // Component implementation
  return (
    <ResponsiveContainer width="100%" height={370}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;