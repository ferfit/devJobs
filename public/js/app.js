import axios from 'axios';
import Swal from 'sweetalert2';



document.addEventListener('DOMContentLoaded',()=>{
    //capturamos las skills
    const skills = document.querySelector('.lista-conocimientos');

    //si existen
    if(skills){
        skills.addEventListener('click',agregarSkills);
        //una vez que estamos en editar
        skillsSeleccionados();
    }

    //limpiar alertas
    let alertas = document.querySelector('.alertas');
    if(alertas){
        limpiarAlertas();
    }

    //elimina vacante
    const vacantesListado = document.querySelector('.panel-administracion');

    if(vacantesListado){
        vacantesListado.addEventListener('click', accionesListado);
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

const skillsSeleccionados = () =>{
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    
    //Agregamos nuevas skills, recordar que este metodo add, si ya existe no lo agrega
    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })

    //inyectamos en el input hidden
    const skillsArray = [...skills]; 
    document.querySelector('#skills').value = skillsArray;

}

const limpiarAlertas = () => {

    const alertas = document.querySelector('.alertas');

    const interval = setInterval(()=>{
        if( alertas.children.length > 0 ){
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0){
            alertas.parentElement.removeChild(alertas); //remueve el padre
            clearInterval(interval);
        }
    },1500);


}

//Eliminar vacantes
const accionesListado = e => {
    /* e.preventDefault();

    console.log(e.target.dataset.eliminar); */

    if(e.target.dataset.eliminar){

        Swal.fire({
            title: 'Estas seguro?',
            text: "No podras revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Eliminar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                //enviar con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                axios.delete(url,{params:{url}})
                .then(function(respuesta){
                    if(respuesta.status == 200){
                        Swal.fire(
                            'Eliminado!',
                            respuesta.data,
                            'success'
                          )
                    }
                });

                //Eliminar del dom
                e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
              
            }
          }).catch(()=>{
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:'No se puede eliminar'
            })
          })

    } else if(e.target.tagName === 'A') { // Si se hace click en un enlace
        window.location.href = e.target.href;
    }
}



