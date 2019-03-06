import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubmitComponent } from './modal-submit.component';

describe('ModalSubmitComponent', () => {
  let component: ModalSubmitComponent;
  let fixture: ComponentFixture<ModalSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
