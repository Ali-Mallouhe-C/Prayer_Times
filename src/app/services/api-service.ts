import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { City } from "../models/city.model";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ApiService {
    
    //the base url of get city api:
    private cityApiURL : string = "https://geocoding-api.open-meteo.com/v1/search";
    
    //the base url of get prayer timings api:
    private prayerTimesApiUrl = 'https://api.aladhan.com/v1/timings';
    
    //inject the httpclient in the construcore:
    constructor(private http: HttpClient) { }

    //function to get the data from the end points:
    getCity(searchTirm : string) : Observable<any>{
        return this.http.get<City>(`${this.cityApiURL}?name=${searchTirm}&count=1`);
    }

    getPrayerTimes(date : string, latitude : number, longitude : number) : Observable<any>{
        return this.http.get<any>(`${this.prayerTimesApiUrl}/${date}?latitude=${latitude}&longitude=${longitude}`);
    }
}