import { Component, Injectable, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper } from 'ngx-treeview';
import { TreeviewSelectI18n } from './treeview-select-i18n';
@Component({
    selector: 'ngx-dropdown-treeview-select',
    templateUrl: './treeview-select.component.html',
    styleUrls: ['./treeview-select.component.scss'],

})
export class TreeviewSelectComponent implements OnChanges {
    @Input() config: TreeviewConfig;
    @Input() items: TreeviewItem[];
    @Input() value: any;
    @Output() valueChange = new EventEmitter<any>();
    @ViewChild(DropdownTreeviewComponent) dropdownTreeviewComponent: DropdownTreeviewComponent;
    filterText: string;
    private dropdownTreeviewSelectI18n: TreeviewSelectI18n;

    itemsTemp = [new TreeviewItem({
        text: 'ABC',
        value: 123456
      })];
    constructor(
        public i18n: TreeviewI18n
    ) {
        this.config = TreeviewConfig.create({
            hasAllCheckBox: false,
            hasCollapseExpand: false,
            hasFilter: false,
            maxHeight: 100
        });
        this.dropdownTreeviewSelectI18n = i18n as TreeviewSelectI18n;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (_.isNil(this.value)) {
            this.selectAll();
        } else {
            this.updateSelectedItem();
        }
    }

    select(item: TreeviewItem) {
        if (item.children === undefined) {
            this.selectItem(item);
        }
    }

    private updateSelectedItem() {
        if (!_.isNil(this.items)) {
            const selectedItem = TreeviewHelper.findItemInList(this.items, this.value);
            if (selectedItem) {
                this.selectItem(selectedItem);
            } else {
                this.selectAll();
            }
        }
    }

    private selectItem(item: TreeviewItem) {
        this.dropdownTreeviewComponent.dropdownDirective.close();
        if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
            this.dropdownTreeviewSelectI18n.selectedItem = item;
            if (this.value !== item.value) {
                this.value = item.value;
                this.valueChange.emit(item.value);
            }
        }
    }

    private selectAll() {
        const allItem = this.dropdownTreeviewComponent.treeviewComponent.allItem;
        this.selectItem(allItem);
    }
}