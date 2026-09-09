import { Component, OnInit, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, SlicePipe } from '@angular/common';

interface Movie {
  id: number;
  name: string;
  genres: string[] | null;
  runtime: number | null;
  premiered: string | null;
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe, SlicePipe],
  templateUrl: './movies.html'
})
export class Movies implements OnInit {
age=45
  private readonly API_URL = 'https://api.tvmaze.com/shows';

  // Signals: state that the template reads. Updating these via .set()
  // schedules a re-render even outside zone.js's auto-detection, which
  // matters for callbacks (like HTTP subscribe) that fire asynchronously.
  shows = signal<Movie[]>([]);
  currentPage = signal(1);      // 1-based page shown to the user
  hasNextPage = signal(true);   // TVMaze doesn't give a total count, so we
                                 // detect the end by getting an empty page back.
  loading = signal(false);
  errorMessage = signal('');

  // Plain fields are fine here: these are only read when the user clicks
  // Search/Sort (an Angular event, which does trigger change detection),
  // never mutated from an async callback.
  searchQuery = '';
  sortBy = 'rating';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const apiPage = this.currentPage() - 1; // TVMaze pages are 0-based
    const params = new HttpParams().set('page', apiPage);

    this.http.get<Movie[]>(this.API_URL, { params }).subscribe({
      next: (results) => {
        this.hasNextPage.set(results.length > 0);
        // Note: search only filters the 20 shows on THIS page, so it's only
        // applied when the user is actively searching, not on every page nav.
        // Otherwise a query that matched page 1 could wipe out page 2's grid
        // even though page 2 loaded fine.
        const filtered = this.searchQuery.trim()
          ? this.applySearch(results ?? [])
          : (results ?? []);
        this.shows.set(this.applySort(filtered));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load TV shows. Please try again.');
        this.shows.set([]);
        this.loading.set(false);
      }
    });
  }

  private applySearch(shows: Movie[]): Movie[] {
    const query = this.searchQuery.trim().toLowerCase();
    return shows.filter(show => show.name.toLowerCase().includes(query));
  }

  private applySort(shows: Movie[]): Movie[] {
    const result = [...shows];

    switch (this.sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0));
        break;
      case 'year':
        result.sort((a, b) =>
          Number(b.premiered?.slice(0, 4) ?? 0) - Number(a.premiered?.slice(0, 4) ?? 0)
        );
        break;
      case 'title':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }

  search(): void {
    this.currentPage.set(1);
    this.loadPage();
  }

  changeSort(): void {
    this.loadPage();
  }

  nextPage(): void {
    if (!this.hasNextPage() || this.loading()) return;
    this.currentPage.update(p => p + 1);
    this.loadPage();
  }

  previousPage(): void {
    if (this.currentPage() <= 1 || this.loading()) return;
    this.currentPage.update(p => p - 1);
    this.loadPage();
  }

  trackByMovieId(_index: number, movie: Movie): number {
    return movie.id;
  }
}