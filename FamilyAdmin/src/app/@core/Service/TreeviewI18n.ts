import { Injectable } from '@angular/core';
import { TreeviewItem, TreeviewSelection, TreeviewI18n } from 'ngx-treeview';

@Injectable()
export class DefaultTreeviewI18n extends TreeviewI18n {
    language="ch"

    constructor(
    ) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if (selection.uncheckedItems.length === 0) {
            return this.language === 'en' ? 'All' : '所有';
        }

        switch (selection.checkedItems.length) {
            case 0:
                return this.language === 'en' ? 'Select options' : '选择项';
            case 1:
                return selection.checkedItems[0].text;
            default:
                return this.language === 'en'
                    ? `${selection.checkedItems.length} options selected`
                    : `${selection.checkedItems.length} 项选择`;
        }
    }

    getAllCheckboxText(): string {
        if (this.language === 'en') {
            return 'All';
        } else {
            return '所有';
        }
    }

    getFilterPlaceholder(): string {
        if (this.language === 'en') {
            return 'Filter';
        } else {
            return '筛选';
        }
    }

    getFilterNoItemsFoundText(): string {
        if (this.language === 'en') {
            return 'No items found';
        } else {
            return '无数据';
        }
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return isCollapse
            ? this.language === 'en' ? 'Expand' : '展开'
            : this.language === 'en' ? 'Collapse' : '折叠';
    }
}