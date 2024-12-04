import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Article } from './article';
import {catchError, map} from 'rxjs/operators';
import { tap } from 'rxjs/operators'; 


@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private articles: Article[] = []; 

  constructor(private http: HttpClient) { }

  getArticles(): Observable<Article[]> {
    if (this.articles.length > 0) {
      return of(this.articles); 
    }
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(posts => posts.map(post => ({
        id: post.id,
        title: post.title,
        date: new Date().toISOString(),
        body: post.body,
        imageUrl: post.imageUrl
      }))),
      catchError(error => {
        console.error('Error fetching articles:', error);
        return throwError(() => new Error('Failed to fetch articles'));
      })
    ).pipe(
      map(articles => {
        this.articles = articles; 
        return articles;
      })
    );
  }



  addArticle(article: Article): Observable<Article> {
    const newArticle = { ...article, id: this.generateUniqueId() };
    const newArticleObservable = of(newArticle);

    newArticleObservable.pipe(
      tap(newArticle => this.articles.push(newArticle))
    ).subscribe();

    return newArticleObservable;
  }
  
  generateUniqueId(): number {
    return this.articles.length > 0 ? Math.max(...this.articles.map(article => article.id)) + 1 : 1;
  }

  updateArticle(article: Article): Observable<Article> {
    const index = this.articles.findIndex(a => a.id === article.id);
    if (index !== -1) {
      this.articles[index] = article;
      return of(article);
    } else {
      return throwError(() => new Error('Article not found'));
    }
  }

  deleteArticle(id: number): Observable<void> {
    const index = this.articles.findIndex(a => a.id === id);
    if (index !== -1) {
      this.articles.splice(index, 1);
      return of(undefined);
    } else {
      return throwError(() => new Error('Article not found'));
    }
  }
}