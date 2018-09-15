import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCapturePage } from './photo-capture.page';

describe('PhotoCapturePage', () => {
  let component: PhotoCapturePage;
  let fixture: ComponentFixture<PhotoCapturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoCapturePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCapturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
