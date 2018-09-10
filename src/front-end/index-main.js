//Search cities
$(function(){
$(document).on('submit','#daformsearch',function(event){
  event.preventDefault();
  console.log('can you hear me search button')
  let queryTarget= $(event.currentTarget).find('#js-query');
  let findings = queryTarget.val();
  queryTarget.val(" ");

    geocodingData(findings);
    renderNotePad();
    fourSqAPI(findings);

    secondWolf(findings);

   });

});




//Edge case for Search Foursquare
function showNoContentError(){
  $(".showMyError").show();
  return $(".showMyError").html(`<section class="row" role="region">
          <div class="col-12">
            <p class="no-content-message">Unable to find results. Try searching for another city.
          </div>
        </section>`)

}





//Wolf Ram API
function secondWolf(searching){
 let url = `/wolfram?input=${searching}`
  $.getJSON(url,function(data){


    renderWolfData(data);
  })
}



//WolfRam Render
function renderWolfData(data){

  $("#wolfcontent").html(`<h2 class="conHead">City Info</h2>`);


   let html2 =

   `<section class="wolfcon">
      <h2 class="wolftitle">${data.queryresult.pods[1].title}</h2>
        <p class="wolfInfo">${data.queryresult.pods[1].subpods[0].plaintext}</p>
      <h2 class="wolftitle">${data.queryresult.pods[5].title}</h2>
        <p class="wolfInfo">${data.queryresult.pods[5].subpods[0].plaintext}</p>
      <h2 class="wolftitle">${data.queryresult.pods[6].title}</h2>
        <p class="wolfInfo">${data.queryresult.pods[6].subpods[0].plaintext}</p>
      <h2 class="wolftitle">${data.queryresult.pods[7].title}</h2>
        <p class="wolfInfo">${data.queryresult.pods[7].subpods[0].plaintext}</p>
      <h2 class="wolftitle">${data.queryresult.pods[9].title}</h2>
        <p class="wolfInfo">${data.queryresult.pods[9].subpods[0].plaintext}</p>
      <h2 class="wolftitle">${data.queryresult.pods[12].title}</h2>
        <p class="wolfInfo">${data.queryresult.pods[12].subpods[0].plaintext}</p>
    </section>`

  $("#wolfcontent").append(html2)

}


//Ajax call to Geocoding API, then renders LAT/LONG and Title
function geocodingData(search){
  let url = `/geo?address=${search}`
    $.getJSON(url,function(data){

      if(!data.results.length){
        return showNoContentError()

      }

        $(".showMyError").hide();
          let html1 = `<h1>${data.results[0].formatted_address}</h1>`
            $("#title-2").html(html1)

      renderNotetitle(data.results[0].formatted_address);
  })
}



//Restaurant API tap

function fourSqAPI(search){

    let url = `/four?near=${search}`
    console.log('can you hear me foursquare')

  $.getJSON(url,function(data){


     const info = data.response.groups[0].items
      renderFour(info);


  })
}


//Rendering popular spot

function renderFour(data){


  $("#restHere").html(`<h2 class="conHead">Local Popular Destinations</h2>`);
  $("#restHere").append(`<h2 class="conHead1">(Allow Bottom Content Brief Moment to Load)</h2>`);

    let html = '<ul class="rest-list">'
      data.forEach(function(result){

    html +=

    `<li class="restcontent">
      <h2 class="restTitle">${result.venue.name}</h2>
        <p class="restType">Type of place: ${result.venue.categories[0].name}</p>
        <p class="restLoc">${result.venue.location.address}</p>
        <p class="restCity">${result.venue.location.city},${result.venue.location.state}</p>
    </li>`
  })
  html += '</ul>';

  $("#restHere").append(html)


}




function renderNotetitle(data){

  let htmlPost = `<h3 id="cityname">${data}</h3>`
  $("#citynameHere").html(htmlPost)

}






//POST Notes function

$(document).on('click','#postNote',function(event){
  event.preventDefault();
  console.log('can you hear me post button')
  const name= $("#formpost").children().children("#cityname").text()
  const pros= $('#pros').val();
  const cons= $('#cons').val();


  $.ajax('/api/users/whoami', {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    }
  })
    .then((data, txtStatus, jqXHR) => {


      return $.ajax({
        url: '/api/city-reviews',
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        data: JSON.stringify({
          name: name,
          pros: pros,
          cons: cons,
          user: data.id,
        })
      })
    })
    .then((res) => {


      if(res) {
        $('#cityname').val('');
        $('#pros').val('');
        $('#cons').val('');
      }
    })
    .catch((error) => {
      console.error(JSON.stringify(error) + 'the post error man')
    })
})



    // Get All and Render notes screen
let noteData = [];
    $(function(){

    $(document).on('click','#formgetall',function(event){
      event.preventDefault();
      console.log("Get all link has been clicked")

      $.ajax({
        url:`/api/city-reviews`,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        // type:"GET",
        success:function(data){
          noteData = data

              renderGetallData();
        },
        dataType:"json",
        contentType:"application/json"
      });


    })
    })


    //Render GET html.. The "your notes" section
function renderGetallData(){
      // console.log(data)

      let html = '<ul class="mynoteitems">'
      noteData.forEach(value =>{

        html += `
    <li class="note-list">
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
        </li>
        `
      })
    html += '</ul>';
    $('#containsAll').hide();
    $('#topTile-2').hide();
     $('#getnotes').html(html);
     $('#getnotes').show();

    }

