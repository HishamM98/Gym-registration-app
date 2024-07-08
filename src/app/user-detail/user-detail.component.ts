import { User } from './../models/user.model';
import { ApiService } from './../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  userId!: number;
  userData!: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.getUser();
  }

  getUser() {
    this.api.getUser(this.userId).subscribe({
      next: (res) => {
        this.userData = res;
      },
      error: (err) => alert(err.message),
    });
  }
}
