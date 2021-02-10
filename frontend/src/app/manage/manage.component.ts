import { Component, ElementRef, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Review } from '../shared/models/review.model';
import { ReviewService } from '../shared/services/review.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @Output() reviewList: Review[] = [];
  reviewsChangedSubscription: Subscription;

  constructor(
    public reviewService: ReviewService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.reviewService.fetchReviews();
    this.reviewList = this.reviewService.getReviews();

    this.reviewsChangedSubscription = this.reviewService.reviewsChanged.subscribe(() => this.reviewList = this.reviewService.getReviews())

    this.elementRef.nativeElement.ownerDocument.body.classList.add('grey-body');
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.ownerDocument.body.classList.remove('grey-body');
    this.reviewsChangedSubscription.unsubscribe();
  }
}