//Update part 1, to get ID
$(function(){
    $(document).on('click','.update-but',(event)=>{
      event.preventDefault();
      console.log("can you hear me update docu thingy")
      const noteId = $(event.currentTarget).siblings('.noteid').text()

      const newName= $(event.currentTarget).siblings('.notetitle').text()
      const newPros= $(event.currentTarget).siblings('.notepro').val()
      const newCons= $(event.currentTarget).siblings('.notecon').val()
      const newId= $(event.currentTarget).siblings('.noteid').text()


    $.ajax({
      url: `/api/city-reviews/${noteId}`, //Have joel review
      type:"PUT",
      data:({
        name:newName,
        pros:newPros,
        cons:newCons,
        id:newId
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

      });



    // Render Home Tab all info
      $(function(){
      $(document).on('click','#homeward',function(event){
        console.log('can you hear me home button!!')
        event.preventDefault();
        $('#getnotes').hide();
        $('#topTile-2').show();
        $('#containsAll').show();
        })
      })



//Delete button
$(function(){
$(document).on('click','.delete-but',(event)=>{
  event.preventDefault();
  console.log("can you hear me delete button")
  const noteId = $(event.currentTarget).siblings('.noteid').text()



  $.ajax({
    url: `/api/city-reviews/${noteId}`, //have joel review this
    type:"DELETE",
    success: function(response){
      console.log('hello delete button success')
      noteData = noteData.filter(note=>{
        if(noteId!=note.id){
          return true
        }
        else{
          return false
        }
      })
        renderGetallData();
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
      $(document).on('click','.create-but',function(event){
        event.preventDefault();
        console.log('can you hear me register button')
        const username= $('#reguser').val();
        const password= $('#regpass').val();
        const firstName= $('#regfirst').val();
        const lastName= $('#reglast').val();

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

            if (response) {
              $('#reguser').val('');
              $('#regpass').val('');
              $('#regfirst').val('');
              $('#reglast').val('');
            }

            location.reload();
          },
          headers: {
            'Content-Type': 'application/json',
          },
          error:(err)=> {
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

            sessionStorage.setItem('token', response.authToken);
            if(response){
              $('#loguser').val(" ");
              $('#logpass').val(" ");
              loginTransition();
            }
          },
        error: (error)=>{
          console.log(JSON.stringify(error) + 'this be the eerrrrooorrrrr')
          handleErrorJWT(error);
        }
      });
    })
  })

// Login ERROR handle
  function handleErrorJWT(err){
  $('#showError').html(`
    <p class="reg-err">Incorrect username or password.</p>
  `);
}


//Log out function
  function logoutfunct(){
    $(document).click('#logoutlink',function(){
			location.reload();
		});
  }


//Render Note pad
function renderNotePad(){


  $("#myPostFormRen").html(`<h2 id="noteHeader">Enter Your Notes Here</h2>`);

  let htmlPad =     `

        <form id="formpost">
          <div class = "container-note" role="region">
          <div class ="cont-note">
            <h3 id ="citynameHere"></h3>
              <textarea id="pros" rows = "4" style = "width: 50%" name="comment" form="usrform">Enter Pros text here...</textarea>
              <textarea id="cons" rows = "4" style = "width: 50%" name="comment" form="usrform">Enter Cons text here...</textarea>
          </div>
              <button id="postNote">Post Note</button>
          </div>
      </form>`
      $("#myPostFormRen").append(htmlPad)
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
         <div class="col-10 offset-1">

            <nav class="navbar" role="navigation">
              <div class="dropdown">
                <button class="dropbtn" onclick="myDropMenu()">Navigation Menu
                  <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content" id="myDropdown">
                    <form id="homeward">
                      <a href="#home" onclick ="renderHome()" id="homebut">Home</a>
                    </form>
                    <form id="formgetall">
                      <a id="but-sub-getall" onclick="renderGetallData()"type="submit">Your Notes
                      </a>
                    </form>
                      <a class="job-but" href = "https://www.indeed.com" target="_blank">Local Jobs</a>
                      <a class ="job-but" href = "https://www.craigslist.org" target="_blank">Apartments</a>
                      <a class="job-but" href ="https://rabbitsch.github.io/Hobbist2/" target="_blank"> Learn a new Hobby!</a>
                      <a href ="#logout" onclick="logoutfunct()" id="logoutlink">Log out</a>
                </div>
              </div>
            </nav>
        </div>
      </div>

        <div class="col-10 offset-1">
          <div id="topTile">
            <h1 id="title"></h1>
          </div><!-- /#topTile -->
        </div>


      <div class="row">
        <div class="col-10 offset-1">
          <div id="topTile-2">
            <h1 id="title-2"></h1>
              <h2 id ="latlon"></h2>
          </div>
        </div>
      </div> <!--/# ending the row -->

    </header>
  <main role="main">
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
                <input type="text" placeholder= "Type in a Citi to Explore" id="js-query"></input>
                <input class="sub-but-search" type="submit" value="NextCiti"></input>
              </form>
            </div>
        </div><!-- /.row -->
      </section><!-- /.container-form -->
      <div class = "row">
        <div class ="col-10 offset-1">
          <section class="showMyError"></section>

            <section id="myPostFormRen" role="region"></section>

        </div>
      </div>
    <div class="city-contents"  aria-live="assertive" role="region">
    <div class="row">
      <div class="col-10 offset-1">
        <div class="content-box">
          <section id="restHere" role="region"></section>
        </div><!-- /.content-box -->

      </div><!-- /.col-10 -->
    </div>
        <div class="row">
          <div class="col-10 offset-1">
            <div class="content-box" aria-live="assertive">
              <section id="wolfcontent" role="region"></section>
            </div><!-- /.content-box -->

          </div><!-- /.col-10 -->
        </div>


  </section>
<script>
  function myDropMenu() {
      document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(e) {
      if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
          if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
          }
        }
      }
</script>
  `

$("#containerHidelogin").hide();
  $("#containerMain").html(htmlAll)

  }
