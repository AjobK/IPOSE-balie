import { Subject } from 'rxjs';
import { Review } from '../models/review.model';
import {
    HttpClient,
    HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';

@Injectable()
export class ReviewService {
    private reviews: Review[] = [];

    reviewsChanged = new Subject<Review[]>();

    constructor(
        private http: HttpClient,
    ) {
        this.fetchReviews();
    }

    fetchReviews() {
        this.reviewsChanged.next(this.reviews);

        this.http
        .get<any>(environment.API_URL + '/api/review', environment.DEFAULT_HTTP_OPTIONS)
        .subscribe(
            (res: HttpResponse<any>) => {
                this.reviews = [];
                res.body.reviews.map((review) => {
                    this.reviews.push(new Review(
                        review.id,
                        review.studentNumber,
                        review.requestTime,
                        review.assignmentId
                    ))
                })

                this.reviewsChanged.next(this.reviews);
            }
        )
    }

    setReviews(reviews: Review[]) {
        this.reviews = reviews;
    }

    getReviews() {
        return this.reviews.slice();
    }

    getReview(index: number) {
        return this.reviews[index];
    }

    getReviewById(id: number) {
        return this.http
        .get<any>(environment.API_URL + `/api/review/${id}`, environment.DEFAULT_HTTP_OPTIONS)
    }

    updateReviewById(reviewData: {
        artist: string,
        name: string,
        origin: string,
        cost: number,
        year: number,
        imageUrl: string
    }, id: number) {

        return this.http
        .put<any>(environment.API_URL + `/api/review/${id}`, reviewData, environment.DEFAULT_HTTP_OPTIONS)
    }

    createReview(reviewData: {
        artist: string,
        name: string,
        origin: string,
        cost: number,
        year: number,
        imageUrl: string
    }) {
        return this.http
        .post<any>(environment.API_URL + `/api/review`, reviewData, environment.DEFAULT_HTTP_OPTIONS)
    }

    removeReview(review: Review) {
        this.http
        .delete<any>(environment.API_URL + `/api/review/${review.id}`, environment.DEFAULT_HTTP_OPTIONS)
        .pipe(first())
        .subscribe(
            (res: HttpResponse<any>) => {
                for (let i = 0; i < this.reviews.length; i++) {
                    if (this.reviews[i].id == review.id) {
                        this.reviews.splice(i, 1);
                        this.reviewsChanged.next(this.reviews);
                        break;
                    }
                }
            }
        )
    }
}
