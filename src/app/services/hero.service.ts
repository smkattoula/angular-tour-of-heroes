import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { HEROES } from '../mock-heroes';
import { Hero } from '../Hero';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  // log a HeroService message with the MessageService
  private log(message: string) {
    this.messageService.add(`Hero Service: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // get all heroes
  getHeroes(): Observable<Hero[]> {
    const heroes = this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
    return heroes;
  }

  // get a single hero
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    const hero = this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>('getHero id = ${id}'))
    );
    return hero;
  }

  // update an existing hero
  updateHero(hero: Hero): Observable<any> {
    const updatedHero = this.http
      .put<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((_) => this.log(`updated hero id = ${hero.id} `)),
        catchError(this.handleError<any>('updateHero'))
      );
    return updatedHero;
  }

  // add a new hero to the server
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id = ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
}
