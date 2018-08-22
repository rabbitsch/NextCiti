//Search cities
$(function(){
$(document).on('submit','#daformsearch',function(event){
  event.preventDefault();
  console.log('can you hear me search button')
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

  let htmlPost = `<h3 id="cityname">${data}</h3>`
  $("#citynameHere").html(htmlPost)

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
$(document).on('click','#postNote',function(event){
  event.preventDefault();
  console.log('can you hear me post button')
  const name= $("#formpost").children().children("#cityname").text()
  const pros= $('#pros').val();
  const cons= $('#cons').val();
  console.log(name)




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
    console.log(name)
    // console.log(JSON.stringify(response))
    if(response){
      $('#cityname').val(" ");
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



    // Get All and Render notes screen

    $(function(){
    $(document).on('click','#formgetall',function(event){
      event.preventDefault();
      console.log("Get all link has been clicked")

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
        <h1 class='notetitle'>${value.name}</h1>
        <h3>Pros</h3>
        <textarea class='notepro'>${value.pros}</textarea>
        <h3>Cons</h3>
        <textarea class='notecon'>${value.cons}</textarea>
        <p class='noteid'>${value.id}</p>
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

//Update part 1, to get ID
    $(document).on('click','.update-but',(event)=>{
      event.preventDefault();
      console.log("can you hear me update docu thingy")
      const noteId = $(event.currentTarget).siblings('.noteid').text()
      console.log(noteId)
      const name= $(event.currentTarget).siblings('.notetitle').text()
      const pros= $(event.currentTarget).siblings('.notepro').text()
      const cons= $(event.currentTarget).siblings('.notecon').text()
      const id= $(event.currentTarget).siblings('.noteid').text()



    $.ajax({
      url: `/api/city-reviews/${noteId}`, //Have joel review
      type:"PUT",
      data:({
        name:name,
        pros:pros,
        cons:cons,
        id:id
      }),
      success: function(response){
        console.log("<<<<<<<<< hi")

        if(response){
          console.log("can you hear me put success")

          //Become text area?
          name.val(" ");
          pros.val(" ");
          cons.val(" ");
          id.val(" ");

        }
      },
      error:(error)=>{
        console.log(JSON.stringify(error) + 'the post error man')
        }
          })
        });





    // Render Home Tab all info
      $(function(){
      $(document).on('click','#homeward',function(event){
        console.log('can you hear me home button!!')
        event.preventDefault();
        $('#getnotes').hide();
        $('#containsAll').show();
        })
      })



//Delete button
$(document).on('click','.delete-but',(event)=>{
  event.preventDefault();
  console.log("can you hear me delete button")
  const noteId = $(event.currentTarget).siblings('.noteid').text()
  console.log(noteId)
  $.ajax({
    url: `/api/city-reviews/${noteId}`, //have joel review this
    type:"DELETE",
    success: function(response){
      console.log(JSON.stringify(response))
      if(response){
        $('#cityname').val(" ");
        $('#pros').val(" ");
        $('#cons').val(" ");

      }
    },
    error:(error)=>{
      console.log(JSON.stringify(error) + 'the post error man')
      }
        })
      });




      //Rendering registration
      $(function(){
      $(".sign-but").click(function(event){
        event.preventDefault();
        $("#formcontentlogin").hide();
        renderRegister();
      })
      })

      function renderRegister(){

      let html1 =
        `
            <div class="content-box">
              <div id="formcontentreg">
                <form action="#" id="daformreg">
                  <label for="registeruser"></label>
                    <input type="text" placeholder= "Username" id="reguser">
                    </input>
                      <label for="registerpass"></label>
                    <input type="text" placeholder= "Password" id="regpass">
                    </input>
                      <label for="regfirstnm"></label>
                    <input type="text" placeholder= "First Name" id="regfirst">
                    </input>
                      <label for="reglastnm"></label>
                    <input type="text" placeholder= "Last Name" id="reglast">
                    </input>
                  <button class="create-but" type="submit">Create Login
                  </button>
                </form>
              </div>
            </div>
      `

      $(".contentformlogin").html(html1)
      }



      //register button
      $(function(){
      $("#daformreg").submit((event)=>{
        event.preventDefault();
        console.log('can you hear me register button')
        const username= $('#reguser').val();
        const password= $('#regpass').val();
        const firstName= $('#regfirst').val();
        const lastName= $('#reglast').val();

        console.log(username)
        console.log(lastName)
          $.ajax({
              url: '/api/users',
              type:"POST",
              data: JSON.stringify({
                username:username,
                password:password,
                firstName:firstName,
                lastName:lastName
              }),
              success: function(response){
                console.log(JSON.stringify(response))
                if(response){
                  $('#reguser').val('');
                  $('#regpass').val('');
                  $('#regfirst').val('');
                  $('#reglast').val('');
                }
        },
            headers: {
          'Content-Type': 'application/json',
        },
        error:(err)=>{
          console.log(JSON.stringify(err) + 'this be de eerrrrooorrrrr')
              }
            });
          });
        })




  //login button
      $(function(){
        var $loginForm = $(".sub-but-log");
        console.log({ $loginForm });
      $loginForm.click(function(event){
        console.log('login button pressed');
        event.preventDefault();
        const username= $('#loguser').val();
        const password= $('#logpass').val();

        $.ajax({
          url: '/api/login',
          type:"POST",
          data:({
            username:username,
            password:password
          }),
          success: function(response){
            console.log(response)
            sessionStorage.setItem('token', response.authToken);
            if(response){
              $('#loguser').val(" ");
              $('#logpass').val(" ");
              loginTransition();
            }
          },

        error: (error)=>{
          console.log(JSON.stringify(error) + 'this be the eerrrrooorrrrr')
        }

        });

        })
      })

//Log out function
  function logoutfunct(){
    $(document).click('#logoutlink',function(){
			location.reload();
		});
  }


// handle login transition
function loginTransition(){
  if (sessionStorage.getItem("token")){
    renderMainPage();
  }
  else{
    let html1 = `<h1>Incorrect username or password</h1>`
    $("#showError").html(html1);


  }
}
//Render main page
  function renderMainPage(){
    let htmlAll = `<header role ="banner">
       <div class="row">
         <div class="col-12">
           <nav class="navbar">
             <form id="homeward">
               <a href="#home" onclick ="renderHome()" id="homebut">Home</a>
             </form>
             <form id="formgetall">
                 <a id="but-sub-getall" onclick="renderGetallData()"type="submit">Your Notes
                 </a>
                 </form>
               <a class="job-but" href = "https://www.indeed.com">Local Jobs</a>
               <a class ="job-but" href = "https://www.craigslist.org">Apartments</a>

               <a href ="#logout" onclick="logoutfunct()" id="logoutlink">Log out</a>
        </nav>
        </div>
      </div>
        <div class="col-12">
          <div id="topTile">
            <h1 id="title"></h1>
          </div><!-- /#topTile -->
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div id="topTile">
            <h1 id="title-2"></h1>
           <h2 id = "latlon"></h2>
          </div>

          </div>
          </div><!-- /#topTile -->
        </div>
      </div> <!--/# ending the row -->

    </header>
  <main>
    <div class="row">
          <div class="col-10 offset-1">
                <section id="getnotes"></section>
          </div>
    </div>
    <section id="containsAll" role="region">
     <section class="container-form" role="region">
        <div class="row">
            <div class="col-7 offset-3">
              <form action="#" id="daformsearch">
                <label for="js-query"></label>
                <input type="text" placeholder= "NextCiti to Explore" id="js-query">
                </input>
              <button class="sub-but-search" type="submit">NextCiti
              </button>
              </form>
            </div>
        </div><!-- /.row -->
      </section><!-- /.container-form -->
      <section class = "container-note" role="region">
        <div class = "row">
          <div class ="col-12">
            <form id="formpost">
              <h3 id ="citynameHere"></h3>
                <textarea id="pros" rows = "4" style = "width: 50%" name="comment" form="usrform">Enter Pros text here...</textarea>
          <!-- </div> -->
          <!-- <div class = "col-5 offset-1"> -->
                <textarea id="cons" rows = "4" style = "width: 50%" name="comment" form="usrform">Enter Cons text here...</textarea>

              </div>
                <button id="postNote">Post Note</button>
        </div>
            </form>
      </section>
    <div class="city-contents"  aria-live="assertive" role="region">
        <div class="row">
          <div class="col-10 offset-1">
            <div class="content-box">
              <section id="wolfcontent" role="region"></section>
            </div><!-- /.content-box -->

          </div><!-- /.col-10 -->
        </div>

        <section class="row" role="region">
          <div class="col-5 offset-1">
            <div class="content-box">
              <div id="mapcontent">
                <div id="map">
                </div>
              </div>
            </div>

          </div>
          <div class="col-5">
          <div class="content-box">
            <div id="yelpcontent">
              <div class="yelp"></div>
            </div>
          </div>
          </div>
        </section>
      </div>
  </section>`

$("#containerHidelogin").hide();
  $("#containerMain").html(htmlAll)

  }
