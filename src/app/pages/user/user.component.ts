import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from './article.service';
import { Article } from './article';
import { Subscription, Subject, of } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  isAdmin = true; 
  articles: Article[] = [];
  articlesPerPage = 9;
  currentPage = 1;
  totalPages = 0;
  isLoading = true;
  error: string | null = null;
  showModal = false;
  showEditModal = false;
  newArticle: Article = { id: 0, title: '', date: '', body: '', imageUrl: '' };
  articleToEdit: Article | null = null;
  private ngUnsubscribe = new Subject<void>();



  confirmDelete(articleId: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      this.onDeleteArticle(articleId);
    }
  }



  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.isLoading = true;
    this.error = null;
    this.articleService.getArticles()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(error => {
          this.error = error.message || 'Une erreur est survenue.';
          this.isLoading = false;
          return of([]); 
        }),
        map(articles => {
          this.totalPages = Math.ceil(articles.length / this.articlesPerPage);
          return articles;
        })
      )
      .subscribe(articles => {
        this.articles = articles;
        this.isLoading = false;
      });
  }


  onAddArticle(): void {
    this.showModal = true;
  }

  onArticleAdded(): void {
    this.articleService.addArticle(this.newArticle)
      .pipe(takeUntil(this.ngUnsubscribe), catchError(error => {
        this.error = error.message || 'Erreur lors de l\'ajout.';
        return of(null);
      }))
      .subscribe(article => {
        if (article) {
          
          this.totalPages = Math.ceil(this.articles.length / this.articlesPerPage);
          this.showModal = false;
          this.newArticle = { id: 0, title: '', date: '', body: '', imageUrl: '' };
        }
      });
  }


  onEditArticle(article: Article): void {
    this.articleToEdit = { ...article };
    this.showEditModal = true;
  }

  onArticleUpdated(): void {
    if (this.articleToEdit) {
      this.articleService.updateArticle(this.articleToEdit)
        .pipe(takeUntil(this.ngUnsubscribe), catchError(error => {
          this.error = error.message || 'Erreur lors de la mise à jour.';
          return of(null);
        }))
        .subscribe(article => {
          if (article) {
            this.loadArticles();
            this.showEditModal = false;
            this.articleToEdit = null;
          }
        });
    }
  }

  onDeleteArticle(articleId: number): void {
    this.articleService.deleteArticle(articleId)
      .pipe(takeUntil(this.ngUnsubscribe), catchError(error => {
        this.error = error.message || 'Erreur lors de la suppression.';
        return of(null);
      }))
      .subscribe(() => this.loadArticles());
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  get paginatedArticles(): Article[] {
    const startIndex = (this.currentPage - 1) * this.articlesPerPage;
    const endIndex = startIndex + this.articlesPerPage;
    return this.articles.slice(startIndex, endIndex);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getRange(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  onCloseModal(): void {
    this.showModal = false;
    this.newArticle = { id: 0, title: '', date: '', body: '', imageUrl: '' };
  }
}