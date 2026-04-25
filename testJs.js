let age = prompt("Enter your Age", 0);

if (age >= 25){
    alert("You're 25 years old or older");
} 


if (age < 100){
    alert("You're Less than 100 years old");
}

else{
    alert("You are above 100 Years old");
}

for(let i = 0; i <= 30; i++ ){

    document.writeln("<br>" + i);
}

document.writeln("<br>");

for(let i = 0; i < 40; i++){

    i += 1;

    document.writeln("<br>" + (i+1));
 
}

document.writeln("<br>");

for(let i = 40; i > 10; i--){

    i = i - 2;

    document.writeln("<br>" + (i+1));
    
}