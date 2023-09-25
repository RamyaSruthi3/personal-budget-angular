import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'Chart.js/auto';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource = {
    datasets: [
      {
        data: [] as any[],
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
    labels: [] as string[]
  };

  // D3.js specific properties
  public svg: any;
  public margin = 50;
  public width = 700;
  public height = 600;
  public radius = Math.min(this.width, this.height) / 2 - this.margin;
  public colors: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart();
        this.createSvg();
        this.createColors();
        this.drawChart();
      });
  }

  createChart() {
    let ctx = document.getElementById("myChart") as HTMLCanvasElement;

    let myPieChart = new Chart(ctx, {
      type: "pie",
      data: this.dataSource,
    });
  }

  createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
  }

  createColors(): void {
    const data = [
        { title: "Eat Out", budget: 125 },
        { title: "Rent", budget: 400 },
        { title: "Grocery", budget: 110 },
        { title: "Movies", budget: 80 },
        { title: "Electricity", budget: 70 },
        { title: "Gas", budget: 60 },
        { title: "Misc", budget: 100 }
    ];

    this.colors = d3.scaleOrdinal()
        .domain(data.map(d => d.title))
        .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782", "#3a3a85", "#2b2b5a"]);
}

drawChart(): void {
  // Using the structure from your provided budgetdata.json
  const data = [
      { title: "Eat Out", budget: 125 },
      { title: "Rent", budget: 400 },
      { title: "Grocery", budget: 110 },
      { title: "Movies", budget: 80 },
      { title: "Electricity", budget: 70 },
      { title: "Gas", budget: 60 },
      { title: "Misc", budget: 100 }
  ];

  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.budget));

  // Build the pie chart
  this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(this.radius)
      )
      .attr('fill', (d: any) => (this.colors(d.data.title)))  // Using the title to fetch the color
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

  this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d: any) => `${d.data.title} (${d.data.budget})`)  // Using the title attribute for the label text
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
}

}
