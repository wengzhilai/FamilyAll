import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'ngx-confirmModal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <ul *ngIf="messageList.length">
        <li *ngFor="let item of messageList">{{item}}</li>
      </ul>
      <ng-container *ngFor="let item of inputs;let i = index">
        <div class="col-sm-12" *ngIf="item.editable==null || item.editable==true">
            <input *ngIf="item.editor==null || item.editor.type=='text';else elseBlock" id="input{{i}}" [(ngModel)]="bean[item.name]"
              type="{{item.type}}" class="form-control" placeholder="{{item.placeholder}}">
            <ng-template #elseBlock>
              <ng-container [ngSwitch]="item.editor.type">
                <select *ngSwitchCase="'list'" id="input{{i}}" [(ngModel)]="bean[item.name]" class="form-control">
                  <option *ngFor="let opt of item.editor.config.list" value="{{opt.value}}">{{opt.title}}</option>
                </select>
                <select *ngSwitchCase="'completer'" id="input{{i}}" [(ngModel)]="bean[item.name]" class="form-control">
                  <option *ngFor="let opt of item.editor.config.completer.data" value="{{opt.value}}">{{opt.title}}</option>
                </select>
                <textarea *ngSwitchCase="'textarea'" id="input{{i}}" [(ngModel)]="bean[item.name]" rows="3" placeholder="{{item.placeholder}}"
                  class="form-control"></textarea>
                
                <input *ngSwitchDefault id="input{{i}}" [(ngModel)]="bean[item.name]" type="{{item.type}}" class="form-control" placeholder="{{item.placeholder}}">
              </ng-container>
            </ng-template>
        </div>
      </ng-container>
    </div>
    <div class="modal-footer">
      <button type="button" *ngFor="let item of buttons" class="btn btn-hero-success" (click)="ButtonClick(item.click)">{{item.name}}</button>
    </div>
  `
})
export class ModalConfirmPage {
  title: string;
  messageList: any[] = [];
  buttons = []
  inputs = []
  bean = {}
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    for (const key in this.inputs) {
      if (this.inputs.hasOwnProperty(key)) {
        const element = this.inputs[key];
        if (element.hasOwnProperty("value") && element.hasOwnProperty("name")) {
          this.bean[element["name"]] = element["value"]
        }
      }
    }
  }
  ButtonClick(even) {
    even(this.bean).then(x => {
      console.log(x)
      this.bsModalRef.hide();
    })
  }
}
