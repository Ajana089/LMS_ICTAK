import { Component, OnInit } from '@angular/core';
import { Usermodel } from '../facultyregistration/users.model';
import { UserserviceService } from '../services/userservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

 

    title:String="Sign Up"
    
    //mobNumberPattern = "/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/"; 
    loginUser(item:any){
      alert("completed");
  
    }
  
    constructor(private userService:UserserviceService,private router:Router) { }
    userSingnup= new Usermodel("","","","","","","","","",0,false);
    
    ngOnInit(): void {
    }
  
    addUser()
    {
      this.userService.newUser(this.userSingnup);
      alert("Successfully Registered.please wait for approvel ");
      console.log(this.userSingnup);
      this.router.navigate(['']);
    }
    
  
  }
  