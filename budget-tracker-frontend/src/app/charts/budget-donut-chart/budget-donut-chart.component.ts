import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-budget-donut-chart',
  template: `<div #chart></div>`,
})
export class BudgetDonutChartComponent implements OnInit {
  @Input() used: number = 0;
  @Input() total: number = 0;
  @ViewChild('chart') private chartContainer!: ElementRef;

  ngOnInit() {
    this.drawChart();
  }

  drawChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const data = [
      { label: 'Used', value: this.used },
      { label: 'Remaining', value: this.total - this.used }
    ];

    const width = 300, height = 300, radius = Math.min(width, height) / 2;

    const svg = d3.select(element).append('svg')
      .attr('width', width).attr('height', height)
      .append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal().range(['#ff6b6b', '#4caf50']);

    const pie = d3.pie<any>().value(d => d.value);
    const data_ready = pie(data);

    const arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(60).outerRadius(radius);

    svg.selectAll('path')
      .data(data_ready)
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px');
  }
}
