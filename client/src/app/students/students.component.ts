import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  studentSign(item:any){
     alert("success")
  }

  constructor() { }

  ngOnInit(): void {
  }

}
