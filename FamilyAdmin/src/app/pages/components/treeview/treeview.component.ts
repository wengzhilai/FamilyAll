import { Component, OnInit } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BookService } from './book.service';

@Component({
    selector: 'ngx-book',
    templateUrl: './treeview.component.html',
    providers: [
        BookService
    ]
})
export class TreeviewComponent implements OnInit {
    dropdownEnabled = true;
    items: any;
    values: number[];
    config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

    buttonClasses = [
        'btn-outline-primary',
        'btn-outline-secondary',
        'btn-outline-success',
        'btn-outline-danger',
        'btn-outline-warning',
        'btn-outline-info',
        'btn-outline-light',
        'btn-outline-dark'
    ];
    buttonClass = this.buttonClasses[0];

    constructor(
        private service: BookService
    ) { }

    ngOnInit() {
        this.items =[ {
            "text": "Children", "value": 1, "collapsed": true, "children": [
                { text: 'Baby 3-5', value: 11 },
                { text: 'Baby 6-8', value: 12 },
                { text: 'Baby 9-12', value: 13 }
            ]
        }];
    }
}