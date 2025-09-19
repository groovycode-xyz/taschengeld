'use client';

import { useEffect, useRef } from 'react';

interface LineChartData {
  date: string;
  balance: number;
}

interface LineChartProps {
  data: LineChartData[];
  width?: number;
  height?: number;
  color?: string;
}

export function LineChart({ data, width = 600, height = 300, color = '#3b82f6' }: LineChartProps) {
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

    // Find min and max values for scaling
    const maxBalance = Math.max(...data.map((d) => d.balance), 0);
    const minBalance = Math.min(...data.map((d) => d.balance), 0);
    const range = maxBalance - minBalance || 1;

    // Calculate nice scale values
    const yMin = minBalance < 0 ? Math.floor(minBalance / 10) * 10 : 0;
    const yMax = Math.ceil(maxBalance / 10) * 10 || 10;

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';

    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const value = yMin + (yMax - yMin) * (i / ySteps);
      const y = height - padding - (i / ySteps) * chartHeight;

      // Draw tick
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();

      // Draw label
      ctx.fillText(value.toFixed(0), padding - 8, y + 3);
    }

    // Draw the line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = height - padding - ((point.balance - yMin) / (yMax - yMin)) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw dots at data points
    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = height - padding - ((point.balance - yMin) / (yMax - yMin)) * chartHeight;

      // White background circle
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Colored border
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.stroke();

      // Show value on hover-like points (first, last, and notable changes)
      const showValue =
        index === 0 ||
        index === data.length - 1 ||
        (index > 0 && Math.abs(data[index].balance - data[index - 1].balance) > range * 0.1);

      if (showValue && data.length <= 20) {
        ctx.fillStyle = '#333';
        ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        const textY = y - 8;
        ctx.fillText(point.balance.toFixed(2), x, textY);
      }
    });

    // Draw date labels
    ctx.fillStyle = '#666';
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';

    const showLabels = Math.min(5, data.length);
    const labelStep = Math.max(1, Math.floor(data.length / showLabels));

    data.forEach((point, index) => {
      if (index % labelStep === 0 || index === data.length - 1) {
        const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
        ctx.save();
        ctx.translate(x, height - padding + 15);
        ctx.fillText(point.date.substring(5), 0, 0);
        ctx.restore();
      }
    });

    // Draw "Balance Over Time" label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Balance Over Time', width / 2, height - 5);

    // Draw zero line if balance goes negative
    if (yMin < 0 && yMax > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      const zeroY = height - padding - ((0 - yMin) / (yMax - yMin)) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, zeroY);
      ctx.lineTo(width - padding, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Legend
    ctx.fillStyle = color;
    ctx.fillRect(width - 120, 15, 12, 12);
    ctx.fillStyle = '#333';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Balance', width - 104, 25);
  }, [data, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className='max-w-full'
    />
  );
}
