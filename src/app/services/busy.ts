import { inject, Service } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Service()
export class BusyService {
    busyrequestCount = 0;
     spinnerservice: NgxSpinnerService = inject(NgxSpinnerService);
    busy() {
    this.busyrequestCount++;
    this.spinnerservice.show(undefined, {
      type: 'line-scale-party',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333'
    })
  }

  idle() {
    this.busyrequestCount--;
    if (this.busyrequestCount <= 0) {
      this.busyrequestCount = 0;
      this.spinnerservice.hide();
    }
  }
}
