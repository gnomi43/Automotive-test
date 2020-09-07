window.addEventListener('DOMContentLoaded', () => {
  `use strict`;

    const url = `https://rawgit.com/Varinetz/e6cbadec972e76a340c41a65fcc2a6b3/raw/90191826a3bac2ff0761040ed1d95c59f14eaf26/frontend_test_table.json`;
    let objAvtoItem = {};
    let arrAvtoId = [];

    const avtoList = document.querySelector("#avto-list");
    const avtoForm = document.querySelector(".main__form");


    // функция для запроса данных - Начало

    const getResource = async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Could not fetch ${url}` +
          `, received ${res.status}`)
      };

      const body = await res.json();

      return body;
    };
    // функция для запроса данных - Конец

    // запрос данных - Начало
    getResource(url)
    .then(body => { 
      body.map( (arrItem, index) => {
                  objAvtoItem[index] = arrItem;
                  arrAvtoId.push(arrItem.id);
              });
          renderAvtoList(objAvtoItem);
    });
    // запрос данных - Конец

    // Добавление нового элемента - Начало
    avtoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        let maxId = Math.max.apply(null, arrAvtoId);
            maxId++;            

        const newItem = {
            id: maxId,
            title: event.target.name.value,
            description: event.target.description.value,
            year: Number(event.target.year.value),
            color: event.target.color.value,
            price: Number(event.target.price.value),
            status: event.target.status.value,
            
          };

          objAvtoItem[maxId] = newItem;

          renderAvtoList(objAvtoItem);

          avtoForm.reset();
    });
    // Добавление нового элемента - Конец

    // Рендер списка автомобилей - Начало
    const renderAvtoList = ( avtoObj ) => {

      if(Object.keys(avtoObj).length > 0){

        let arrAvtoItem = '';

        for (let avtoItem in avtoObj) {
    
          let { color, id, price, status, title, year, description = ""} = avtoObj[avtoItem];

          switch (status) {
            case "in_stock":
              status = "В наличии";
              break;
            case "pednding":
              status = "Ожидается";
              break;
            case "out_of_stock":
              status = "Нет в наличии";
              break;
          };

          price = String(price).replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g, " $1 ");

          arrAvtoItem += `<li class="avto__item" id="${id}"><div class="avto__item-colum box1"><p class="avto__item-text text-content">${title}</p><p class="avto__item-description">${description}</p></div><div class="avto__item-colum box2"><p class="avto__item-text">${year}</p></div><div class="avto__item-colum box3"><div class="avto__item-cirl ${color}"></div></div><div class="avto__item-colum box4"><p class="avto__item-text">${status}</p></div><div class="avto__item-colum box5"><p class="avto__item-text">${price} руб.</p></div>  <div class="avto__item-colum box6"><button class="avto__item-button">Удалить</button></div></li>`;
        
      };

        avtoList.innerHTML = arrAvtoItem;

      } else {
        avtoList.innerHTML = `<li class="avto__item-empty">Пока новых автомобилей нет</li>`;
      }
      
    };
    // Рендер списка автомобилей - Конец


    // Отслеживания появлений новых автомобилей - Начало
    let observer = new MutationObserver(() => {
      document.querySelectorAll(".avto__item .avto__item-button").forEach(item => {
          item.addEventListener("click", (event) => {
            const id = Number(event.target.closest("li").id);
            let delId = null;

            for (let key in objAvtoItem) {
              if(objAvtoItem[key].id === id){
                delId = key;
              };
            };

            delete objAvtoItem[delId];
            renderAvtoList(objAvtoItem);
          });
        });
    });
    
    observer.observe(avtoList, {
      childList: true 
    });
    // Отслеживания появлений новых автомобилей - Конец

    const inputsForm = document.querySelectorAll(".main__form-fieldset-input");
    const legendsInputsForm = document.querySelectorAll(".main__form-fieldset-input legend");

    inputsForm.forEach( (item, index) => {
      item.addEventListener("input", (event) => {

        if(event.target.value !== ""){
          legendsInputsForm[index].classList.remove("visually-hidden");
        } else {
          legendsInputsForm[index].classList.add("visually-hidden");
        }
        
      });
    });
});