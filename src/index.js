const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://api.escuelajs.co/api/v1/products';


localStorage.setItem('pagination', '5')
let firstPageLoad = true

//Triggered when the document is going to be unloaded
window.addEventListener('beforeunload', () => {
  console.log('Evento disparado onbeforeunload')
  localStorage.removeItem('pagination')
})

async function getData (api) {

  try {
    console.log('Se ejecutó Get data')
    const response = await fetch(api)
    const products = await response.json()
    console.log(products)
    console.log(products.length)

    if (products.length) {
      let output = products.map(product => {
        return `<article class="Card">
                  <img src=${product.images[0]} alt=${product.title}/>
                  <h2>
                    ${product.title}
                    <small>$ ${product.price}</small>
                  </h2>
                </article>`
      })
      //console.log(output)
  
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      output.forEach(article => {
        //console.log(article)
        newItem.innerHTML += article
      });
      
      $app.appendChild(newItem);
    
    } else {
      $observe.textContent = 'Todos los productos Obtenidos'
      intersectionObserver.unobserve($observe);
    }
    

  } catch (error) {
    console.log('Entré a los errores');
    console.error(error);
    console.log(error);
  }
}

//getData()


const loadData = async() => {

  if (firstPageLoad) {
    firstPageLoad = false
  } else {
    let actualPaginaion = Number(localStorage.getItem('pagination'))
    const offset = 10
    let nextPagination = actualPaginaion+offset
    localStorage.setItem('pagination', String(nextPagination))

  }

  console.log(localStorage.getItem('pagination'))
  await getData(`${API}?offset=${localStorage.getItem('pagination')}&limit=10`);
  //?offset=0&limit=10
  
}


const intersectionObserver = new IntersectionObserver(entries => {
  // logic...
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) {
      loadData()
    }
  })

}, {
  /*root: null por defecto (document) (el elemento que queremos observar) */
  /* El root es el viewport, así que estas son margenes que amplian el viewport en 
  este caso lo amplia imaginariamente 100px hacia abajo, es decir que si el objeto 
  observado toca al viewport + (100px abajo) se ejecuta el intersectionObserver*/
  rootMargin: '0px 0px 200px 0px', /* Arriba | Derecha | Abajo | Izquierda */
});

intersectionObserver.observe($observe);
