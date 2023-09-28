import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

//este servicio en root =>  es alcazabe en todo los modulos
@Injectable({providedIn: 'root'})
export class GifsService {
  //lista de objetos para lanzar las imagenes
  public gifsList: Gif[] = [];
   //x seguridad de los datos se recomienda usar private en los servicios asi no pueden ser manipulados facilmente
   private _tagsHistory: String[] = [] ;
   private serviceUrl : string = 'https://api.giphy.com/v1/gifs'
   private apiKey: string = 'dRzl1mHyCq8Baeg4Jkj7hB89dI7KJlzc';
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:  string){
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag => oldTag !== tag)) ;
    }
    this._tagsHistory.unshift(tag) ;

    this._tagsHistory = this.tagsHistory.splice(0,10) ;
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history' , JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;
      this._tagsHistory = JSON.parse(localStorage.getItem('history')!) ;

      if(this._tagsHistory.length === 0) return ;
      this.searchTag(this._tagsHistory[0]) ;
  }

  searchTag(tag:any) : void{

    if (tag.length === 0) return;
    this.organizeHistory(tag)

    const params  = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit','10')
    .set('q',tag)


    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`,{params})
    .subscribe(resp=>{
      this.gifsList= resp.data
      console.log({gifs: this.gifsList});

    })

  }

}
