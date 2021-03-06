import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  heroes: Hero[] = new Array();
  data: string[] = new Array();

  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }

  private heroesUrl = 'api/heroes'
  private dataUrl = 'api/file'
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }

  ngOnInit(): void {
    this.getHeroes().subscribe(heroes => this.heroes = heroes);
    console.log("Init Hero Service heroes Array: ", this.heroes);
    this.messageService.add("Init Hero Service heroes Array");

    this.getData().subscribe(data => this.data = data);
    console.log("Init Data Service data Array: ", this.data);
    this.messageService.add("Init Data Service data Array");
  }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => console.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /** GET Data from the server */
  getData(): Observable<string[]> {
    return this.http.get<string[]>(this.dataUrl)
      .pipe(
        tap(_ => console.log('fetched data')),
        catchError(this.handleError<string[]>('getStrings', []))
      );
  }

  getHero(id: number | undefined): Promise<Hero> {
    //const url = `${this.heroesUrl}/${id}`;
    const url = `/api/hero/${id}`

    // TODO: send the message _after_ fetching the hero
    if (id) {
      this.messageService.add(`HeroService: fetched hero id=${id}`);
    }

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id =${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    ).toPromise();
  }

  async putHero(hero: Hero): Promise<void> {
    const url: string = `/api/hero/${hero.id}`
    await this.http.put<Hero>(url, hero).toPromise()

  }
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
