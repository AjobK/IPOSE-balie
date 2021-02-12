    import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
    import { NgForm } from '@angular/forms';
    import { Subscription } from 'rxjs';
import { Assignment } from '../shared/models/assignment.model';
    import { Review } from '../shared/models/review.model';
    import { AccountService } from '../shared/services/account.service';
import { AssignmentService } from '../shared/services/assignment.service';
    import { ReviewService } from '../shared/services/review.service';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
    @Output() reviewList: Review[] = [];
    reviewsChangedSubscription: Subscription;
    @ViewChild('reviewForm') form: NgForm;
    reviewRequestSubscription: Subscription;

    constructor(
        public reviewService: ReviewService,
        public accountService: AccountService,
        public assignmentService: AssignmentService,
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
        if (this.reviewsChangedSubscription) this.reviewsChangedSubscription.unsubscribe();
        if (this.reviewRequestSubscription) this.reviewRequestSubscription.unsubscribe();
    }

    onSubmit(form: NgForm) {
        this.reviewRequestSubscription = this.reviewService.createReview({
            studentNumber: form.value.studentNumber,
            assignmentId: 1
        })
        .subscribe(
            () => {
                this.reviewService.fetchReviews();
            },
            () => {
                this.reviewService.fetchReviews();
            }
        )
    }

    setAssignment(assignment: Assignment): void {
        this.assignmentService.setAssignment(assignment);
    }
}