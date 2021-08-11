import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import {Order} from '../../shared/interfaces'

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {

  @Input() orders: Order[]
  @ViewChild('modal') modalRef: ElementRef

  modal: MaterialInstance

  selectedOrder: Order

  constructor() { }

  ngOnDestroy(){
    this.modal.destroy()
  }

  ngAfterViewInit(){
    this.modal = MaterialService.initModal(this.modalRef)
  }

  computePrice(order: Order): number{
    return order.list.reduce((total, item) => {
      return total += item.cost * item.quantity}, 0)
  }

  selectOrder(order: Order){
    this.selectedOrder = order
    this.modal.open()
  }

  closeModal(){
    this.modal.close()
  }
}
