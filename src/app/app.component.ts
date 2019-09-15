import { PixelsService } from './pixels.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  mergeMap,
  tap,
  combineLatest,
  scan,
  filter,
  pairwise,
  map,
} from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  items$: Observable<any[]>;
  str = '';
  term: FormControl;
  apiKey: FormControl;
  page = new BehaviorSubject(1);

  constructor(private pixels: PixelsService) {}

  ngOnInit(): void {
    this.term = new FormControl(this.str);
    const term$ = this.term.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      filter(term => term),
      tap(() => this.page.next(1))
    );
    this.items$ = term$.pipe(
      combineLatest(this.page.asObservable()),
      mergeMap(([term, page]) => this.pixels.searchVideo(term, page.toString())),
      scan((acc, data) => this.page.getValue() === 1 ? data : [...acc, ...data], [])
    );

    this.apiKey = new FormControl(this.pixels.apiKey, Validators.required);
    this.apiKey.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(term => term)
      )
      .subscribe(val => (this.pixels.apiKey = val));
  }

  onScroll() {
    this.page.next(this.page.getValue() + 1);
  }
  getVideoUrl(item, type): string {
    const foundVideo = item.video_files.find(video => video.quality === type);
    return foundVideo ? foundVideo.link : item.video_files[0].link;
  }
}
