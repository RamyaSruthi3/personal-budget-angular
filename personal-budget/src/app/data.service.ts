import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Datasource, Datasource1 } from './datasource';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DataService {

  private dataSource1: Datasource1 = [];

  private dataSource: Datasource = {
    datasets: [
      {
        data: []
      }
    ],
    labels: []
  };

  private apiUrl: string = "http://localhost:3000/budget";

  constructor(private http: HttpClient) { }

  // Fetch data from the backend API
  fetchDataFromBackend(): Observable<{ myBudget: Datasource1 }> {
    if (this.dataSource1.length === 0) { //dataSource1 will be checked here
        return this.http.get<{ myBudget: Datasource1 }>(this.apiUrl).pipe(
            tap(response => {
                this.setDataSource1(response.myBudget);
            })
        );
    } else {
        return of({ myBudget: this.dataSource1 });
    }
  }

  // Set the data source
  setDataSource(data: Datasource): void {
    this.dataSource = data;
  }

  // Set the dataSource1
  setDataSource1(data: Datasource1): void {
    this.dataSource1 = data;
  }

  // Get the data source
  getDataSource(): Datasource {
    return this.dataSource;
  }

  // Get the dataSource1
  getDataSource1(): Datasource1 {
    return this.dataSource1;
  }
}
