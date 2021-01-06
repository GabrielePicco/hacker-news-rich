import { TestBed } from '@angular/core/testing';

import { HackerNewsSearchService } from './hacker-news-search.service';

describe('HackerNewsSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HackerNewsSearchService = TestBed.get(HackerNewsSearchService);
    expect(service).toBeTruthy();
  });
});
