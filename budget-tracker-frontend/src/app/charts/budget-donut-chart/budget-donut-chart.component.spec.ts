import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetDonutChartComponent } from './budget-donut-chart.component';

describe('BudgetDonutChartComponent', () => {
  let component: BudgetDonutChartComponent;
  let fixture: ComponentFixture<BudgetDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetDonutChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
