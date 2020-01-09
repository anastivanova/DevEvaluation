import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { AppService } from './app.service';
import { Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _destroied$: Subject<any>;
  private _viewModal: boolean;
  private _rawJsonData: any;
  tableData: any;

  get viewModal() {
    return this._viewModal;
  }

  get rawJsonData() {
    return this._rawJsonData;
  }

  constructor(
    private appService: AppService,
    private elementRef: ElementRef
  ) {
    this._destroied$ = new Subject();
    this._viewModal = false;
  }

  @HostListener('document:click', ['$event.target']) onClick(targetEvent) {
    if (this._viewModal && this.elementRef.nativeElement.contains(targetEvent)) {
      this._viewModal = !this._viewModal;
    }
  }

  ngOnInit() {
    this.appService.getDataForTable()
    .pipe(
      takeUntil(this._destroied$)
    )
    .subscribe(v => this.tableData = v.hits);
  }

  displayData(data) {
    this._viewModal = !this.viewModal;
    this._rawJsonData = data;
  }

  closeModal() {
    this._viewModal = !this.viewModal;
  }


  ngOndestory() {
    this._viewModal = false;
    this._destroied$.next(null);
    this._destroied$.complete();
  }

}
