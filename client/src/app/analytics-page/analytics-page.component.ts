import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chart, ChartType, registerables} from 'chart.js'
Chart.register(...registerables);
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  average: number
  pending = true

  aSub: Subscription
  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(){

    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255,99,132)'
    } 

    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(94,99,132)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data) => {
      this.average = data.average

      gainConfig.label = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig( gainConfig ) )


      orderConfig.label = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      orderCtx.canvas.height = '300px'

      new Chart(orderCtx, createChartConfig( orderConfig ) )

      this.pending = false
    })
  }

  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig({labels, label, data, color}){
  return{
    type: 'line' as ChartType ,
    options:{
      responsive: true
    },
    data:{
      labels,
      datasets:[
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
