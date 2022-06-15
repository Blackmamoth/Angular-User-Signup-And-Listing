import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMedicinesComponent } from './user-medicines.component';

describe('UserMedicinesComponent', () => {
  let component: UserMedicinesComponent;
  let fixture: ComponentFixture<UserMedicinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMedicinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMedicinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
