async function login(event){

event.preventDefault();

let email =
document.getElementById("email").value;

let password =
document.getElementById("password").value;

const response = await fetch(
'http://localhost:5000/login',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
email,
password
})
});

const result = await response.text();

if(result === "success"){

if(email === "admin@gmail.com"){
window.location.href =
"admin-dashboard.html";
}

else if(email === "doctor@gmail.com"){
window.location.href =
"doctor-dashboard.html";
}

else{
window.location.href =
"patient-dashboard.html";
}

}
else{
alert("Invalid Credentials");
}

}