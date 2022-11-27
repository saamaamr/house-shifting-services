const uBtn = document.getElementById('user')
const sBtn = document.getElementById('worker')

uBtn.addEventListener('click',(e)=>{    
    if(uBtn.attributes.value.value=="user"){
        localStorage.setItem('role','user')
    }
})

 console.log(sBtn.attributes.value.value)
sBtn.addEventListener('click',(e)=>{    
    if(sBtn.attributes.value.value=="worker"){
        localStorage.setItem('role','worker')
    }
})
