import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAncicateComponent } from './add-ancicate.component';

describe('AddAncicateComponent', () => {
  let component: AddAncicateComponent;
  let fixture: ComponentFixture<AddAncicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAncicateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAncicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
