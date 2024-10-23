import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestGenerate, Response1, Response2 } from '../models/prodia.model';

@Injectable({
  providedIn: 'root'
})
export class ProdiaService {

  private readonly API_URL = 'http://localhost:8082/api/prodia';
  
  constructor(private http: HttpClient) { }

  generateImageSDXL(request: RequestGenerate): Observable<Response1> {
    return this.http.post<Response1>(`${this.API_URL}/generate`, request);
  }

  getJobResult(request: Response1): Observable<Response2> {
    return this.http.post<Response2>(`${this.API_URL}/get-job`, request);
  }
}