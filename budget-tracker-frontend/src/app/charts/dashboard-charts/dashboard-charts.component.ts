import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DashboardService } from '../../services/dashboard.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [RouterModule,FormsModule, CommonModule],
  templateUrl: './dashboard-charts.component.html',
})
export class DashboardChartsComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

selectedMonth: number = new Date().getMonth() + 1; // Default current month
selectedYear: number = new Date().getFullYear();   // Default current year

months = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' },
];

  ngOnInit() {
    this.dashboardService.getDashboardData(this.selectedMonth, this.selectedYear).subscribe(data => {
      this.renderIncomeExpenseTrend(data.income_expense_monthly);
      this.renderCategoryWiseExpenses(data.category_expenses);
    });
  }

  renderIncomeExpenseTrend(monthlyData: any[]) {
  const svg = d3.select('#trendChart')
    .attr('width', 500)
    .attr('height', 300);

  svg.selectAll('*').remove();

  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const months = monthlyData.map(d => d.month);
  const income = monthlyData.map(d => d.income);
  const expenses = monthlyData.map(d => d.expense);

  const maxY = d3.max([...income, ...expenses]) || 0;

  const getNiceStep = (max: number) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const normalized = max / magnitude;

    if (normalized <= 2) return magnitude / 5;
    if (normalized <= 5) return magnitude / 2;
    return magnitude;
  };

  const step = getNiceStep(maxY);
  const yMax = Math.ceil((maxY * 1.1) / step) * step;

  const x = d3.scaleBand()
    .domain(months)
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0]);

  // X Axis
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Y Axis with smart ticks
  g.append('g')
    .call(d3.axisLeft(y).tickValues(d3.range(0, yMax + step, step)));

  // Income Bars
  g.selectAll('.bar-income')
    .data(monthlyData)
    .enter()
    .append('rect')
    .attr('x', d => x(d.month)!)
    .attr('y', d => y(d.income))
    .attr('width', x.bandwidth() / 2)
    .attr('height', d => height - y(d.income))
    .attr('fill', '#28a745');

  // Income Labels
  g.selectAll('.label-income')
    .data(monthlyData)
    .enter()
    .append('text')
    .attr('x', d => x(d.month)! + x.bandwidth() / 4)
    .attr('y', d => y(d.income) - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', '#28a745')
    .style('font-size', '10px')
    .text(d => `₹${d.income.toFixed(2)}`);

  // Expense Bars
  g.selectAll('.bar-expense')
    .data(monthlyData)
    .enter()
    .append('rect')
    .attr('x', d => x(d.month)! + x.bandwidth() / 2)
    .attr('y', d => y(d.expense))
    .attr('width', x.bandwidth() / 2)
    .attr('height', d => height - y(d.expense))
    .attr('fill', '#dc3545');

  // Expense Labels
  g.selectAll('.label-expense')
    .data(monthlyData)
    .enter()
    .append('text')
    .attr('x', d => x(d.month)! + (3 * x.bandwidth()) / 4)
    .attr('y', d => y(d.expense) - 5)
    .attr('text-anchor', 'middle')
    .attr('fill', '#dc3545')
    .style('font-size', '10px')
    .text(d => `₹${d.expense.toFixed(2)}`);
}
  renderCategoryWiseExpenses(categoryData: any[]) {
  const svg = d3.select('#categoryPie')
    .attr('width', 400)
    .attr('height', 400);

  const radius = 150;
  const g = svg.append('g').attr('transform', `translate(200,200)`);

  const pie = d3.pie<any>().value(d => d.amount);
  const arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(0).outerRadius(radius);

  const color = d3.scaleOrdinal(d3.schemeSet3);

  const pieData = pie(categoryData);
  const total = d3.sum(categoryData, d => d.amount);

  const arcs = g.selectAll('arc')
    .data(pieData)
    .enter()
    .append('g');

  arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i.toString())!);

  arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text(d => {
      const percent = ((d.data.amount / total) * 100).toFixed(1);
      return `${d.data.category} ₹${d.data.amount} (${percent}%)`;
    })
    .style('font-size', '10px')
    .style('text-align', 'center');
}

}
