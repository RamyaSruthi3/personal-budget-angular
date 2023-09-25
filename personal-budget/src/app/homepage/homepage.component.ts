import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource: any = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#fd6b19",
          "pink",
          "lavender",
          "beige",
        ]
      }
    ],
    labels: []
  };

  public dataSource1: any = [];

  public svg: any;
  public margin = 20;
  public width = 750;
  public height = 500;
  public radius = Math.min(this.width, this.height) / 2;
  public colors: any;

  constructor(private http: HttpClient, public dataService: DataService) { }

  ngAfterViewInit(): void {
    if (
      this.dataService.getDataSource().datasets[0].data.length == 0 ||
      this.dataService.getDataSource1().length == 0
    ) {
      this.dataService.fetchDataFromBackend().subscribe((res: any) => {
        const budgets = res.myBudget;
        for (let i = 0; i < budgets.length; i++) {
          this.dataSource.datasets[0].data[i] = budgets[i].budget;
          this.dataSource.labels[i] = budgets[i].title;

          this.dataSource1.push({
            "label": budgets[i].title,
            "value": budgets[i].budget,
          });
        }

        this.dataService.setDataSource(this.dataSource);
        this.dataService.setDataSource1(this.dataSource1);

        this.createChart();
        this.createSvg();
        this.createColors();
        this.drawChart();
      });
    }
    else {
      this.createChart();
      this.createSvg();
      this.createColors();
      this.drawChart();
    }
  }

  createChart() {
    let ctx = document.getElementById("myChart") as HTMLCanvasElement;
    let myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataService.getDataSource()
    });
  }

  createSvg(): void {
    this.svg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  createColors(): void {
    this.colors = d3.scaleOrdinal()
      .domain(this.dataService.getDataSource1().map((d: any) => d.value))
      .range(this.dataSource.datasets[0].backgroundColor);
  }

  drawChart(): void {
    const pie = d3.pie<any>().value((d: any) => Number(d.value));

    this.svg
      .selectAll('pieces')
      .data(pie(this.dataService.getDataSource1()))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any, i: any) => (this.colors(i)))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.dataService.getDataSource1()))
      .enter()
      .append('text')
      .text((d: any) => `${d.data.label}: ${d.data.value}`)
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }
}
