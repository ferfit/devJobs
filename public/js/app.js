

document.addEventListener('DOMContentLoaded',()=>{
    //capturamos las skills
    const skills = document.querySelector('.lista-conocimientos');

    //si existen
    if(skills){
        skills.addEventListener('click',agregarSkills);
    }

})

const skills = new Set(); // El objeto Set permite almacenar valores únicos de cualquier tipo, incluso valores primitivos u referencias a objetos.

const agregarSkills = (e) =>{
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            //quitar del set y quitar la clase
            //console.log(e.target.textContent)
            skills.delete(e.target.textContent) //este add es un metodo de la clase new Set
            e.target.classList.remove('activo');
        } else {
            //agregar al set y agregar la clase
            //console.log(e.target.textContent)
            skills.add(e.target.textContent) //este add es un metodo de la clase new Set
            e.target.classList.add('activo');
        }
    } 

    //converimos el objet set en un arreglo, los 3 puntos es para hacer una copia de esa variable
    const skillsArray = [...skills]; 

    //Le asignamos el valor al input hidden del formulario crear publicacion
    document.querySelector('#skills').value = skillsArray;
}
