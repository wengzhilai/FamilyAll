import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell, DefaultEditor } from 'ng2-smart-table';

@Component({
    selector: 'SmartTable-formatValue',
    template: `
      {{ renderValue }}
    `,
  })
  export class SmartTableFormatValuePage implements ViewCell, OnInit {
    renderValue: string;
  
    @Input() value: string | number;
    @Input() rowData: any;
    /**
     * 事件
     */
    @Output() save: EventEmitter<any> = new EventEmitter();
    /**
     * 格式方法
     */
    @Output() format;
  
    ngOnInit() {
      this.renderValue = this.format(this.value)
      // this.save.emit(this.value);
    }
  
  }