import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'ngx-modal',
    template: `
<div class="modal-body">
    {{msg}}
</div>
  `,
})
export class ModalLoadingPage implements OnInit {
    msg = ""
    constructor(public bsModalRef: BsModalRef) {

    }

    ngOnInit() {
    }
}
