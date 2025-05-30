import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';

interface CalorieChartProps {
  data: {
    day: string;
    calories: number;
    goal?: number;
  }[];
  width: number;
}

export function CalorieChart({ data, width }: CalorieChartProps) {
  const chartData = data.map(item => ({
    x: item.day,
    y: item.calories,
    goal: item.goal || 2000 // Default goal if not provided
  }));
  
  const maxValue = Math.max(...data.map(d => d.calories), ...data.map(d => d.goal || 2000));
  
  return (
    <View style={[styles.container, { width }]}>
      <VictoryChart
        width={width}
        height={200}
        padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
        domainPadding={{ x: 20 }}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          tickFormat={(t) => t}
          style={{
            axis: { stroke: '#e5e7eb' },
            ticks: { stroke: 'transparent' },
            tickLabels: { 
              fill: '#64748b',
              fontSize: 10,
              fontFamily: 'Inter-Regular',
              padding: 5
            }
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `${Math.round(t / 100) * 100}`}
          style={{
            axis: { stroke: '#e5e7eb' },
            grid: { stroke: '#f3f4f6' },
            ticks: { stroke: 'transparent' },
            tickLabels: { 
              fill: '#64748b',
              fontSize: 10,
              fontFamily: 'Inter-Regular',
              padding: 5
            }
          }}
        />
        <VictoryBar
          data={chartData}
          x="x"
          y="y"
          barWidth={30}
          cornerRadius={{ top: 4 }}
          style={{
            data: {
              fill: ({ datum }) => datum.y >= datum.goal ? '#ef4444' : '#22c55e',
            }
          }}
          animate={{
            duration: 500,
            onLoad: { duration: 300 }
          }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});