"use strict"

const thicknessInp = document.getElementById("input-thickness");

thicknessInp.addEventListener('change', () => {

    if(thicknessInp.value>10) thicknessInp.value=10;
    if(thicknessInp.value<1) thicknessInp.value=1;
    
    state.thickness = +thicknessInp.value;

    refreshCanvas();
})