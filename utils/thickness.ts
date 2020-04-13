import app from '../app';

import refreshCanvas from '../helpers/refreshCanvas';

const thicknessInp: HTMLInputElement = document.getElementById("input-thickness") as HTMLInputElement;

thicknessInp.addEventListener('change', () => {

    if(+thicknessInp.value>10) thicknessInp.value="10";
    if(+thicknessInp.value<1) thicknessInp.value="1";
    
    app.thickness = +thicknessInp.value;

    refreshCanvas();
})