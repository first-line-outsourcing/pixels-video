import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public images = [];
  public page = 1;
  public str = '';
  public term: FormControl;

  constructor() {
  }

  public ngOnInit(): void {
    this.term = new FormControl(this.str);
    this.term.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe();
  }

  public onScroll() {
    this.page++;
  }
}
