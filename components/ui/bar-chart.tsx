'use client';

import { useEffect, useRef } from 'react';

interface BarChartData {
  period: string;
  earned: number;
  spent: number;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  colors?: {
    earned: string;
    spent: string;
  };
}

export function BarChart({
  data,
  width = 600,
  height = 300,
  colors = {
    earned: '#22c55e',
    spent: '#ef4444',
  },
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) {
      ctx.fillStyle = '#999';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', width / 2, height / 2);
      return;
    }

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data.map((d) => Math.max(d.earned, d.spent)), 1);

    // Calculate nice scale values
    const scaleSteps = 5;
    let stepSize: number;
    let scaleMax: number;

    if (maxValue <= 1) {
      stepSize = 0.2;
      scaleMax = 1;
    } else if (maxValue <= 5) {
      stepSize = 1;
      scaleMax = Math.ceil(maxValue);
    } else if (maxValue <= 10) {
      stepSize = 2;
      scaleMax = Math.ceil(maxValue / 2) * 2;
    } else if (maxValue <= 50) {
      stepSize = 10;
      scaleMax = Math.ceil(maxValue / 10) * 10;
    } else if (maxValue <= 100) {
      stepSize = 20;
      scaleMax = Math.ceil(maxValue / 20) * 20;
    } else if (maxValue <= 500) {
      stepSize = 100;
      scaleMax = Math.ceil(maxValue / 100) * 100;
    } else {
      stepSize = Math.ceil(maxValue / scaleSteps / 100) * 100;
      scaleMax = stepSize * scaleSteps;
    }

    const barGroupWidth = chartWidth / Math.max(data.length, 1);
    const barWidth = Math.min(barGroupWidth * 0.35, 40);
    const barSpacing = barGroupWidth * 0.1;

    data.forEach((item, index) => {
      const x = padding + index * barGroupWidth + barGroupWidth * 0.15;

      const earnedHeight = (item.earned / scaleMax) * chartHeight;
      const earnedY = height - padding - earnedHeight;
      ctx.fillStyle = colors.earned;
      ctx.fillRect(x, earnedY, barWidth, earnedHeight);

      // Draw earned value inside bar if there's space
      if (earnedHeight > 20 && item.earned > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.earned.toFixed(2), x + barWidth / 2, earnedY + earnedHeight - 5);
      }

      const spentHeight = (item.spent / scaleMax) * chartHeight;
      const spentY = height - padding - spentHeight;
      ctx.fillStyle = colors.spent;
      ctx.fillRect(x + barWidth + barSpacing, spentY, barWidth, spentHeight);

      // Draw spent value inside bar if there's space
      if (spentHeight > 20 && item.spent > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          item.spent.toFixed(2),
          x + barWidth + barSpacing + barWidth / 2,
          spentY + spentHeight - 5
        );
      }

      // Show date labels for first, last, and some middle items
      const showLabel =
        index === 0 ||
        index === data.length - 1 ||
        data.length <= 7 ||
        index % Math.max(1, Math.floor(data.length / 5)) === 0;

      if (showLabel) {
        ctx.fillStyle = '#666';
        ctx.font = '10px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x + barWidth, height - padding + 15);
        ctx.fillText(item.period.substring(5), 0, 0);
        ctx.restore();
      }
    });

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw Y-axis scale values
    ctx.fillStyle = '#666';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= scaleSteps; i++) {
      const value = i * stepSize;
      const y = height - padding - (i / scaleSteps) * chartHeight;

      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();

      // Draw value - format based on size
      let label: string;
      if (stepSize < 1) {
        label = value.toFixed(1);
      } else if (value >= 1000) {
        label = (value / 1000).toFixed(1) + 'k';
      } else {
        label = value.toFixed(0);
      }

      ctx.fillText(label, padding - 8, y + 3);
    }

    // Draw "All Time" label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('All Time', width / 2, height - 5);

    const legendY = 15;
    const legendX = width - 150;

    ctx.fillStyle = colors.earned;
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = '#333';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Earned', legendX + 18, legendY + 10);

    ctx.fillStyle = colors.spent;
    ctx.fillRect(legendX + 60, legendY, 12, 12);
    ctx.fillStyle = '#333';
    ctx.fillText('Spent', legendX + 78, legendY + 10);
  }, [data, width, height, colors]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className='max-w-full'
    />
  );
}
