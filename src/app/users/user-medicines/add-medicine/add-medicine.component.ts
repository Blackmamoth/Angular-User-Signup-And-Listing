import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../User';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.css']
})
export class AddMedicineComponent implements OnInit {

  constructor(private userService: UsersService, private router: Router) { }

  _id: string;

  medicines: FormArray = new FormArray([])
  medicineForm: FormGroup;
  user: User;
  showAlertMessage: boolean = false;
  alertMessage: string = null;


  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData'))
    this._id = userData._id

    this.medicineForm = new FormGroup({
      'medicines': this.medicines
    })

    this.userService.getUser(this._id).subscribe(user => {
      this.user = user
      if (this.user.medicines) {
        user.medicines.forEach(medicine => {
          this.medicines.push(new FormControl(medicine))
        })
      }
    })
  }

  onAddMedicine() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.medicineForm.get('medicines')).push(control)
  }

  getMedicineControls() {
    return (<FormArray>this.medicineForm.get('medicines')).controls;
  }

  onSubmit() {
    let medicines: string[] = this.medicineForm.get('medicines').value
    medicines = medicines.filter(m => m !== null && m !== '')
    if (medicines.length === 0) {
      this.showAlertMessage = true;
      this.alertMessage = "Please don't leave the inputs blank"
      setTimeout(() => {
        this.alertMessage = null;
        this.showAlertMessage = false;
      }, 4000)
    } else {
      const updatedUser: User = { ...this.user, medicines: medicines }
      this.userService.updateUser(this.user, updatedUser).subscribe()
      this.router.navigate(['/users', 'edit', this.user._id])
    }
  }

}
