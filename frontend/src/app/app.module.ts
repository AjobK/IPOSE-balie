import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReviewService } from './shared/services/review.service';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { HamburgerComponent } from './shared/hamburger/hamburger.component';
import { CheckoutItemComponent } from './checkout/checkout-item/checkout-item.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageComponent } from './manage/manage.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { AccountService } from './shared/services/account.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HamburgerComponent,
    CheckoutItemComponent,
    LoginComponent,
    ManageComponent,
    PopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AccountService, ReviewService],
  bootstrap: [AppComponent]
})
export class AppModule { }
