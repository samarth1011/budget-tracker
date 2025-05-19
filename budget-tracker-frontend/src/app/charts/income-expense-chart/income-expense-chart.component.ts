import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-income-expense-chart',
  template: `<div #chart></div>`,
})
export class IncomeExpenseChartComponent implements OnInit {
  @Input() data: { month: string, income: number, expense: number }[] = [];
  @ViewChild('chart') private chartContainer!: ElementRef;

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove(); // Clear existing
    const margin = { top: 30, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const months = this.data.map(d => d.month);
    const x = d3.scalePoint().domain(months).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(this.data, d => Math.max(d.income, d.expense))!]).nice().range([height, 0]);

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));

    const line = d3.line<any>().x(d => x(d.month)!).y(d => y(d.value));

    svg.append('path')
      .datum(this.data.map(d => ({ month: d.month, value: d.income })))
      .attr('fill', 'none').attr('stroke', 'green').attr('stroke-width', 2)
      .attr('d', line);

    svg.append('path')
      .datum(this.data.map(d => ({ month: d.month, value: d.expense })))
      .attr('fill', 'none').attr('stroke', 'red').attr('stroke-width', 2)
      .attr('d', line);
  }
}
