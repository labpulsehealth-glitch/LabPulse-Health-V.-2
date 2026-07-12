// ===============================
// LABPULSE HEALTH
// JavaScript Part 1
// ===============================

document.addEventListener("DOMContentLoaded", function () {

let labs = [

{
name:"Ace-Biomed Laboratories",
city:"Benin City",
verified:true,
tests:[
{name:"Malaria Test",price:3500},
{name:"Full Blood Count",price:6000},
{name:"Blood Glucose",price:2500}
]
},

{
name:"Alpha Diagnostics",
city:"Ogun",
verified:true,
tests:[
{name:"Malaria Test",price:3200},
{name:"Pregnancy Test",price:2000},
{name:"HIV Screening",price:4500}
]
},

{
name:"LifeCare Diagnostics",
city:"Lagos",
verified:false,
tests:[
{name:"Full Blood Count",price:5500},
{name:"Kidney Function Test",price:9000},
{name:"Liver Function Test",price:8500}
]
}

];

// ===============================
// PAGE NAVIGATION
// ===============================

window.showSection=function(section){

let pages=document.querySelectorAll(".page");

pages.forEach(function(page){

page.style.display="none";

});

let active=document.getElementById(section);

if(active){

active.style.display="block";

}

};

showSection("home");

// ===============================
// FIND LABS
// ===============================

window.findLabs=function(){

let search=document
.getElementById("searchInput")
.value
.toLowerCase()
.trim();

let output="";

labs.forEach(function(lab){

let matched=false;

lab.tests.forEach(function(test){

if(

lab.name.toLowerCase().includes(search) ||

lab.city.toLowerCase().includes(search) ||

test.name.toLowerCase().includes(search)

){

matched=true;

output+=`

<div class="lab-card">

<h3>${lab.name}</h3>

<p><strong>City:</strong> ${lab.city}</p>

<p><strong>Test:</strong> ${test.name}</p>

<p><strong>Price:</strong> ₦${test.price.toLocaleString()}</p>

<p>

${
lab.verified

?

'<span class="verified">✅ Verified by LabPulse</span>'

:

'<span class="pending">⏳ Pending Verification</span>'

}

</p>

</div>

`;

}

});

});

if(output===""){

output=`

<div class="lab-card">

<h3>No Results Found</h3>

<p>

No laboratories currently match your search.

</p>

</div>

`;

}

document.getElementById("labResults").innerHTML=output;

};

});
// ===============================
// COMPARE TEST PRICES
// ===============================

window.comparePrices = function(){

let search = document
.getElementById("compareInput")
.value
.toLowerCase()
.trim();

let results = "";

labs.forEach(function(lab){

lab.tests.forEach(function(test){

if(test.name.toLowerCase().includes(search)){

results += `

<div class="lab-card">

<h3>${lab.name}</h3>

<p><strong>Test:</strong> ${test.name}</p>

<p><strong>Price:</strong> ₦${test.price.toLocaleString()}</p>

<p><strong>Location:</strong> ${lab.city}</p>

${
lab.verified
?
'<span class="verified">✅ Verified</span>'
:
'<span class="pending">⏳ Pending</span>'
}

</div>

`;

}

});

});

if(results===""){

results=`

<div class="lab-card">

<h3>No Price Available</h3>

<p>No laboratory currently offers this test.</p>

</div>

`;

}

document.getElementById("compareResults").innerHTML = results;

};

// ===============================
// BOOK TEST
// ===============================

window.bookTest = function(){

let lab =
document.getElementById("labSelect").value;

let test =
document.getElementById("testSelect").value;

let date =
document.getElementById("bookingDate").value;

let time =
document.getElementById("bookingTime").value;

if(

lab==="Select a Laboratory" ||

test==="Select a Test" ||

date==="" ||

time===""

){

document.getElementById("bookingMessage").innerHTML=

"❌ Please complete all booking details.";

return;

}

document.getElementById("bookingMessage").innerHTML=

`
✅ Your booking request has been submitted successfully.

<br><br>

<b>Laboratory:</b> ${lab}<br>

<b>Test:</b> ${test}<br>

<b>Date:</b> ${date}<br>

<b>Time:</b> ${time}

<br><br>

The laboratory will confirm your appointment.
`;

};
// ===============================
// UPLOAD REPORT
// ===============================

window.uploadReport=function(){

let file=document
.getElementById("fileUpload")
.files[0];

if(!file){

document.getElementById("uploadMessage").innerHTML=

"Please choose a report first.";

return;

}

let li=document.createElement("li");

li.innerHTML=

`📄 ${file.name}`;

document
.getElementById("recordList")
.appendChild(li);

document
.getElementById("uploadMessage")
.innerHTML=

"✅ Report uploaded successfully.";

};

// ===============================
// SIMPLE PROFILE
// ===============================

window.saveProfile=function(){

let name=document.getElementById("profileName").value;

let email=document.getElementById("profileEmail").value;

let phone=document.getElementById("profilePhone").value;

alert(

"Profile Saved!\n\n"

+

name

+

"\n"

+

email

+

"\n"

+

phone

);

};
