import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent, interval} from "rxjs";
import {buffer, debounceTime, filter, map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 0;
  checkStateTimer = "start";
  interval = interval(1000);
  private subscription;

  @ViewChild('waitButton', {static: true}) wait: ElementRef;
  @ViewChild('startOrStop', {static: true}) start: ElementRef;
  @ViewChild('resetButton', {static: true}) reset: ElementRef;

  constructor() { }

  ngOnInit() {
    let startTimer$ = fromEvent(this.start.nativeElement, 'click');
    let resetTimer$ = fromEvent(this.reset.nativeElement, 'click');

    startTimer$.subscribe(res => {
      if (this.checkStateTimer == 'start') {
        this.subscription = this.interval.subscribe(resp => {
          this.title++
        });
        this.checkStateTimer = 'stop';
      } else {
        this.subscription.unsubscribe();
        this.checkStateTimer = 'start';
        this.title = 0;
      }
    });

    resetTimer$.subscribe(res => {
      this.title = 0;
    })

  }

  ngAfterViewInit() {
    this.waitClicked();
  }

  waitClicked() {
    const mouse$ = fromEvent(this.wait.nativeElement, 'click');
    const buff$ = mouse$.pipe(
      debounceTime(300),
    );

    const click$ = mouse$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    ).subscribe(() => {
      if(this.checkStateTimer == 'stop'){
        this.checkStateTimer = 'start';
      }
      this.subscription.unsubscribe();
    });

  }

}
