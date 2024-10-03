const button = document.querySelector("button");
button.addEventListener("click", function(){
    const listLi = document.querySelectorAll("div");
    for (let i = 2; i < listLi.length; i++)
        if (i!=3){
            listLi[i].style.background = "green"; 
        }
        else{
            listLi[i].style.borderTopColor = "green"
        }
});
