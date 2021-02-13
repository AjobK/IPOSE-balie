import { Subject } from 'rxjs';
import { Review } from '../models/review.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { AssignmentService } from './assignment.service';

@Injectable()
export class ReviewService {
  private reviews: Review[] = [];
  reviewsChanged = new Subject<Review[]>();
  private takenReviews: Review[] = [];
  takenReviewsChanged = new Subject<Review[]>();

  constructor(
    private http: HttpClient,
    private assignmentService: AssignmentService
  ) {
    this.reviewsChanged.next(this.reviews);
    this.fetchReviews();
    
    this.takenReviewsChanged.next(this.takenReviews);

    assignmentService.currentAssignmentChanged.subscribe(() => {
      this.fetchReviews();
      this.fetchTakenReviews();
    });
  }

  fetchReviews() {
    this.http
      .get<any>(
        environment.API_URL + '/api/review',
        environment.DEFAULT_HTTP_OPTIONS
      )
      .subscribe((res: HttpResponse<any>) => {
        this.reviews = [];
        res.body.reviews.map((review) => {
          this.reviews.push(
            new Review(
              review.id,
              review.student_number,
              review.request_time,
              review.assignment_id
            )
          );
        });

        this.reviews = this.reviews.filter((i) => {
          return (
            i.assignmentId ==
            (this.assignmentService.currentAssignment
              ? this.assignmentService.currentAssignment.id
              : i.assignmentId)
          );
        });

        this.reviewsChanged.next(this.reviews);
      });
  }

  fetchTakenReviews() {
    return this.http.get<any>(
      environment.API_URL + `/api/review/taken`,
      environment.DEFAULT_HTTP_OPTIONS
    )
    .subscribe((res: HttpResponse<any>) => {
      this.takenReviews = [];
      res.body.reviews.map((review) => {
        this.takenReviews.push(
          new Review(
            review.id,
            review.student_number,
            review.request_time,
            review.assignment_id
          )
        );
      });

      this.takenReviews = this.takenReviews.filter((i) => {
        return (
          i.assignmentId ==
          (this.assignmentService.currentAssignment
            ? this.assignmentService.currentAssignment.id
            : i.assignmentId)
        );
      });

      this.takenReviewsChanged.next(this.takenReviews);
    });
  }


  setReviews(reviews: Review[]) {
    this.reviews = reviews;
  }

  getReviews() {
    return this.reviews.slice();
  }

  getTakenReviews() {
    return this.takenReviews.slice();
  }

  getReview(index: number) {
    return this.reviews[index];
  }

  getReviewById(id: number) {
    return this.http.get<any>(
      environment.API_URL + `/api/review/${id}`,
      environment.DEFAULT_HTTP_OPTIONS
    );
  }

  updateReviewById(
    reviewData: {
      artist: string;
      name: string;
      origin: string;
      cost: number;
      year: number;
      imageUrl: string;
    },
    id: number
  ) {
    return this.http.put<any>(
      environment.API_URL + `/api/review/${id}`,
      reviewData,
      environment.DEFAULT_HTTP_OPTIONS
    );
  }

  createReview(reviewData: { studentNumber: string; assignmentId: number }) {
    return this.http.post<any>(
      environment.API_URL + `/api/review`,
      reviewData,
      environment.DEFAULT_HTTP_OPTIONS
    );
  }

  removeReview(review: Review) {
    this.http
      .delete<any>(
        environment.API_URL + `/api/review/${review.id}`,
        environment.DEFAULT_HTTP_OPTIONS
      )
      .pipe(first())
      .subscribe((res: HttpResponse<any>) => {
        for (let i = 0; i < this.reviews.length; i++) {
          if (this.reviews[i].id == review.id) {
            this.reviews.splice(i, 1);
            this.reviewsChanged.next(this.reviews);
            break;
          }
        }
      });
  }

  setAssigned(index: number) {
    return this.http.patch<any>(
      environment.API_URL + `/api/review/${index}`,
      {},
      environment.DEFAULT_HTTP_OPTIONS
    );
  }
}
