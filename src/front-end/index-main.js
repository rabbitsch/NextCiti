
$(function(){
$("form").submit('submit',function(event){
  event.preventDefault();
  console.log('can you hear me button')
  let queryTarget= $(event.currentTarget).find('#js-query');
  let findings = queryTarget.val();

  queryTarget.val(" ");

  // console.log(findings)

    geocodingData(findings);

    // getMapData(findings);
    // renderTitle(findings);

    // secondWolf(findings);

   });

});


// function yelpApi(){
//   let url = 'https://api.yelp.com/v3/businesses/search'
// }



function secondWolf(searching){


 let url = `/wolfram?input=${searching}`


  $.getJSON(url,function(data){
    // console.log(data.queryresult.pods[1])
    renderWolfData(data);
  })
}



function renderWolfData(data){


 let html2 =

 `<h2>${data.queryresult.pods[1].title}</h2>
  <p>${data.queryresult.pods[1].subpods[0].plaintext}</p>

<img src ="${data.queryresult.pods[3].subpods[0].img}" alt = map-img>

<h2>${data.queryresult.pods[5].title}</h2>
<p>${data.queryresult.pods[5].subpods[0].plaintext}</p>

<h2>${data.queryresult.pods[6].title}</h2>
<p>${data.queryresult.pods[6].subpods[0].plaintext}</p>

<h2>${data.queryresult.pods[7].title}</h2>
<p>${data.queryresult.pods[7].subpods[0].plaintext}</p>

<h2>${data.queryresult.pods[9].title}</h2>
<p>${data.queryresult.pods[9].subpods[0].plaintext}</p>

<h2>${data.queryresult.pods[12].title}</h2>
<p>${data.queryresult.pods[12].subpods[0].plaintext}</p>`



  $("#wolfcontent").html(html2)


}


//Lat and long Title
function geocodingData(search){


  const params = {
    q: search,
    type: "GET"
  }
  $.getJSON(url,params,function(data){

    renderLatLon(data.results[0].geometry.location)

     let html1 = `<h1>${data.results[0].formatted_address}</h1>`
     // let htmlPost = `<h3 class="cityname">Note Name: ${data.results[0].formatted_address}</h3>`


 $("#title-2").html(html1)
 // $(".cityname").html(htmlPost)
 renderNotetitle(data.results[0].formatted_address);

  })
}


function renderNotetitle(data){
      console.log(data)
  let htmlPost = `<h3 class="cityname">Note Name: ${data}</h3>`
  $("#cityname").html(htmlPost)

}


//Render Latitude and Long
function renderLatLon(data){
  $("#latlon").html(" ")
let html = `<h2>${data.lat},${data.lng}</h2>`

// console.log(data)

 $("#latlon").html(html)


}



//POST Notes function

$(function(){
$("#formpost").submit(function(event){
  event.preventDefault();
  // console.log('can you hear me post button')
  const name= $('.cityname').val('.classname')
  const pros= $('#pros').val();
  const cons= $('#cons').val();



$.ajax({
  url: `/api/city-reviews`,
  type:"POST",
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    name:name,
    pros:pros,
    cons:cons
  }),
  success: function(response){
    // console.log(JSON.stringify(response))
    if(response){
      $('.cityname').val(" ");
      $('#pros').val(" ");
      $('#cons').val(" ");

    }
  },
  error:(error)=>{
    console.log(JSON.stringify(error) + 'the post error man')
    }
      })
    });
  });


//Down down menu
  // function myDropbutton() {
  //       document.getElementById("myDropdown").classList.toggle("show");
  //
  //
  //   // Close the dropdown menu if the user clicks outside of it
  //   window.onclick = function(event) {
  //     if (!event.target.matches('.dropbtn')) {
  //
  //       var dropdowns = document.getElementsByClassName("dropdown-content");
  //       var i;
  //       for (i = 0; i < dropdowns.length; i++) {
  //         var openDropdown = dropdowns[i];
  //         if (openDropdown.classList.contains('show')) {
  //           openDropdown.classList.remove('show');
  //         }
  //       }
  //     }
  //   }
  //   };


    // Get All and Render notes screen

    $(function(){
    $("#formgetall").click(function(event){
      event.preventDefault();

      $.ajax({
        url:`/api/city-reviews`,
        type:"GET",
        success:function(data){
          console.log(data)
              renderGetallData(data);
        },
        dataType:"json",
        contentType:"application/json"
      });

      // $('#containsAll').html(renderGetallData());
    })
    })


    //Render GET html
function renderGetallData(data){
      // console.log(data)

      let html = '<ul class="mynoteitems">'
      data.forEach(value =>{
        console.log(value)
        html += `<li class="note-list">
        <section id="totalnote">
        <div id="noteContainer">
        <h1 class='notetitle'>${value.name}</h1>
        <h3>Pros</h3>
        <p class='notepro'>${value.pros}</p>
        <h3>Cons</h3>
        <p class='notecon'>${value.cons}</p>
        </div>
        <button class='update-but'>Update</button>
        <button class='delete-but'>Delete</button>
        </section>
        </li>`
      })
    html += '</ul>';
    $('#containsAll').hide();
     $('#getnotes').html(html);
     $('#getnotes').show();

    }



    // Render Home Tab all info
      $(function(){
      $("#homeward").click(function(event){
        console.log('can you hear me render button!!')
        event.preventDefault();
        $('#getnotes').hide();
        $('#containsAll').show();
        })
      })
