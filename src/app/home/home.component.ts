import { Component, OnDestroy, OnInit } from "@angular/core";
import { ApiService } from "../services/api-service";
import { City } from "../models/city.model";
import { PrayerTimes } from "../models/prayer-times.model";
import { FormsModule } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ApiService],
  imports: [FormsModule]
})
export class HomeComponent implements OnInit, OnDestroy{

    searchTirm : string = "";
    showContent : boolean = false; //to hide the contnet when is no data to disply
    loading: boolean = false; //to check if is loading to play the animation and when the result reurn puse it

    //create a object with type Subscription to unsubscripe when the component is destroied:
    citySub! :Subscription; 
    timesSub! :Subscription;

    constructor(private apiService: ApiService) { }
    ngOnDestroy(){
       //ما كان يزبط ال takeUntilDestroyed():
        this.citySub.unsubscribe();
        this.timesSub.unsubscribe();
    }
    ngOnInit(){
        this.searchTirm = "azaz"; //defualt value
        this.searchAboutCity();
    }

    //initializing the city with empty strings
    city : City = {
        name: "",
        latitude: 0.0,
        longitude: 0.0,
        country: ""
    } ;

    //initializing the prayer times with empty strings
    prayerTimes : PrayerTimes = {
        Fajr: "",
        Imsak: "",
        Sunrise: "",
        Dhuhr: "",
        Asr: "",
        Maghrib: "",
        Isha: "",
        dayName: "",
        hijriDay:"",
        hijriMonthName: "",
        hijriYear : "" 
    };

    //to search about the city by the name then get the prayer times by calling getPrayerTimes:
    searchAboutCity(){
        if(this.searchTirm.trim()){
            this.loading = true; //play the animation and hide the content
            this.showContent = false;
            
            this.citySub = this.apiService.getCity(this.searchTirm)
            .subscribe( res => {
                if(res.results && res.results.length > 0){
                this.city.name = res.results[0].name;
                this.city.latitude = res.results[0].latitude;
                this.city.longitude = res.results[0].longitude
                this.city.country = res.results[0].country;
                console.log(res);
                this.getPrayerTimes(this.getDateASString(), this.city.latitude, this.city.longitude);
                this.showContent = true;
                }else{
                    this.loading = false; //puse the animation when the result return with error
                    alert("يرجى إدخال قيم صحيحة"); 
                }
            },
            error => {
                alert("نحن نعتذر يبدو أنه حدث خطأ غير متوقع يرجى إعادة المحاولة");
                this.loading = false;
            }
        );
        }
        else{
            alert("الرجاء ادخال قيمة للبحث عنها");
        }
    }
    

    //to get the prayer times by date and langitude and longitude 
    //I created it in spread function to make it more readable "Sorry Teacher"
    private getPrayerTimes(date : string, latitude : number, longitude : number){
        this.timesSub = this.apiService
            .getPrayerTimes(date, latitude, longitude)
            .subscribe( res => { //get the target info from the result 
                const hijryDay = res.data.date.hijri.day;
                const dayName = res.data.date.hijri.weekday.ar;
                const hijriMonthName = res.data.date.hijri.month.ar;
                const hijriYear = res.data.date.hijri.year;
                this.prayerTimes = {
                    Fajr: res.data.timings.Fajr,
                    Imsak: res.data.timings.Imsak,
                    Sunrise: res.data.timings.Sunrise,
                    Dhuhr: res.data.timings.Dhuhr,
                    Asr: res.data.timings.Asr,
                    Maghrib: res.data.timings.Maghrib,
                    Isha: res.data.timings.Isha,
                    dayName : dayName,
                    hijriDay: hijryDay,
                    hijriMonthName: hijriMonthName,
                    hijriYear: hijriYear 
                };
                this.loading = false;//puse the animation when the result return successfully and disply the data 
                this.showContent = true;
            },
            (error) =>{
                alert("نحن نعتذر يبدو أنه حدث خطأ غير متوقع يرجى إعادة المحاولة");
                this.loading = false;
            }
        );
    }

    //to get current date then return it as string to use it in request formating by yyyy-mm-dd
    getDateASString(extraDays : number = 0){
        let today = new Date();
        today.setDate(today.getDate() + extraDays);
        let day = String(today.getDate()).padStart(2, '0');
        let month = String(today.getMonth() + 1).padStart(2, '0'); 
        let year = today.getFullYear();
        let date = day + "-" + month + "-" + year;
        return date;
    }
}