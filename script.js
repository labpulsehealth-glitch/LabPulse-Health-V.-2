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
