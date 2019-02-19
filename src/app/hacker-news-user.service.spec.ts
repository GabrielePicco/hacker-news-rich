import { TestBed } from '@angular/core/testing';

import { HackerNewsUserService } from './hacker-news-user.service';

describe('HackerNewsUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HackerNewsUserService = TestBed.get(HackerNewsUserService);
    expect(service).toBeTruthy();
  });
});
