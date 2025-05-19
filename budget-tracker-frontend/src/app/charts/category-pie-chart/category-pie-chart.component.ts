import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-category-pie-chart',
  template: `<div #chart></div>`,
})
export class CategoryPieChartComponent implements OnInit {
  @Input() data: { category: string, amount: number }[] = [];
  @ViewChild('chart') private chartContainer!: ElementRef;

  ngOnInit() {
    this.drawChart();
  }

  drawChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();
    const width = 400, height = 300, radius = Math.min(width, height) / 2;

    const svg = d3.select(element).append('svg')
      .attr('width', width).attr('height', height)
      .append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<{ category: string, amount: number }>().value(d => d.amount);
    const data_ready = pie(this.data);

    const arc = d3.arc<d3.PieArcDatum<any>>()
      .innerRadius(0).outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeSet2);

    svg.selectAll('path')
      .data(data_ready)
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.category)!)
      .attr('stroke', '#fff')
      .style('stroke-width', '2px');
  }
}
