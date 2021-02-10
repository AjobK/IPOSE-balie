import { Component, Input, OnInit } from '@angular/core';
import { Review } from 'src/app/shared/models/review.model';
import { ReviewService } from 'src/app/shared/services/review.service';

@Component({
  selector: 'app-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss']
})
export class CheckoutItemComponent implements OnInit {
  @Input() review: Review;
  @Input() noButtons: boolean = false;
  @Input() adminView: boolean = false;
  @Input() customClasses: string;

  constructor(public reviewService: ReviewService) { }

  ngOnInit(): void {
    console.log(this.review)
  }
}
