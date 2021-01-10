import { TestBed } from '@angular/core/testing';

import { GoogleImagesService } from './google-images.service';

describe('GoogleImagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleImagesService = TestBed.get(GoogleImagesService);
    expect(service).toBeTruthy();
  });
});
