import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  packages: string[] = ['Monthly', 'Quarterly', 'Yearly'];
  genders: string[] = ['Male', 'Female'];
  importantList: string[] = [
    'Toxic Fat Reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healthier Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];
  registerForm!: FormGroup;

  userIdToUpdate!: number;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastService: NgToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      weight: ['', Validators.min(40)],
      height: ['', Validators.min(1.3)],
      bmi: [''],
      bmiResult: [''],
      gender: ['', Validators.required],
      requireTrainer: ['', Validators.required],
      package: ['', Validators.required],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: ['', Validators.required],
    });

    this.registerForm.controls['height'].valueChanges.subscribe(() => {
      this.calculateBmi();
    });

    if (this.activatedRoute.snapshot.url[0].path == 'update') {
      this.userIdToUpdate = Number(
        this.activatedRoute.snapshot.paramMap.get('id')
      );
      this.api.getUser(this.userIdToUpdate).subscribe((res) => {
        this.registerForm.patchValue(res);
      });
    }
  }

  submit(): void {
    // console.log(this.registerForm.value);
    this.api.postRegistration(this.registerForm.value).subscribe({
      next: (res) => {
        this.toastService.success({
          detail: 'Success',
          summary: 'Enquiry Added',
          duration: 3000,
        });
        this.registerForm.reset();
      },
      error: (err) => {
        this.toastService.error({
          detail: 'Failed',
          summary: err.message,
          duration: 3000,
        });
      },
    });
  }

  update(): void {
    this.api
      .updateRegisteredUser(this.registerForm.value, this.userIdToUpdate)
      .subscribe({
        next: (res) => {
          this.toastService.success({
            detail: 'Success',
            summary: 'Enquiry Updated',
            duration: 3000,
          });
          this.registerForm.reset();
          setTimeout(() => {
            this.router.navigate(['list']);
          }, 2000);
        },
        error: (err) => {
          this.toastService.error({
            detail: 'Failed',
            summary: err.message,
            duration: 3000,
          });
        },
      });
    // this.registerForm.reset();
  }

  calculateBmi(): void {
    const weight = this.registerForm.value.weight;
    const height = this.registerForm.value.height;
    const bmi = weight / Math.pow(height, 2);
    this.registerForm.controls['bmi'].patchValue(bmi);
    if (bmi < 18.5) {
      this.registerForm.controls['bmiResult'].patchValue('Underweight');
    } else if (bmi >= 18.5 && bmi < 25) {
      this.registerForm.controls['bmiResult'].patchValue('Normal');
    } else {
      this.registerForm.controls['bmiResult'].patchValue('Overweight');
    }
  }
}
