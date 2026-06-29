let search = JSON.parse(localStorage.getItem("city")) || [];

const city = document.querySelector("#city");
const btn = document.querySelector("#btn");
const temp = document.querySelector("#temp");
const wind = document.querySelector("#wind");
const emoji = document.querySelector("#emoji");
const load = document.querySelector("#load");
const list = document.querySelector("#list");
const themebtn = document.querySelector("#themebtn");

const tempsaved = localStorage.getItem("temp");
const windsaved = localStorage.getItem("wind");
const emojisaved = localStorage.getItem("emoji");
const savedcolor = localStorage.getItem("bgcolor");
const themesaved = localStorage.getItem("theme");

if(tempsaved){
    temp.textContent = "TEMP = " + tempsaved + "°C";
}
if(windsaved){
    wind.textContent = "WINDSPEED = " + windsaved + "KM/H";
}
if(emojisaved){
     emoji.textContent = emojisaved;
}
if(themesaved === "dark"){
    document.body.classList.add("dark");
    
    themebtn.textContent = "🌙 Dark Mode"
} else if (savedcolor){
    document.body.style.backgroundColor = savedcolor;
}


btn.addEventListener("click", function (){

    load.style.display = "block";
    temp.textContent = "";
    wind.textContent = "";
    emoji.textContent = "";

    const cityname = city.value.toLowerCase();

      if(cityname === ""){
        alert("PLEASE ENTER A TASK");
        load.style.display = "none";
        return;
      }


     fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityname}`)

     .then(function (response){
      return response.json();
     })
     .then(function (data){
        

          if(!data.results || data.results.length === 0){

            temp.textContent = "";
            wind.textContent = "CITY IS NOT DEFINED";
            emoji.textContent = "❌";
            load.style.display = "none";
            return;
          }

          if(!search.includes(cityname)){
            search.push(cityname);
            localStorage.setItem("city", JSON.stringify(search));
          }
       
           render();

          city.value = "";

           const lat = (data.results[0].latitude);
           const lon = (data.results[0].longitude);

           

        return fetch (`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)

     })
       .then(function (response){
        return response.json();
       })
       .then(function (weatherdata){
       
           
       const weather = (weatherdata.current_weather);

       

       temp.textContent = "TEMP = " + weather.temperature + "°C";
       wind.textContent = "WINDSPEED = " + weather.windspeed + "KM/H";
       

       let icon = "";

        if(!document.body.classList.contains("dark")){

        if(weather.temperature > 35){
            icon = "🌞"
            document.body.style.backgroundColor = "orange";
            localStorage.setItem("bgcolor", "orange");
        }else if (weather.temperature >= 22){
            icon = "🌤️";
            document.body.style.backgroundColor = "yellow";
            localStorage.setItem("bgcolor", "yellow");
        } else {
            icon = "❄️";
            document.body.style.backgroundColor = "lightblue";
            localStorage.setItem("bgcolor", "lightblue");
        }

        emoji.textContent = icon;

         localStorage.setItem("temp", weather.temperature);
         localStorage.setItem("wind", weather.windspeed);
         localStorage.setItem("emoji", icon);

        load.style.display = "none";

    }

       })

       .catch(function (){

        load.style.display = "none";
       })
})
function render(){

    list.innerHTML = "";
    
    search.forEach(function (city, index){

        const li = document.createElement("li");
        li.textContent = city;

        const delbtn = document.createElement("button");
        delbtn.textContent = "DELETE";

        delbtn.addEventListener("click", function(){

            search.splice(index, 1);

            localStorage.setItem("city", JSON.stringify(search));

            render();
        })



        list.appendChild(li);
        li.appendChild(delbtn);
    })
};

city.addEventListener("keypress", function (e){

    if(e.key === "Enter"){
        btn.click();
    }
});

render();

themebtn.addEventListener("click", function(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        document.body.style.backgroundColor = "";

        localStorage.setItem("theme", "dark")
        themebtn.textContent = "🌙 Dark Mode"
    } else  {
        localStorage.setItem("theme", "light");
        themebtn.textContent = "☀️ Light Mode";

        const savedcolor = localStorage.getItem("bgcolor");

        if(savedcolor){
            document.body.style.backgroundColor = savedcolor;
        }
    }

});