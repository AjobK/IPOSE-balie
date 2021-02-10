import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AccountService } from '../shared/services/account.service';
import { Account } from '../shared/models/account.model';
import { ReviewService } from '../shared/services/review.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @ViewChild('authForm') form: NgForm;
    @Output() hasErrors: boolean = false
    isLoading = false;
    accountService: AccountService;
    accountChangedSubscription: Subscription;

    constructor(
        private elementRef: ElementRef,
        private router: Router,
        private reviewService: ReviewService
    ) { }

    ngOnInit(): void {}

    onSubmit(form: NgForm) {
        this.accountService.login(form.value.username, form.value.password)
        .subscribe(
            (res: HttpResponse<any>) => {
                const { username, id } = res.body;
                
                this.accountService.account = new Account(id, username || '?');
                this.accountService.accountChanged.next(this.accountService.account);

                this.reviewService.fetchReviews();

                this.router.navigate(['/']);
            },
            () => {
                this.hasErrors = true;
                this.form.reset();

                this.form.statusChanges.pipe(first()).subscribe(res => { if (this.hasErrors) this.hasErrors = false; });
            }
        )
    }

    ngOnDestroy(): void {
        this.elementRef.nativeElement.ownerDocument.body.classList.remove('grey-body');
        this.accountChangedSubscription.unsubscribe();
    }
}
