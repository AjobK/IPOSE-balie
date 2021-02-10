import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Review } from 'src/app/shared/models/review.model';
import { AccountService } from 'src/app/shared/services/account.service';
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
    @Input() index: number;
    reviewRequestSubscription: Subscription;

    constructor(public reviewService: ReviewService, public accountService: AccountService) { }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        if (this.reviewRequestSubscription)
            this.reviewRequestSubscription.unsubscribe();
    }

    assign(): void {
        this.reviewService.setAssigned(this.review.id)
        .subscribe(
            (res: HttpResponse<any>) => {
                this.reviewService.fetchReviews()
            },
            (res: HttpResponse<any>) => {
                this.reviewService.fetchReviews()
            }
        )
    }
}
