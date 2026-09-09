import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactDetails } from './contact-details';

describe('ContactDetails', () => {
  let component: ContactDetails;
  let fixture: ComponentFixture<ContactDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDetails],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
