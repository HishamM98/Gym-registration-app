import { NgToastService } from 'ng-angular-popup';
import { ApiService } from './../services/api.service';
import { User } from './../models/user.model';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss'],
})
export class RegistrationListComponent implements OnInit {
  dataSource!: MatTableDataSource<User>;
  users!: User[];
  // displayedColumns!: string[];
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'bmiResult',
    'gender',
    'requireTrainer',
    'package',
    'enquiryDate',
    'action',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private api: ApiService,
    private router: Router,
    private confirm: NgConfirmService,
    private toastService: NgToastService
  ) {
    this.getUsers();
  }

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUsers() {
    this.api.getRegisteredUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.dataSource = new MatTableDataSource(this.users);
        // this.displayedColumns = Object.keys(data[0]);
        // console.log(this.displayedColumns);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  edit(id: number): void {
    this.router.navigate(['update', id]);
  }

  delete(id: number): void {
    this.confirm.showConfirm(
      'Confirm Deletion',
      () => {
        this.api.deleteRegisteredUser(id).subscribe({
          next: (res) => {
            this.toastService.success({
              detail: 'Success',
              summary: 'Enquiry Deleted Successfully',
              duration: 3000,
            });
            this.getUsers();
          },
          error: (err) => {
            this.toastService.error({
              detail: 'Failed',
              summary: 'Enquiry Deletion Failed',
              duration: 3000,
            });
          },
        });
      },
      () => {
        this.confirm.closeConfirm();
      }
    );
  }
}
