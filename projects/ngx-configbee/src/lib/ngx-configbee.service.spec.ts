import { TestBed } from '@angular/core/testing';

import { NgxConfigbeeService } from './ngx-configbee.service';

describe('NgxConfigbeeService', () => {
  let service: NgxConfigbeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxConfigbeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
