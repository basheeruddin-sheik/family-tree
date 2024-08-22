import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  parent?: string;
  children?: Node[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private data = {
    "name": "Donald",
    "children": [
      {
        "name": "Alan",
        "children": [
          {
            "name": "Ada",
            "children": [
              {
                "name": "Tim"
              },
              {
                "name": "Grace"
              }
            ]
          }
        ]
      }
    ]
  }

  private svg: any;
  private margin = { top: 20, right: 90, bottom: 30, left: 90 };
  private width: number = 960 - this.margin.left - this.margin.right;
  private height: number = 500 - this.margin.top - this.margin.bottom;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.createSvg();
    this.drawTree(this.data);
  }

  private createSvg(): void {
    this.svg = d3.select(this.elRef.nativeElement)
      .select("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private drawTree(data: any): void {
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([this.height, this.width]);

    treeLayout(root);

    const link = this.svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      );

    const node = this.svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', (d: any) => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
      .attr('transform', (d: any) => 'translate(' + d.y + ',' + d.x + ')');

    node.append('circle')
      .attr('r', 10);

    node.append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => d.children ? -13 : 13)
      .style('text-anchor', (d: any) => d.children ? 'end' : 'start')
      .text((d: any) => d.data.name);
  }
}
