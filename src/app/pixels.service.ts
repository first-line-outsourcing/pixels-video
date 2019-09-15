import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PixelsService {
  private baseUrl = 'https://api.pexels.com/';
  private key: string;

  constructor(private http: HttpClient) {
    this.key = localStorage.getItem('pixelsKey') || '';
  }

  get apiKey(): string {
    return this.key;
  }
  set apiKey(value: string) {
    this.key = value;
    localStorage.setItem('pixelsKey', value);
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.apiKey });
  }
  searchVideo(term: string, page = '1') {
    const params = new HttpParams({
      fromObject: {
        query: term,
        per_page: '15',
        page,
      },
    });

    return this.http
      .get(`${this.baseUrl}/videos/search`, { headers: this.headers, params })
      .pipe(map((res: HttpResponse<any>) => (res as any).videos));
  }
}
